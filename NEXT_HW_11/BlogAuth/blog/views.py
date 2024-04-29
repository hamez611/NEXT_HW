from django.shortcuts import render, redirect
from django.utils import timezone
# Create your views here.
from .models import Post, Comment
from django.contrib.auth.decorators import login_required
from authapp.permissions import check_is_creator_or_admin, update_last_viewed
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm


def home(request):
    posts = Post.objects.all()

    return render(request, "home.html", {"posts": posts})


@login_required
def new(request):
    if request.method == "POST":
        title = request.POST["title"]
        content = request.POST["content"]

        new_post = Post.objects.create(
            title=title, content=content, creator=request.user
        )
        return redirect("detail", new_post.pk)

    return render(request, "new.html")


@login_required
@update_last_viewed(Post, "post_pk")
def detail(request, post_pk):
    post = Post.objects.get(pk=post_pk)

    if request.method == "POST":
        content = request.POST["content"]
        Comment.objects.create(
            post=post, content=content, creator=request.user)
        return redirect("detail", post_pk)

    return render(request, "detail.html", {"post": post})


@login_required
@check_is_creator_or_admin(Post, "post_pk")
def edit(request, post_pk):
    post = Post.objects.get(pk=post_pk)

    if request.method == "POST":
        title = request.POST["title"]
        content = request.POST["content"]
        Post.objects.filter(pk=post_pk).update(title=title, content=content)
        return redirect("detail", post_pk)

    return render(request, "edit.html", {"post": post})


@login_required
@check_is_creator_or_admin(Post, "post_pk")
def delete(request, post_pk):
    post = Post.objects.get(pk=post_pk)
    post.delete()
    return redirect("home")


@login_required
@check_is_creator_or_admin(Comment, "comment_pk")
def delete_comment(request, comment_pk):
    comment = Comment.objects.get(pk=comment_pk)
    post_pk = comment.post.pk
    comment.delete()

    return redirect("detail", post_pk)
