from django.urls import path, include

from . import views

urlpatterns = [
    path('login', views.login, name='admin_login'),
    path('quizes', views.quiz_list, name='quiz_list'),
]