from rest_framework import serializers
from .models import Chat, Message
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class ChatSerializer(serializers.HyperlinkedModelSerializer):
    members = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all())

    class Meta:
        model = Chat
        fields = ['id', 'title', 'members']

    def create(self, validated_data):
        if 'members' in self.initial_data:
            members = validated_data.pop('members')
        else:
            members = []

        members.append(self.context['request'].user)

        chat = Chat.objects.create(**validated_data)
        chat.members.add(*set([m.id for m in members]))
        return chat

    def update(self, instance, validated_data):
        members = validated_data.pop('members')
        new_members = [m.id for m in members]
        old_members = [m.id for m in instance.members.all()]
        for m in list(set(new_members) & set(old_members)):
            old_members.remove(m)
            new_members.remove(m)
        instance.members.add(*new_members)
        instance.members.remove(*old_members)
        instance.title = validated_data.get('title', instance.title)
        instance.save()
        return instance





