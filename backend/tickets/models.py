from django.db import models
from django.db.models import CheckConstraint, Q

class Ticket(models.Model):
    # Choices
    CATEGORY_CHOICES = [
        ('billing', 'Billing'),
        ('technical', 'Technical'),
        ('account', 'Account'),
        ('general', 'General'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    # Fields
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(
        max_length=20, 
        choices=CATEGORY_CHOICES,
        default='general',
        db_index=True
    )
    priority = models.CharField(
        max_length=20, 
        choices=PRIORITY_CHOICES,
        default='medium',
        db_index=True
    )
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='open',
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            # Check constraints for choices
            CheckConstraint(
                check=Q(category__in=['billing', 'technical', 'account', 'general']),
                name='valid_category'
            ),
            CheckConstraint(
                check=Q(priority__in=['low', 'medium', 'high', 'critical']),
                name='valid_priority'
            ),
            CheckConstraint(
                check=Q(status__in=['open', 'in_progress', 'resolved', 'closed']),
                name='valid_status'
            ),
        ]

    def __str__(self):
        return f"[{self.status.upper()}] {self.title}"
