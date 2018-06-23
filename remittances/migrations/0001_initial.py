# Generated by Django 2.0.5 on 2018-05-21 16:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('members', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AssignedTicket',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('archived_at', models.DateTimeField(blank=True, null=True)),
                ('archiver', models.CharField(blank=True, max_length=32)),
                ('range_from', models.CharField(max_length=64)),
                ('range_to', models.CharField(max_length=64)),
                ('type', models.CharField(max_length=64)),
                ('driver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='members.Driver')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='VoidTicket',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('archived_at', models.DateTimeField(blank=True, null=True)),
                ('archiver', models.CharField(blank=True, max_length=32)),
                ('ticket_number', models.CharField(max_length=64)),
                ('assigned_ticket', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='remittances.AssignedTicket')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]