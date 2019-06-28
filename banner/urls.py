from django.urls import path, include

from . import views

urlpatterns = [
    path('', views.voted, name='mehvote'),
    path('watcher', views.main_screen, name='watcher'),
]