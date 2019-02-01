from django.urls import path, include

from . import views

urlpatterns = [
    path('<url>/<code>', views.quiz_start, name='quiz_room'),
    path('validate_username', views.validate_username, name='validate_username'),
    path('validate_code', views.validate_code, name='qvalidate_code'),
]