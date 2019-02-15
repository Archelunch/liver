import json

from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import render
from django.utils.safestring import mark_safe

from quiz.models import Quiz, Category, Progress, Sitting, Question, QUser, QuizProgress
from mcq.models import MCQQuestion, Answer

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
        elif "watcher" == code:
            return render(request, 'watcher.html', {
            'quiz_url_json': mark_safe(json.dumps(url)),
            'quiz_object':quiz
            })
        else:
            return render(request, '403.html')
    else:
        return render(request, '404.html')


def quiz_player(request):
    return render(request, 'game_screen.html')


def validate_username(request):
    url = request.GET.get('url', None)
    quiz = Quiz.objects.filter(url=url).first()
    username = request.GET.get('username', None)
    quser = QUser(nickname=username, quiz=quiz, is_online=True)
    quser.save()
    data = {
        'resp': 200,
        'user_id': quser.id,
        'count': len(QUser.objects.filter(quiz=quiz, is_online=True))
    }
    return JsonResponse(data)


def validate_code(request):
    code = request.GET.get('code', '').lower()
    quiz = Quiz.objects.filter(user_code=code).first()
    data = {
        'resp': 200 if quiz else 404,
        'url': quiz.url if quiz else 404
    }
    return JsonResponse(data)


def leaderborad(request):
    url = request.GET.get('url', None)
    quiz = Quiz.objects.filter(url=url).first()
    username = int(request.GET.get('name', -100))
    users = QUser.objects.filter(quiz=quiz).order_by('-score')
    users_board = []
    user_in_list = False
    for ind, user in enumerate(users[:10]):
        data = {'position':ind+1, 'name':user.nickname, 'score':user.score}
        if user.id == username:
            data['class'] = 'user'
            user_in_list = True
        elif ind == 0:
            data['class'] = 'top'
        else:
            data['class'] = ''
        users_board.append(data)
    if not user_in_list and username != -100:
        user = QUser.objects.filter(id=username, quiz=quiz).first()
        user_personal = {'name':user.nickname, 'score':user.score, 'class':'user'}
        for ind, user_s in enumerate(users):
            if user.id == user_s.id:
                user_personal['position'] = ind+1
                break
        return render(request, 'leaderboard.html', {'users':users_board, 'user_personal':user_personal})
    return render(request, 'leaderboard.html', {'users':users_board})


def voter(request, url):
    quiz = Quiz.objects.filter(url=url).first()
    if quiz:
        quiz_manager = QuizProgress.objects.new_sitting(quiz)
        question = quiz_manager.get_first_question()
        data = {
        "question_id": question.id,
        "questionText": str(question),
        "answers": {ind:str(ans) for ind, ans in enumerate(question.get_answers())},
        "ids": {ind:ans.id for ind, ans in enumerate(question.get_answers())},
        "is_started" : quiz.is_started,
        "range": range(len([str(ans) for ans in question.get_answers()]))
        }
        print({ind:ans.id for ind, ans in enumerate(question.get_answers())})
        print(data['answers'][data['range'][0]])
        return render(request, 'voterka.html', data)
    return render(request, '404.html')


def vote(request):
    question_id = request.GET.get('question_id', None)
    answer_id = request.GET.get('answer_id', None)
    question = MCQQuestion.objects.filter(id=question_id).first()
    data = { 200 if question.check_if_correct(answer_id) else 500}
    return JsonResponse(data)


def voter_panel(request, url, code):
    quiz = Quiz.objects.filter(url=url).first()
    if quiz:
        if "master" == code:
            quiz.is_started = True
            quiz.save()
            if request.method == 'POST':
                quiz.is_started = False
                quiz.save()
                return render(request, 'master_voterka.html')
            return render(request, 'master_voterka.html')
        elif "watcher" == code:
            quiz_manager = QuizProgress.objects.new_sitting(quiz)
            question = quiz_manager.get_first_question()
            data = {
            "question_id": question.id,
            "questionText": str(question),
            "answers": [str(ans) for ans in question.get_answers()],
            "ids": [ans.id for ans in question.get_answers()],
            "is_started" : int(quiz.is_started),
            "range": range(len([str(ans) for ans in question.get_answers()]))
            }
            return render(request, 'watcher_voterka.html', data)
        else:
            return render(request, '403.html')
    return render(request, '404.html')