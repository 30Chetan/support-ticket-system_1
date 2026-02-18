from rest_framework import serializers
from .models import Ticket

class TicketSerializer(serializers.ModelSerializer):
    """
    Standard serializer for reading ticket data.
    """
    class Meta:
        model = Ticket
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class TicketCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating tickets.
    Excludes system-managed fields.
    """
    class Meta:
        model = Ticket
        exclude = ('created_at', 'updated_at')
    
    def validate_title(self, value):
        if len(value) > 200:
            raise serializers.ValidationError("Title cannot exceed 200 characters.")
        return value

class TicketUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating tickets.
    Only allows changing category, priority, and status.
    """
    class Meta:
        model = Ticket
        fields = ('category', 'priority', 'status')
