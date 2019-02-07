import json

from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import render
from django.utils.safestring import mark_safe

from quiz.models import Quiz, Category, Progress, Sitting, Question, QUser

# Create your views here.
def quiz_start(request, url, code):
    quiz = Quiz.objects.filter(url=url).first()
    if quiz:
        if "master" == code:
            return render(request, 'quiz_master.html', {
                'quiz_url_json': mark_safe(json.dumps(url)),
                'quiz_object':quiz
            })
        elif "user" == code:
            return render(request, 'game_screen.html', {
            'quiz_url_json': mark_safe(json.dumps(url)),
            'quiz_object':quiz
            })
        else:
            return render(request, '403.html')
    else:
        return render(request, '404.html')


def validate_username(request):
    url = request.GET.get('url', None)
    quiz = Quiz.objects.filter(url=url).first()
    username = request.GET.get('username', None)
    quser = QUser(nickname=username, quiz=quiz, is_online=True)
    quser.save()
    data = {
        'resp': 200,
        'count': len(QUser.objects.filter(quiz=quiz, is_online=True))
    }
    return JsonResponse(data)


def validate_code(request):
    code = request.GET.get('code', None)
    data = {
        'resp': 200,
        'code': code
    }
    return JsonResponse(data)


def leaderborad(request):
    url = request.GET.get('url', None)
    quiz = Quiz.objects.filter(url=url).first()
    username = request.GET.get('name', None)
    users = QUser.objects.filter(quiz=quiz).order_by('-score')
    users_board = []
    user_in_list = False
    for ind, user in enumerate(users[:10]):
        data = {'position':ind+1, 'name':user.nickname, 'score':user.score}
        if user.nickname == username:
            data['class'] = 'user'
            user_in_list = True
        elif ind == 0:
            data['class'] = 'top'
        else:
            data['class'] = ''
        users_board.append(data)
    if not user_in_list:
        user = QUser.objects.filter(nickname=username, quiz=quiz).first()
        user_personal = {'name':user.nickname, 'score':user.score, 'class':'user'}
        for ind, user_s in enumerate(users):
            if user.id == user_s.id:
                user_personal['position'] = ind+1
                break
        return render(request, 'leaderboard.html', {'users':users_board, 'user_personal':user_personal})
    return render(request, 'leaderboard.html', {'users':users_board})