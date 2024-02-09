from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import (ListView, )
from django.http import HttpResponse
from rest_framework import viewsets, permissions
import json

from django.contrib.auth.models import User
from . import models
from . import serializers


# Create your views here.
class ChatListView(LoginRequiredMixin, ListView):
    model = models.Chat
    template_name = 'app/chatlist.html'
    context_object_name = 'chats'

    def get_queryset(self):
        queryset = super().get_queryset().filter(members__in=[self.request.user])
        return queryset


def get_chat(_, pk):
    chat = models.Chat.objects.get(pk=pk)
    return HttpResponse(content=chat, status=200)


def get_chats(_):
    chats = models.Chat.objects.all()
    return HttpResponse(content=chats, status=200)


def create_chat(request):
    body = json.loads(request.body.decode('utf-8'))
    chat = models.Chat.objects.create(
        title=body['title'],
    )
    return HttpResponse(content=chat, status=201)


def edit_chat(request, pk):
    body = json.loads(request.body.decode('utf-8'))
    chat = models.Chat.objects.get(pk=pk)
    for attr, value in body.items():
        setattr(chat, attr, value)
    chat.save()
    return HttpResponse(content=chat, status=200)


def delete_chat(_, pk):
    models.Chat.objects.get(pk=pk).delete()
    return HttpResponse(cstatus=204)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class ChatViewSet(viewsets.ModelViewSet):
    queryset = models.Chat.objects.all()
    serializer_class = serializers.ChatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(members__in=[self.request.user])


class MessageViewSet(viewsets.ModelViewSet):
    queryset = models.Message.objects.all()





