from django.shortcuts import render, redirect, get_object_or_404
from .models import Article, Category, Comment, Recomment
from django.db.models import Count
# Create your views here.


def new(request):
    if request.method == 'POST':

        print(request.POST)

        new_article = Article.objects.create(
            title=request.POST['title'],
            content=request.POST['content'],
            category_id=request.POST['category'],
        )

        return redirect('detail', article_id=new_article.id)
    else:
        categories = Category.objects.all()
        return render(request, 'new.html', {'categories': categories})


def list(request):
    articles = Article.objects.all()
    categories = Category.objects.annotate(
        num_articles=Count('articles')).all()
    return render(request, 'list.html', {'articles': articles, 'categories': categories})


def detail(request, article_id):
    article = Article.objects.get(id=article_id)
    if request.method == 'POST':
        content = request.POST['content']
        Comment.objects.create(
            post=article,
            content=content
        )
        return redirect('detail', article_id)
    return render(request, 'detail.html', {'article': article})


def category_detail(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    articles = Article.objects.filter(category=category)
    return render(request, 'category_detail.html', {'category': category, 'articles': articles})


def info(request):
    return render(request, 'info.html')


def project(request):
    return render(request, 'project.html')


def edit(request, article_id):
    post = Article.objects.get(pk=article_id)

    if request.method == 'POST':
        title = request.POST['title']
        content = request.POST['content']
        Article.objects.filter(pk=article_id).update(
            title=title,
            content=content
        )
        return redirect('detail', article_id)

    return render(request, 'edit.html', {'post': post})


def delete(request, article_id):
    post = Article.objects.get(pk=article_id)
    post.delete()

    return redirect('home')


def delete_comment(request, article_id, comment_pk):
    comment = Comment.objects.get(pk=comment_pk)
    comment.delete()
    return redirect('detail', article_id)


def base(request):
    return render(request, 'base.html')


def new_recomment(request, comment_pk):
    parent_comment = get_object_or_404(Comment, pk=comment_pk)

    if request.method == 'POST':
        content = request.POST['content']
        Recomment.objects.create(parent_comment=parent_comment,
                                 content=content)
        return redirect('detail', article_id=parent_comment.post.id)

    return render(request, 'detail.html', {'parent_comment': parent_comment})


def delete_recomment(request, article_id, comment_pk, recomment_pk):
    recomment = get_object_or_404(Recomment, pk=recomment_pk)
    recomment.delete()
    return redirect('detail', article_id)
