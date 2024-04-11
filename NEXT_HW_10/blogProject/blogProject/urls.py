"""
URL configuration for blogProject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from blogApp import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('new/', views.new, name="new"),
    path('list/', views.list, name='list'),
    path('detail/<int:article_id>/', views.detail, name='detail'),
    path('category/<int:category_id>/',
         views.category_detail, name='category_detail'),
    path('info/', views.info, name='info'),
    path('project/', views.project, name='project'),
    path('edit/<int:article_id>', views.edit, name='edit'),
    path('delete/<int:article_id>', views.delete, name='delete'),
    path('delete-comment/<int:article_id>/<int:comment_pk>',
         views.delete_comment, name='delete-comment'),
    path('base', views.base, name='base'),
    path('recomment/new/<int:comment_pk>/',
         views.new_recomment, name='new_recomment'),
    path('recomment/delete/<int:article_id>/<int:comment_pk>/<int:recomment_pk>/',
         views.delete_recomment, name='delete_recomment'),
]
