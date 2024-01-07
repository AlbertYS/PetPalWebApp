from django.contrib.contenttypes.fields import GenericRelation
from django.db import models

from .user import User
from .profile import Profile
from comments.models import Comment


class ShelterProfile (Profile):
    # other fields are from parent class
    user = models.OneToOneField(User, related_name='shelterProfile', on_delete=models.CASCADE)
    mission_statement = models.CharField(max_length=200, null=False)
    reviews = GenericRelation(Comment)





