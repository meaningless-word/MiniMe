from django.urls import path, include
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'chat', views.ChatViewSet)


urlpatterns = [
    path('', views.ChatListView.as_view(), name='home'),
    path('api/', include(router.urls), name='api'),
    path('chat/<int:pk>/', views.get_chat),
    path('chats/', views.get_chats),
    path('create_chat/', views.create_chat),
    path('edit_chat/<int:pk>/', views.edit_chat),
    path('delete_chat/<int:pk>/', views.delete_chat),
]
