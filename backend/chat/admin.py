from django.contrib import admin

# Register your models here.
from .models import User,Interest,Message
# Register your models here.
admin.site.register(User)
admin.site.register(Interest)
admin.site.register(Message) 