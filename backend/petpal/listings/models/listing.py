from django.db import models
from django.utils import timezone

from accounts.models import ShelterProfile


class Listing (models.Model):

    STATUS_CHOICES = (
        (1, 'Available'),
        (2, 'Adopted'),
        (3, 'Pending'),
        (4, 'Withdrawn')
    )

    GENDER_CHOICES = (
        ("M", "Male"),
        ("F", "Female")
    )

    name = models.CharField(max_length=200, null=False)
    breed = models.CharField(max_length=200, null=False)
    age = models.IntegerField(null=False)
    gender = models.CharField(max_length=200, null=False, choices=GENDER_CHOICES)
    size = models.CharField(max_length=200, null=False)
    description = models.CharField(max_length=200, null=False)
    status = models.PositiveSmallIntegerField(null=False, choices=STATUS_CHOICES)
    location = models.CharField(max_length=200, null=False)
    publication_date = models.DateField(null=False, default=timezone.now)
    shelter_profile = models.ForeignKey(ShelterProfile, null=False, on_delete=models.CASCADE)


