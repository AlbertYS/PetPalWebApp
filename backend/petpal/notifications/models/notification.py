from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.apps import apps
from django.utils import timezone

from accounts.models import User


class Notification(models.Model):
    STATUS_CHOICES = (
        (1, 'Unread'),
        (2, 'Read'),
    )

    # generic foreign key allows association with either an Application or a ShelterProfile, or a parent comment
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True)
    object_id = models.PositiveIntegerField()
    link_to = GenericForeignKey('content_type', 'object_id')

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    content = models.CharField(max_length=200)
    creation_time = models.DateTimeField(null=False, default=timezone.now)

    status = models.PositiveSmallIntegerField(null=False, choices=STATUS_CHOICES)

    def get_user_model(self):
        User = apps.get_model('accounts', 'User')
        return User

