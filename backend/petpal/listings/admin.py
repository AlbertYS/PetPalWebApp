from django.contrib import admin

from .models import ImageAlbum, ImageModel, Listing

admin.site.register(ImageAlbum)
admin.site.register(ImageModel)
admin.site.register(Listing)
