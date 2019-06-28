from django.db import models

# Create your models here.
class Voter(models.Model):
    is_against = models.BooleanField(default=False, blank=False,
                                   verbose_name="Is he dislike speaker?")


class Speaker(models.Model):
    name = models.TextField(verbose_name="Game's name")
    is_started = models.BooleanField(default=False, blank=False,
                                   verbose_name="Is started?")


