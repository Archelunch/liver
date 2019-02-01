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
    quser = QUser(nickname=username, quiz=quiz)
    quser.save()
    data = {
        'resp': 200
    }
    return JsonResponse(data)


def validate_code(request):
    code = request.GET.get('code', None)
    data = {
        'resp': 200,
        'code': code
    }
    return JsonResponse(data)
