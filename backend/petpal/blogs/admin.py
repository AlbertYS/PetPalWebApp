from django.contrib import admin

from .models import Blog, Blurb, BlogImage

admin.site.register(Blog)
admin.site.register(Blurb)
admin.site.register(BlogImage)