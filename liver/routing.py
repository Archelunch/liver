from django.urls import path, include

from . import consumers

websocket_urlpatterns = [
    path('ws/quiz/<url>/', consumers.QuizConsumer),
]