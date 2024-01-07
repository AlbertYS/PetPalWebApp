from django.db import models
from .imageAlbum import ImageAlbum


class ImageModel(models.Model):
    # model that holds an image, and is associated with an ImageAlbum model
    image = models.ImageField(null=False)
    album = models.ForeignKey(ImageAlbum, related_name="images", on_delete=models.CASCADE)
