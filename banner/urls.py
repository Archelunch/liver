from django.urls import path, include

from . import views

urlpatterns = [
    path('watcher', views.main_screen, name='watcher'),
    path('', views.voted, name='mehvote'),
]