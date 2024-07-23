# urls.py

from django.urls import path
from .views import (
    InterestExistAPIView,
    SecretViewAPIView,
    UserListSearchAPIView,
    UserRegistrationAPIView,
    UserLoginViewAPIView,
    CaptchaAPIView,
    UserLogoutViewAPIView,
    UserInfoAPIView,
    InterestDetailAPIView,
    InterestListAPIView,
    MessageListAPIView,
    LoggedInUserInfoAPIView,
)

urlpatterns = [
    path("captcha/", CaptchaAPIView.as_view(), name="register_user"),
    path("register/", UserRegistrationAPIView.as_view(), name="register_user"),
    path("login/", UserLoginViewAPIView.as_view(), name="login_user"),
    path("logout/", UserLogoutViewAPIView.as_view(), name="logout_user"),
    path("users/", UserListSearchAPIView.as_view(), name="user-list"),
    path("user/", LoggedInUserInfoAPIView.as_view(), name="user-list"),
    path("user/<str:id>/", UserInfoAPIView.as_view(), name="user-info"),
    path("secret/", SecretViewAPIView.as_view(), name="secret_view"),
    path("interests/", InterestListAPIView.as_view(), name="interest-list"),
    path("interest/check/", InterestExistAPIView.as_view(), name="interest-check"),
    path("interest/<str:id>/", InterestDetailAPIView.as_view(), name="interest-detail"),
    path("messages/", MessageListAPIView.as_view(), name="message-list"),
]
