"""
URL configuration for Gestor_Citas project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
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
from django.urls import path, include
from Authentication import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('Api.urls')),
    path('api/auth/', include('Authentication.urls')),
    path('accounts/', include('allauth.urls')),
    path('callback/', views.google_login_callback, name='callback'),
    path('google-account-status/', views.google_account_status, name='google_account_status'),
    path('connect-google-account/', views.connect_google_account, name='connect_google_account')    
]
