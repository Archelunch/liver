# Generated by Django 2.1.3 on 2019-02-01 09:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mcq', '0002_auto_20180727_2247'),
    ]

    operations = [
        migrations.AddField(
            model_name='answer',
            name='people_count',
            field=models.IntegerField(default=0, verbose_name='How many people choosed this answer'),
        ),
    ]