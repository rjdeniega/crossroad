from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import *


class DriversAssignedSerializer(ModelSerializer):
    class Meta:
        model = DriversAssigned
        exclude = ('shift', )


class ShiftSerializer(ModelSerializer, serializers.Serializer):
    drivers_assigned = DriversAssignedSerializer(many=True, write_only=True)

    class Meta:
        model = Shift
        fields = '__all__'

    def create(self, validated_data):
        drivers_data = validated_data.pop('drivers_assigned')
        shift = Shift.objects.create(**validated_data)
        for driver_data in drivers_data:
            DriversAssigned.objects.create(shift=shift, **driver_data)
        return shift

    def validate(self, data):
        shifts = Shift.objects.filter(type=data['type']) # there could be 3 shifts in a date span
        for shift in shifts:
            if data['start_date'] <= shift.end_date:
                raise serializers.ValidationError("start date of shift is conflicting with other existing shifts")
        return data


class VoidTicketSerializer(ModelSerializer):
    class Meta:
        model = VoidTicket
        exclude = ('assigned_ticket', )


class AssignedTicketSerializer(ModelSerializer):
    void_ticket = VoidTicketSerializer(many=True, write_only=True)

    class Meta:
        model = AssignedTicket
        exclude = ('deployment', )



class DeploymentSerializer(ModelSerializer):
    assigned_tickets = serializers.StringRelatedField(many=True)

    class Meta:
        model = Deployment
        fields = '__all__'


    def create(self, validated_data):
        assigned_tickets_data = validated_data.pop('assigned_ticket')
        deployment = Deployment.objects.create(**validated_data)

        for assigned_ticket_data in assigned_tickets_data:
            void_tickets_data = assigned_ticket_data.pop('void_ticket')
            assigned_ticket = AssignedTicket.objects.create(deployment=deployment, **assigned_ticket_data)

            for void_ticket_data in void_tickets_data:
                VoidTicket.objects.create(assigned_ticket=assigned_ticket, **void_ticket_data)
        return deployment


class ConsumedTicketSerializer(ModelSerializer):
    class Meta:
        model = ConsumedTicket
        exclude = ('remittance_form', )

# TODO validation that consumed_ticket.end_ticket is within range of assigned_ticket
class RemittanceFormSerializer(ModelSerializer):
    consumed_ticket = ConsumedTicketSerializer(many=True, write_only=True)

    class Meta:
        model = RemittanceForm
        fields = '__all__'

    # assigned_ticket id is expected to be within validated_data
    def create(self, validated_data):
        consumed_tickets_data = validated_data.pop('consumed_ticket')
        remittance_form = RemittanceForm.objects.create(**validated_data)

        for consumed_ticket_data in consumed_tickets_data:
            consumed_ticket = ConsumedTicket.objects.create(remittance_form=remittance_form, **consumed_ticket_data)
            assigned_ticket = AssignedTicket.objects.get(id=consumed_ticket.assigned_ticket.id)

            if assigned_ticket.type == 'A':
                consumed_ticket.total = 9 * (consumed_ticket.end_ticket - assigned_ticket.range_from)
            elif assigned_ticket.type == 'B':
                consumed_ticket.total = 11 * (consumed_ticket.end_ticket - assigned_ticket.range_from)
            else:
                consumed_ticket.total = 14 * (consumed_ticket.end_ticket - assigned_ticket.range_from)

            consumed_ticket.save()
            remittance_form.total += consumed_ticket.total
            remittance_form.save()

        remittance_form.total -= remittance_form.fuel_cost + remittance_form.other_cost
        remittance_form.save()
        return remittance_form








