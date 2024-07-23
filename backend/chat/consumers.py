import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from chat.models import Interest, Message, User
from chat.serializers import InterestSerializer, MessageSerializer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.roomGroupName = f"user_{self.user.id}"
        await self.channel_layer.group_add(self.roomGroupName, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.roomGroupName, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_content = text_data_json.get("message", None)
        receiver_id = text_data_json.get("receiver", None)
        sender = self.scope["user"]

        # Check if the message content is available
        if not message_content:
            await self.send(text_data=json.dumps({"error": "Message content is required"}))
            return

        # Check if the receiver ID is available
        if not receiver_id:
            await self.send(text_data=json.dumps({"error": "Receiver is required"}))
            return

        # Fetch the receiver user instance
        receiver = await self.get_user_by_id(receiver_id)
        if receiver is None:
            await self.send(text_data=json.dumps({"error": "Receiver does not exist"}))
            return

        # Check if an Interest already exists or create a new one
        interest, created = await self.get_or_create_interest(sender, receiver)

        if not created:
            # Check if the Interest is active
            if not interest.status == Interest.StatusChoices.ACCEPTED:
                await self.send(
                    text_data=json.dumps({"error": "Interest is yet not accepted"})
                )
                return

        # Save the message to the database
        message = await self.create_message(interest, sender, receiver, message_content)

        # Serialize the message
        message_serializer = MessageSerializer(message)
        serialized_message = message_serializer.data

        # Prepare the data to broadcast
        broadcast_data = {
            "message": serialized_message,
        }

        # Include serialized Interest details if newly created
        if created:
            serializer = InterestSerializer(interest)
            broadcast_data["interest"] = serializer.data
            broadcast_data["interestExists"] = True

        await self.channel_layer.group_send(
            self.roomGroupName,
            {
                "type": "sendMessage",
                "message": broadcast_data,
            },
        )

        # Check if the receiver group exists
        
        await self.channel_layer.group_send(
                f"user_{receiver.id}",
                {
                    "type": "sendMessage",
                    "message": broadcast_data,
                },
            )

    async def sendMessage(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps(message))

    # Helper methods

    @database_sync_to_async
    def get_user_by_id(self, id):
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def get_or_create_interest(self, sender, receiver):
        id = None
        if sender.id < receiver.id:
            id = f"{sender.id}_{receiver.id}"
        else:
            id = f"{receiver.id}_{sender.id}"
        interest = Interest.objects.filter(id=id).first()

        if interest:
            return (interest, False)
        else:
            return (Interest.objects.create(sender=sender, receiver=receiver), True)

    @database_sync_to_async
    def create_message(self, interest, sender, receiver, content):
        return Message.objects.create(
            interest=interest, sender=sender, receiver=receiver, content=content
        )
