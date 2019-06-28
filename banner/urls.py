from django.urls import path, include

from . import views

urlpatterns = [
    path('watcher', views.main_screen, name='mehikowatcher'),
    path('', views.voted, name='mehikovoter'),
]