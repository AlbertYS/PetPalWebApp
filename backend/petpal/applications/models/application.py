from django.contrib.contenttypes.fields import GenericRelation
from django.db import models
from django.utils import timezone

from comments.models import Comment
from listings.models import Listing
from accounts.models import UserProfile


class Application(models.Model):
    STATUS_CHOICES = (
        (1, 'Pending'),
        (2, 'Accepted'),
        (3, 'Denied'),
        (4, 'Withdrawn')
    )

    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    status = models.PositiveSmallIntegerField(null=False, choices=STATUS_CHOICES)

    first_name = models.CharField(max_length=200, null=False)
    last_name = models.CharField(max_length=200, null=False)
    email = models.EmailField(max_length=200, null=False)
    phoneNum = models.CharField(max_length=200, null=False)
    address = models.CharField(max_length=200, null=False)

    proof_of_identity = models.ImageField(upload_to='images')

    creation_time = models.DateTimeField(null=False, default=timezone.now)
    last_modified = models.DateTimeField(null=False, auto_now=timezone.now)

    comments = GenericRelation(Comment)
