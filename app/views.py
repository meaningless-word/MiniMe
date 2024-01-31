from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import (ListView, )

from .models import Chat


# Create your views here.
class ChatListView(LoginRequiredMixin, ListView):
    model = Chat
    template_name = 'app/chatlist.html'
    context_object_name = 'chats'

