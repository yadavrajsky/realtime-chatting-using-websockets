# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from django.db.models import Q
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model, authenticate, login, logout
from .utils.captcha import generate_captcha
from .models import Captcha, Interest, Message
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    CaptchaSerializer,
    InterestSerializer,
    MessageSerializer,
)
from .custom_auth import CustomJWTAuthentication
from django.utils.decorators import method_decorator
from rest_framework.exceptions import NotFound

# Get User Model globally
User = get_user_model()
# User Registration


class UserRegistrationAPIView(APIView):
    def post(self, request):
        try:
            # Create a UserSerializer instance with the request data
            serializer = UserRegistrationSerializer(data=request.data)
            # Check if the serializer is valid before proceeding
            if serializer.is_valid():
                # Save the user and return a success response
                print(serializer.validated_data)
                serializer.save()
                return Response(
                    {
                        "status": True,
                        "data": serializer.data,
                        "message": "User created successfully",
                    },
                    status=status.HTTP_201_CREATED,
                )
            # If the serializer is not valid, return an error response
            return Response(
                {"status": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            # Handle any exceptions that might occur during user registration
            return Response(
                {"status": False, "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# User Login
class UserLoginViewAPIView(APIView):
    def post(self, request):
        try:
            # Get email and password from request data
            email = request.data.get("email", None)
            password = request.data.get("password", None)

            print(email, password)

            # Validate email and password
            if not email or not password:
                raise ValueError("Email and password are required.")

            # Authenticate user
            user = authenticate(request, username=email, password=password)

            print(user)

            if user is not None:
                # Log in the user
                login(request, user)

                # Generate tokens
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)

                # Serialize user data
                serializer = UserSerializer(user)
                data = serializer.data

                # Add email and is_staff fields
                data["email"] = user.email
                data["is_staff"] = user.is_staff

                # Set the access token in the cookie
                response = Response(
                    {"status": True, "data": data, "message": "Login successful"},
                    status=status.HTTP_200_OK,
                )

                # Set the access_token cookie with Path='/'
                response.set_cookie(
                    "access_token", access_token, httponly=True, path="/"
                )

                # Set the refresh_token cookie with Path='/api/logout'
                response.set_cookie(
                    "refresh_token", str(refresh), httponly=True, path="/api/logout"
                )

                return response
            else:
                raise ValueError("Invalid credentials")

        except Exception as e:
            # Handle any exceptions that might occur during login
            return Response(
                {"status": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST
            )


# Logout
class UserLogoutViewAPIView(APIView):
    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token")

            if refresh_token:
                logout(request)
                response = Response(
                    {"status": True, "data": {"message": "Logout successful"}},
                    status=200,
                )

                for cookie_name in request.COOKIES:
                    response.delete_cookie(cookie_name)
                # Blacklist the refresh token
                token = RefreshToken(refresh_token)
                token.blacklist()

                # Create a response

                # Delete all cookies

                return response
            else:
                return Response(
                    {"status": False, "error": "Invalid or missing tokens"}, status=400
                )
        except Exception as e:
            return Response({"status": False, "error": str(e)}, status=500)


class UserListSearchAPIView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get the search term from query parameters
        search_term = request.query_params.get("search", "")

        # Filter users by id or email or name containing the search term
        users = User.objects.filter(
            id__icontains=search_term, email__icontains=search_term
        ) | User.objects.filter(name__icontains=search_term)

        # Serialize the filtered user data
        serializer = UserSerializer(users, many=True)

        # Return the serialized data directly
        return Response(
            {"status": True, "data": serializer.data}, status=status.HTTP_200_OK
        )


class LoggedInUserInfoAPIView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        data = serializer.data
        # Add email and is_staff fields
        data["email"] = user.email
        data["is_staff"] = user.is_staff
        # Set the access token in the cookie
        response = Response(
            {
                "status": True,
                "data": data,
            },
            status=status.HTTP_200_OK,
        )
        return response


class UserInfoAPIView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response(
                {
                    "status": False,
                    "error": "User not found.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = UserSerializer(user)
        data = serializer.data

        return Response(
            {
                "status": True,
                "data": data,
            },
            status=status.HTTP_200_OK,
        )


class SecretViewAPIView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "You accessed a protected resource!"})


# Generate Captcha


class CaptchaAPIView(APIView):
    # Define the post method for handling POST requests
    def post(self, request):
        try:
            # Delete already existed captcha
            captcha_id = request.data.get("captcha_id", None)
            if captcha_id:
                captcha = Captcha.objects.filter(id=captcha_id).first()
                if captcha:
                    captcha.delete()
            # Generate Captcha ID and Image
            captcha_str, image_base64 = generate_captcha()
            captcha_image_data_url = f"data:image/png;base64,{image_base64}"
            # Create a CaptchaSerializer instance with the generated captcha answer
            serializer = CaptchaSerializer(data={"captcha_answer": captcha_str})
            # Validate and store the captcha ID and answer in the database
            if serializer.is_valid():
                captcha = serializer.save()
                if captcha:
                    # Return a success response with captcha ID and image
                    return Response(
                        {
                            "status": True,
                            "data": {
                                "captcha_id": captcha.id,
                                "captcha": captcha_image_data_url,
                            },
                        },
                        status=status.HTTP_201_CREATED,
                    )
                else:
                    # Return an error response if unable to save captcha
                    return Response(
                        {"status": False, "error": "Unable to save captcha"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                # Return an error response with validation errors
                return Response(
                    {"status": False, "error": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Exception as e:
            # Return an error response if an exception occurs
            return Response(
                {"status": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST
            )


# Interest Detail API View
class InterestDetailAPIView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, id):
        try:
            return Interest.objects.get(id=id)
        except Interest.DoesNotExist:
            raise NotFound(detail="Interest not found")

    def get(self, request, id, *args, **kwargs):
        try:
            interest = self.get_object(id)
            serializer = InterestSerializer(interest)
            return Response(
                {
                    "status": True,
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"status": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST
            )

    def put(self, request, id, *args, **kwargs):
        try:
            interest = self.get_object(id)
            serializer = InterestSerializer(interest, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "status": True,
                        "data": serializer.data,
                        "message": "Interest updated successfully",
                    },
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"status": False, "error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"status": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST
            )


class InterestListAPIView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_filtered_interests(self, user_id):
        # Filter for 'accepted' or 'rejected' statuses
        accepted_or_rejected = Interest.objects.filter(
            Q(status__in=[Interest.StatusChoices.ACCEPTED, Interest.StatusChoices.REJECTED]),
            Q(sender=user_id) | Q(receiver=user_id)
        )
        
        # Filter for 'pending' status
        pending = Interest.objects.filter(
            Q(status=Interest.StatusChoices.PENDING) & Q(sender=user_id)
        )
        
        # Combine the results
        # Set to keep unique Interest IDs
        interests_set = set()

        # Add IDs from accepted or rejected statuses
        for interest in accepted_or_rejected:
            if interest.sender != user_id:
                interests_set.add(interest.id)
            if interest.receiver != user_id:
                interests_set.add(interest.id)
        
        # Add only the IDs from pending statuses
        for interest in pending:
            interests_set.add(interest.id)

        # Fetch Interest objects by ID
        interests = Interest.objects.filter(id__in=interests_set)
        
        return interests


    def get(self, request, *args, **kwargs):
        # Get query parameters
        status_param = request.query_params.get("status")
        invitations = request.query_params.get("invitations")
        chat_users = request.query_params.get("chat_users")
        user_id = request.user.id

        # Start with a base queryset
        queryset = Interest.objects.filter(Q(sender=user_id) | Q(receiver=user_id))

        if status_param:
            queryset = queryset.filter(status=status_param)
        
        if chat_users:
            queryset = self.get_filtered_interests(user_id)
        elif invitations:
            queryset = queryset.filter(receiver=user_id)
        
        # Serialize the queryset
        serializer = InterestSerializer(queryset, many=True)

        return Response(
            {
                "status": True,
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

class InterestExistAPIView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        receiver_id = request.query_params.get("receiver_id")
        sender_id = str(request.user.id)

        # Ensure the sender and receiver are ordered in a consistent way
        if sender_id < receiver_id:
            interest_id = f"{sender_id}_{receiver_id}"
        else:
            interest_id = f"{receiver_id}_{sender_id}"

        # Check for the existence of the interest
        interest = Interest.objects.filter(id=interest_id)
        exists = interest.exists()

        if exists:
            interest = interest.first()
            serializer = InterestSerializer(interest)
            return Response(
                {"status": True, "data": serializer.data, "exists": True},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"status": True, "exists": False}, status=status.HTTP_200_OK
            )


class MessageListAPIView(APIView):
    authentication_classes = [CustomJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Get the current user
        user = request.user

        # Get the interest_id from query params
        interest_id = request.query_params.get("interest_id", None)

        # Filter messages by interest_id if provided
        if interest_id:
            try:
                interest = Interest.objects.get(id=interest_id)
            except Interest.DoesNotExist:
                return Response(
                    {"status": False, "error": "Interest not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Check if the user is either sender or receiver for the interest
            if not (interest.sender == user or interest.receiver == user):
                return Response(
                    {
                        "status": False,
                        "error": "You are not authorized to view messages for this interest",
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )
        else:
            interest = None
        queryset = Message.objects.filter(interest=interest)
        serializer = MessageSerializer(queryset, many=True)
        return Response(
            {
                "status": True,
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
