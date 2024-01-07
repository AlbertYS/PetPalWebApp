from django.db import models
from .user import User

# Base class for user and shelter profiles. Contains fields shared between both kinds of profiles.


class Profile(models.Model):
    user = models.OneToOneField(User, related_name='Profile', on_delete=models.CASCADE)
    name = models.CharField(max_length=200, null=False)
    email = models.EmailField(max_length=200, null=False)
    phoneNum = models.CharField(max_length=200, null=False)
    address = models.CharField(max_length=200, null=False)

    class Meta:
        abstract = True
