from django.db import models
from django.contrib.auth.models import AbstractUser


class User (AbstractUser):
    USER_TYPE_CHOICES = (
        (1, 'user'),
        (2, 'shelter'),
    )

    # repeat_password does nothing, it just acts to allow the registration serializers to have a repeat_password field.
    # Users will not have an actual saved repeat_password field.
    # see https://stackoverflow.com/questions/14583816/how-to-add-custom-field-in-modelserializer
    def repeat_password(self):
        return None

    user_type = models.PositiveSmallIntegerField(choices=USER_TYPE_CHOICES)
    REQUIRED_FIELDS = ['user_type']
