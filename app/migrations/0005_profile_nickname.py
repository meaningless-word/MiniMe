# Generated by Django 5.1 on 2024-08-19 10:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_profile'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='nickname',
            field=models.CharField(blank=True, default=None, max_length=30, null=True),
        ),
    ]
