from django.db import models

from .listing import Listing


class ImageAlbum(models.Model):
    # Class for storing multiple images
    # use ImageAlbum.images to access the associated images
    id = models.IntegerField(primary_key=True, null=False)
    listing = models.OneToOneField(Listing, related_name="pictures", on_delete=models.CASCADE)
