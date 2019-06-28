from django.urls import path, include

from . import views

urlpatterns = [
    path('watcher', views.main_screen, name='mehikowatcher'),
    path('check_people', views.check_people, name='checkpeople'),
    path('', views.voted, name='mehikovoter'),
]