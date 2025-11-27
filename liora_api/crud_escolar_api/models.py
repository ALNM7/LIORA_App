from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.models import AbstractUser, User
from django.conf import settings

class BearerTokenAuthentication(TokenAuthentication):
    keyword = u"Bearer"


class FoodAnalysis(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='food_analyses'
    )
    image = models.ImageField(upload_to='food_images/')
    timestamp = models.DateTimeField(auto_now_add=True)
    food_name = models.CharField(max_length=255, blank=True, null=True)
    calories = models.FloatField(blank=True, null=True)
    analysis_data = models.JSONField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.food_name or 'Sin nombre'} - {self.user.email}"
    
    
    #High jewelry
class HighJewelryItem(models.Model):
    CATEGORY_CHOICES = [
        ('bracelet', 'Bracelet'),
        ('ring', 'Ring'),
        ('necklace', 'Necklace'),
        ('earrings', 'Earrings'),
        ('watches', 'Watches'),
        ('accessories', 'Accessories'),
        ('fragrances', 'Fragrances'),
    ]

    name = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    materials = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='liora_created_items'
    )

    def __str__(self):
        return self.name

#many images
class HighJewelryImage(models.Model):
   
    item = models.ForeignKey(
        HighJewelryItem,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='jewelry_images/')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.item.name} (img {self.order})"


# WATCHES

class WatchItem(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50)  # ej. "watch"
    materials = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Watch: {self.name}"


class WatchImage(models.Model):
    item = models.ForeignKey(
        WatchItem,
        related_name='images',
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to='watches/')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']


#BAGS & ACCESSORIES 

class BagItem(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50)  # ej. "bag", "small-leather-goods"
    materials = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Bag: {self.name}"


class BagImage(models.Model):
    item = models.ForeignKey(
        BagItem,
        related_name='images',
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to='bags/')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']


#  FRAGRANCES 

class FragranceItem(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50)  # ej. "fragrance"
    materials = models.TextField(blank=True)    # notas olfativas / descripción
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Fragrance: {self.name}"


class FragranceImage(models.Model):
    item = models.ForeignKey(
        FragranceItem,
        related_name='images',
        on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to='fragrances/')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
