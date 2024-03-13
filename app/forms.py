from django import forms
from .models import Message


class MessageForm(forms.ModelForm):
    text = forms.CharField(label='', widget=forms.Textarea(attrs={'rows': 3, 'cols': 80}), required=True)

    class Meta:
        model = Message
        fields = ['text',]

