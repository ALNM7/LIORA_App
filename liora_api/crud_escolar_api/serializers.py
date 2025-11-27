from rest_framework import serializers
from rest_framework.authtoken.models import Token
from crud_escolar_api.models import (
    User,
    FoodAnalysis,
    HighJewelryItem,
    HighJewelryImage,
    WatchItem,
    WatchImage,
    BagItem,
    BagImage,
    FragranceItem,
    FragranceImage,
)



# USER SERIALIZER

class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(required=True)
    email = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('id', 'name', 'email')



class FoodAnalysisSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    image = serializers.ImageField(required=False)
    timestamp = serializers.DateTimeField(read_only=True)
    food_name = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    calories = serializers.FloatField(required=False, allow_null=True)
    analysis_data = serializers.JSONField(required=False, allow_null=True)

    class Meta:
        model = FoodAnalysis
        fields = (
            'id',
            'user',
            'image',
            'timestamp',
            'food_name',
            'calories',
            'analysis_data'
        )



# HIGH JEWELRY SERIALIZERS

class HighJewelryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HighJewelryImage
        fields = ('id', 'image', 'order')


class HighJewelryItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = HighJewelryItem
        fields = (
            'id',
            'name',
            'category',
            'materials',
            'price',
            'is_active',
        )


class HighJewelryItemDetailSerializer(serializers.ModelSerializer):
  
    images = HighJewelryImageSerializer(many=True, read_only=True)

    class Meta:
        model = HighJewelryItem
        fields = (
            'id',
            'name',
            'category',
            'materials',
            'price',
            'is_active',
            'images',
        )

# WATCHES 

class WatchImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchImage
        fields = ('id', 'image', 'order')


class WatchItemSerializer(serializers.ModelSerializer):
    images = WatchImageSerializer(many=True, read_only=True)

    class Meta:
        model = WatchItem
        fields = (
            'id',
            'name',
            'category',
            'materials',
            'price',
            'is_active',
            'images',
        )


class WatchItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchItem
        fields = (
            'id',
            'name',
            'category',
            'materials',
            'price',
            'is_active',
        )


class WatchImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchImage
        fields = ('id', 'item', 'image', 'order')


# BAGS & ACCESSORIES 

class BagImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BagImage
        fields = ('id', 'image', 'order')


class BagItemSerializer(serializers.ModelSerializer):
    images = BagImageSerializer(many=True, read_only=True)

    class Meta:
        model = BagItem
        fields = (
            'id',
            'name',
            'category',
            'materials',
            'price',
            'is_active',
            'images',
        )


class BagItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BagItem
        fields = (
            'id',
            'name',
            'category',
            'materials',
            'price',
            'is_active',
        )


class BagImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = BagImage
        fields = ('id', 'item', 'image', 'order')


# === FRAGRANCES ===

class FragranceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FragranceImage
        fields = ('id', 'image', 'order')


class FragranceItemSerializer(serializers.ModelSerializer):
    images = FragranceImageSerializer(many=True, read_only=True)

    class Meta:
        model = FragranceItem
        fields = (
            'id',
            'name',
            'category',
            'materials',
            'price',
            'is_active',
            'images',
        )


class FragranceItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FragranceItem
        fields = (
            'id',
            'name',
            'category',
            'materials',
            'price',
            'is_active',
        )


class FragranceImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FragranceImage
        fields = ('id', 'item', 'image', 'order')
