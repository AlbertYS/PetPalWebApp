from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.apps import apps
from django.utils import timezone


class Comment(models.Model):
    # generic foreign key allows association with either an Application or a ShelterProfile, or a parent comment
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True)
    object_id = models.PositiveIntegerField()
    reply_to = GenericForeignKey('content_type', 'object_id')

    commenter = models.ForeignKey('accounts.User', on_delete=models.CASCADE, null=False)
    head = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    content = models.CharField(max_length=200)
    creation_time = models.DateTimeField(null=False, default=timezone.now)

    rating = models.SmallIntegerField(null=True, blank=True)

    def get_user_model(self):
        User = apps.get_model('accounts', 'User')
        return User

