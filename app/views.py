from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import (ListView, )
from django.http import HttpResponse
from rest_framework import viewsets, permissions, status
import json

from django.contrib.auth.models import User
from rest_framework.response import Response

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
    serializer_class = serializers.MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        chat_id = self.request.query_params.get('chat_id', None)
        if chat_id and models.Chat.objects.filter(pk=chat_id).exists():
            if models.Chat.objects.get(pk=chat_id).members.contains(self.request.user) or self.request.user.is_superuser:
                data = self.serializer_class(self.queryset.filter(chat__id=chat_id), many=True).data
                return Response(data)

        return Response(status=status.HTTP_404_NOT_FOUND)

    def retrieve(self, request, pk=None):
        chat_id = pk
        if chat_id and models.Chat.objects.filter(pk=chat_id).exists():
            if models.Chat.objects.get(pk=chat_id).members.contains(request.user) or request.user.is_superuser:
                data = self.serializer_class(self.queryset.filter(chat__id=chat_id), many=True).data
                return Response(data)

        return Response(status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.deleted = True
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

