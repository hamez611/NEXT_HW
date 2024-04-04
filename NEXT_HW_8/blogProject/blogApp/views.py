from django.shortcuts import render, redirect, get_object_or_404
from .models import Article, Category
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
    return render(request, 'detail.html', {'article': article})


def category_detail(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    articles = Article.objects.filter(category=category)
    return render(request, 'category_detail.html', {'category': category, 'articles': articles})


def info(request):
    return render(request, 'info.html')


def project(request):
    return render(request, 'project.html')
