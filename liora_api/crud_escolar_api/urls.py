from django.contrib import admin
from django.urls import path
from crud_escolar_api.views import bootstrap
from crud_escolar_api.views import users
from crud_escolar_api.views import auth
from crud_escolar_api.views import food
from .views.food import FoodAll, FoodView

from django.conf import settings
from django.conf.urls.static import static
from crud_escolar_api.views.users import CurrentUserView
from crud_escolar_api.views.jewelry import (
    HighJewelryList,
    HighJewelryView,
    HighJewelryImageUpload,
    WatchList,
    WatchView,
    WatchImageUpload,
    BagList,
    BagView,
    BagImageUpload,
    FragranceList,
    FragranceView,
    FragranceImageUpload,
)





urlpatterns = [
    #admin dashboard
     path('admin/', admin.site.urls), 
    path('user/me', CurrentUserView.as_view()),
    # Version
    path('bootstrap/version', bootstrap.VersionView.as_view()),
    # Create User
    path('user/', users.UsuariosView.as_view()),
    # Login
    path('token/', auth.CustomAuthToken.as_view()),
    # Logout
    path('logout/', auth.Logout.as_view()),

    # high jewelry
    path('jewelry/all', HighJewelryList.as_view()),
    path('jewelry', HighJewelryView.as_view()),
    path('jewelry/images', HighJewelryImageUpload.as_view()),

    # watches
    path('watches/all', WatchList.as_view()),
    path('watches', WatchView.as_view()),
    path('watches/images', WatchImageUpload.as_view()),

    # bags & accessories
    path('bags/all', BagList.as_view()),
    path('bags', BagView.as_view()),
    path('bags/images', BagImageUpload.as_view()),

    # fragrances
    path('fragrances/all', FragranceList.as_view()),
    path('fragrances', FragranceView.as_view()),
    path('fragrances/images', FragranceImageUpload.as_view()),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
