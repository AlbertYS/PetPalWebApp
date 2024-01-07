from django.db import models

from accounts.models import ShelterProfile

class Blog(models.Model):

    shelter_profile = models.ForeignKey(ShelterProfile, on_delete=models.CASCADE)
    num_components = models.PositiveIntegerField(null=False)
    title = models.CharField(max_length=8000, null=False)