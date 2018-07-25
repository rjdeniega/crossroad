# Generated by Django 2.0.7 on 2018-07-25 14:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('archived_at', models.DateTimeField(blank=True, null=True)),
                ('archiver', models.CharField(blank=True, max_length=32)),
                ('name', models.CharField(max_length=64)),
                ('quantity', models.PositiveIntegerField()),
                ('brand', models.CharField(max_length=64)),
                ('created', models.DateTimeField(editable=False, null=True)),
                ('modified', models.DateTimeField(null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ItemMovement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('archived_at', models.DateTimeField(blank=True, null=True)),
                ('archiver', models.CharField(blank=True, max_length=32)),
                ('type', models.CharField(choices=[('G', 'Get'), ('R', 'Return'), ('B', 'Bought')], max_length=1)),
                ('quantity', models.PositiveIntegerField()),
                ('vendor', models.CharField(max_length=64)),
                ('unit_price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('created', models.DateTimeField(editable=False, null=True)),
                ('modified', models.DateTimeField(null=True)),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.Item')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Repair',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('archived_at', models.DateTimeField(blank=True, null=True)),
                ('archiver', models.CharField(blank=True, max_length=32)),
                ('date', models.DateField()),
                ('labor_fee', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='RepairFinding',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('archived_at', models.DateTimeField(blank=True, null=True)),
                ('archiver', models.CharField(blank=True, max_length=32)),
                ('description', models.TextField()),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='RepairModifications',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('archived_at', models.DateTimeField(blank=True, null=True)),
                ('archiver', models.CharField(blank=True, max_length=32)),
                ('quantity', models.PositiveIntegerField()),
                ('description', models.TextField()),
                ('item_used', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.Item')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='RepairProblem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('archived_at', models.DateTimeField(blank=True, null=True)),
                ('archiver', models.CharField(blank=True, max_length=32)),
                ('description', models.TextField(max_length=255)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Shuttle',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('archived_at', models.DateTimeField(blank=True, null=True)),
                ('archiver', models.CharField(blank=True, max_length=32)),
                ('plate_number', models.CharField(max_length=6, unique=True)),
                ('make', models.CharField(max_length=64)),
                ('model', models.CharField(max_length=64)),
                ('date_acquired', models.DateField()),
                ('created', models.DateTimeField(editable=False, null=True)),
                ('modified', models.DateTimeField(null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='UsedItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('archived_at', models.DateTimeField(blank=True, null=True)),
                ('archiver', models.CharField(blank=True, max_length=32)),
                ('quantity', models.IntegerField()),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='inventory.Item')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='repair',
            name='findings',
            field=models.ManyToManyField(to='inventory.RepairFinding'),
        ),
        migrations.AddField(
            model_name='repair',
            name='modifications',
            field=models.ManyToManyField(to='inventory.RepairModifications'),
        ),
        migrations.AddField(
            model_name='repair',
            name='problems',
            field=models.ManyToManyField(to='inventory.RepairProblem'),
        ),
        migrations.AddField(
            model_name='repair',
            name='shuttle',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='inventory.Shuttle'),
        ),
        migrations.AddField(
            model_name='itemmovement',
            name='repair',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='inventory.Repair'),
        ),
    ]
