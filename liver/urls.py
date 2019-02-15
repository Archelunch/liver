from django.urls import path, include

from . import views

urlpatterns = [
    path('', views.quiz_player, name='quiz_room'),
    path('validate_username', views.validate_username, name='validate_username'),
    path('validate_code', views.validate_code, name='validate_code'),
    path('leaderboard', views.leaderborad, name='leaderboard'),
    path('api/vote', views.vote, name="api.vote"),
    path('<url>', views.voter, name='vote_room'),
    path('<url>/v_<code>', views.voter_panel, name='vote_panel'),
    path('<url>/<code>', views.quiz_start, name='quiz_room'),
]