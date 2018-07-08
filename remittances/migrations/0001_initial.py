# Generated by Django 2.0.5 on 2018-07-08 17:36

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
                ('range_from', models.IntegerField()),
                ('range_to', models.IntegerField()),
                ('type', models.CharField(choices=[('A', '9 Pesos'), ('B', '11 Pesos'), ('C', '14 Pesos')], max_length=1)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ConsumedTicket',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('archived_at', models.DateTimeField(blank=True, null=True)),
                ('archiver', models.CharField(blank=True, max_length=32)),
                ('end_ticket', models.IntegerField()),
                ('total', models.DecimalField(decimal_places=10, default=0, max_digits=19, null=True)),
                ('assigned_ticket', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='remittances.AssignedTicket')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Deployment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('archived_at', models.DateTimeField(blank=True, null=True)),
                ('archiver', models.CharField(blank=True, max_length=32)),
                ('route', models.CharField(choices=[('M', 'Main Road'), ('R', 'Right Route'), ('L', 'Left Route')], max_length=1)),
                ('status', models.CharField(choices=[('O', 'Ongoing'), ('F', 'Finished')], max_length=1)),
                ('driver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='members.Driver')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='DriversAssigned',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('archived_at', models.DateTimeField(blank=True, null=True)),
                ('archiver', models.CharField(blank=True, max_length=32)),
                ('driver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='members.Driver')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='RemittanceForm',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('archived_at', models.DateTimeField(blank=True, null=True)),
                ('archiver', models.CharField(blank=True, max_length=32)),
                ('fuel_cost', models.DecimalField(decimal_places=10, default=0, max_digits=19)),
                ('other_cost', models.DecimalField(decimal_places=10, default=0, max_digits=19)),
                ('status', models.CharField(choices=[('P', 'Pending'), ('C', 'Completed')], default='P', max_length=1)),
                ('total', models.DecimalField(decimal_places=10, default=0, max_digits=19)),
                ('deployment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='remittances.Deployment')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Schedule',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('archived_at', models.DateTimeField(blank=True, null=True)),
                ('archiver', models.CharField(blank=True, max_length=32)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField(null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Shift',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('archived_at', models.DateTimeField(blank=True, null=True)),
                ('archiver', models.CharField(blank=True, max_length=32)),
                ('type', models.CharField(choices=[('A', 'AM Shift'), ('P', 'PM Shift'), ('M', 'Midnight Shift')], max_length=1)),
                ('supervisor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='members.Supervisor')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ShiftIteration',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('archived_at', models.DateTimeField(blank=True, null=True)),
                ('archiver', models.CharField(blank=True, max_length=32)),
                ('date', models.DateField(auto_now_add=True)),
                ('shift', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='remittances.Shift')),
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
                ('ticket_number', models.IntegerField()),
                ('assigned_ticket', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='remittances.AssignedTicket')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='driversassigned',
            name='shift',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='remittances.Shift'),
        ),
        migrations.AddField(
            model_name='deployment',
            name='shift_iteration',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='remittances.ShiftIteration'),
        ),
        migrations.AddField(
            model_name='consumedticket',
            name='remittance_form',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='remittances.RemittanceForm'),
        ),
        migrations.AddField(
            model_name='assignedticket',
            name='deployment',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assigned_tickets', to='remittances.Deployment'),
        ),
    ]
