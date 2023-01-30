from django.shortcuts import render
from rest_framework import viewsets
from .serializers import UserSerializer
from .models import User
from django.http import request, HttpResponse
from bson.json_util import dumps
import json
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

class UsersView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()


# Codes to show how to do the actions without serializers and django_rest
@csrf_exempt
# code to create a new user
def create_user(request):
    if request.method == 'POST':
        # fetch data from the ajax post
        print("request body")
        print(request.body)
        # body_unicode = request.body.decode('utf-8')
        # received_data = json.loads(body_unicode)
        received_data = json.loads(request.body)
        person = received_data
        u = User(email=person['email'], username=person['username'])
        u.set_password(person['password'])
        u.save()

        response = dumps({
                'status': 'ok',
                "data": received_data,
            })

        return HttpResponse(response)


# code to deposit money
@csrf_exempt
def deposit(request):
    if request.method == 'POST':
        # fetch data from the ajax post
        body_unicode = request.body.decode('utf-8')
        received_data = json.loads(body_unicode)
        person = received_data
        username = person['username']
        deposit = float(person['deposit'])
        u = User.objects.filter(username=username).values()
        oldBalance = float(u.values_list("balance", flat=True).first())
        newBalance = oldBalance + deposit
        u.update(balance=newBalance)
        # u = User(email=person['email'], username=person['username'])
        # u.set_password(person['password'])
        # u.save()

        response = dumps({
                'status': 'ok',
                "data": u,
            })
        print(str(response))

        return HttpResponse(response)

    
# code to transfer money
@csrf_exempt
def transfer(request):
    if request.method == 'POST':
        # fetch data from the ajax post
        body_unicode = request.body.decode('utf-8')
        received_data = json.loads(body_unicode)
        person = received_data
        fromUsername = person['from']
        toUsername = person['to']
        amount = float(person['amount'])
        fromUser = User.objects.filter(username=fromUsername).values()
        toUser = User.objects.filter(username=toUsername).values()
        oldFromBalance = float(fromUser.values_list("balance", flat=True).first())
        oldToBalance = float(toUser.values_list("balance", flat=True).first())
        
        # update the giver and the receiver
        fromUser.update(balance=oldFromBalance - amount)
        toUser.update(balance=oldToBalance + amount)

        response = dumps({
                'status': 'ok',
                "data": toUser,
            })

        return HttpResponse(response)