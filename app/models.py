from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Chat(models.Model):
    title = models.CharField(max_length=30, unique=True, verbose_name="Заголовок")
    members = models.ManyToManyField(User, related_name="rooms")

    def __str__(self):
        return f'{self.title}'


class Message(models.Model):
    text = models.TextField()
    dateCreation = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return f'from:{self.author.id} to_chat:{self.chat.id} [{self.text[:50]}'
