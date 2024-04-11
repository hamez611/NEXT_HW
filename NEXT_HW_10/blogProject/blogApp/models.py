from django.db import models
from django.utils import timezone

# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    date = models.DateTimeField(default=timezone.now)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='articles', null=True)

    def __str__(self):
        return self.title


class Comment(models.Model):
    post = models.ForeignKey(
        Article, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()

    def __str__(self):
        return self.content


class Recomment(models.Model):
    parent_comment = models.ForeignKey(
        Comment, on_delete=models.CASCADE, related_name='recomments')
    content = models.TextField()
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.parent_comment.content
