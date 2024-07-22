from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        
        if header is None:
            # If the Authorization header is not present, try to get the token from the Cookie
            raw_token = request.COOKIES.get('access_token') or None
        else:
            # If the Authorization header is present, extract the token from it
            raw_token = self.get_raw_token(header)

        if raw_token is None:
            # If no token is found, raise an AuthenticationFailed exception
            raise AuthenticationFailed({'status': False, 'error': 'Missing Authentication'})

        # Validate the token and return the user and validated token
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token
