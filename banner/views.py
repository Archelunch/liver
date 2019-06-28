from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Voter, Speaker


# Create your views here.
def main_screen(request):
    return render(request, "main_screen.html")


def voted(request):
    user_id = request.session.get('userID', 'None')
    if user_id != 'None':
        user = Voter.objects.filter(id=int(user_id)).first()
        if request.method == "POST":
            if user.is_against:
                user.is_against = False
            else:
                user.is_against = True
            user.save()
            return redirect('mehikovoter')
        else:
            return render(request, 'mehikos.html', {'user':user})
    else:
        user = Voter()
        user.save()
        request.session['userID'] = str(user.id)
        return render(request, 'mehikos.html', {'user':user})


def check_people(request):
    game = Speaker.objects.filter(name="MEH").first()
    users = Voter.objects.all()
    users_against = Voter.objects.filter(is_against=True)
    data = {}
    data['users'] = len(users)
    data['against'] = len(users_against)
    data['percent'] = round(100.0 * len(users_against) / len(users), 1)
    data['right'] = 1 if data['percent'] <= 50.0 else 2
    data['started'] = game.is_started
    print(data)
    return JsonResponse(data)
