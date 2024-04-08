from django.db import models
from django.utils import timezone
from datetime import timedelta
# Create your models here.


class Post(models.Model):
    title = models.CharField(max_length=200, default='Default Title')
    content = models.TextField()
    deadline = models.DateTimeField(null=True)

    def __str__(self):
        return self.title

    def time_remaining(self):
        now = timezone.now()
        if self.deadline and self.deadline >= now:
            delta = self.deadline - now

            if delta >= timedelta(days=1):
                return f"D-{delta.days}"
            else:
                hours = delta.seconds // 3600
                return f"{hours}시간 후 마감"

        else:
            over = now - self.deadline
            return f"D+{over.days}"  # 마감기한 지남

    def is_past_due(self):
        return timezone.now() > self.deadline
