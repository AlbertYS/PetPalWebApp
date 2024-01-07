from django.db import models

from .blog import Blog

class Blurb(models.Model):
    TYPES = (
        (1, 'Heading'),
        (2, 'Paragraph'),
    )

    content = models.CharField(max_length=8000, null=False)
    index = models.IntegerField(null=False)
    blog = models.ForeignKey(Blog, related_name='blurbs', on_delete=models.CASCADE)
    content_type = models.PositiveSmallIntegerField(null=False, choices=TYPES)
