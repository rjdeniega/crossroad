from datetime import datetime
from rest_framework.serializers import ModelSerializer
from .models import *
from remittances.models import *


class DriverSerializer(ModelSerializer):
    class Meta:
        # these are the settings that come with the class
        # we specify that this serializes the driver class
        # and we want all fields to be included

        model = Driver
        fields = "__all__"

        # def create(self, validated_data):
        #     # this overrides the parent class' create function
        #     # by default, it takes in the model's (in this case Driver) --
        #     # fields and creates an object


class AssignedDriversSerializer(ModelSerializer):
    class Meta:
        # these are the settings that come with the class
        # we specify that this serializes the driver class
        # and we want all fields to be included

        model = DriversAssigned
        fields = "__all__"

        # def create(self, validated_data):
        #     # this overrides the parent class' create function
        #     # by default, it takes in the model's (in this case Driver) --
        #     # fields and creates an object


class SupervisorSerializer(ModelSerializer):
    class Meta:
        # these are the settings that come with the class
        # we specify that this serializes the driver class
        # and we want all fields to be included

        model = Driver
        fields = "__all__"

        def create(self, validated_data):
            driver = Driver.objects.create(**validated_data)
            driver.is_supervisor = True
            driver.save()
            return driver
            # this overrides the parent class' create function
            # by default, it takes in the model's (in this case Driver) --
            # fields and creates an object


class ClerkSerializer(ModelSerializer):
    class Meta:
        model = Clerk
        fields = '__all__'


class OperationsManagerSerializer(ModelSerializer):
    class Meta:
        model = OperationsManager
        fields = '__all__'


class PersonSerializer(ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'


class MechanicSerializer(ModelSerializer):
    class Meta:
        model = Mechanic
        fields = '__all__'


class MemberSerializer(ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'


class IDCardSerializer(ModelSerializer):
    class Meta:
        model = IDCards
        fields = '__all__'


class ProspectSerializer(ModelSerializer):
    class Meta:
        model = Prospect
        fields = '__all__'


class ShareSerializer(ModelSerializer):
    class Meta:
        model = Share
        fields = '__all__'


class ShareCertificateSerializer(ModelSerializer):
    class Meta:
        model = ShareCertificate
        fields = '__all__'


class IDCardsSerializer(ModelSerializer):
    class Meta:
        model = IDCards
        fields = '__all__'
