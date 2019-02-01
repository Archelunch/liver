# Generated by Django 2.1.3 on 2019-01-02 10:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quiz', '0004_csvupload_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quiz',
            name='draft',
            field=models.BooleanField(blank=True, default=False, help_text='If yes, the quiz is not displayed in the quiz list and can only be taken by users who can edit quizzes.', verbose_name='Draft'),
        ),
    ]
