from django.db import models

from .blog import Blog

class BlogImage(models.Model):
    content = models.ImageField(upload_to='images')
    index = models.IntegerField(null=False)
    blog = models.ForeignKey(Blog, related_name='blog_images', on_delete=models.CASCADE)