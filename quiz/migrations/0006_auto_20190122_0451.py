# Generated by Django 2.1.3 on 2019-01-22 01:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0005_auto_20190102_1337'),
    ]

    operations = [
        migrations.AddField(
            model_name='quiz',
            name='is_started',
            field=models.BooleanField(default=False, verbose_name='Quiz status'),
        ),
        migrations.AddField(
            model_name='quiz',
            name='master_code',
            field=models.TextField(blank=True, verbose_name='Master code'),
        ),
        migrations.AddField(
            model_name='quiz',
            name='user_code',
            field=models.TextField(blank=True, verbose_name='user code'),
        ),
        migrations.AlterField(
            model_name='quiz',
            name='exam_paper',
            field=models.BooleanField(default=True, help_text='If yes, the result of each attempt by a user will be stored. Necessary for marking.', verbose_name='Exam Paper'),
        ),
    ]
