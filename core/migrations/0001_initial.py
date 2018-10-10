# Generated by Django 2.0.7 on 2018-10-10 20:15

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('archived_at', models.DateTimeField(blank=True, null=True)),
                ('archiver', models.CharField(blank=True, max_length=32)),
                ('type', models.CharField(choices=[('I', 'Inventory'), ('R', 'Remittances'), ('M', 'Members')], max_length=1)),
                ('description', models.CharField(max_length=255)),
                ('is_read', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
