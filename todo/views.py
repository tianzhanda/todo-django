from django.shortcuts import render
from django.http.response import JsonResponse
# Create your views here.


def home(request):
    return render(request, "todo.html")

def history(request):
    return render(request, "history.html")