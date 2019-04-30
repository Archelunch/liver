from django.shortcuts import render, redirect
from quiz.models import Quiz, Category, Progress, Sitting, Question, QUser, QuizProgress

# Create your views here.
def login(request):
    if request.method == 'POST':
        if request.POST.get("passwordInput", "") == "mehpassword" and request.POST.get("loginInput", "") == "mehadmin":
            request.session['login'] = "mehadmin"
            redirect('quiz_list')
    return render(request, 'master-login.html')


def quiz_list(request):
    quizes = Quiz.objects.all()
    return render(request, "master-test.html")