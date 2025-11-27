from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404

from crud_escolar_api.models import HighJewelryItem, HighJewelryImage
from crud_escolar_api.serializers import (
    HighJewelryItemSerializer,
    HighJewelryItemDetailSerializer,
    HighJewelryImageSerializer,
)
from crud_escolar_api.models import (
    HighJewelryItem,
    HighJewelryImage,
    WatchItem,
    WatchImage,
    BagItem,
    BagImage,
    FragranceItem,
    FragranceImage,
)
from crud_escolar_api.serializers import (
    HighJewelryItemSerializer,
    HighJewelryItemDetailSerializer,
    HighJewelryImageSerializer,
    WatchItemSerializer,
    WatchItemCreateSerializer,
    WatchImageUploadSerializer,
    BagItemSerializer,
    BagItemCreateSerializer,
    BagImageUploadSerializer,
    FragranceItemSerializer,
    FragranceItemCreateSerializer,
    FragranceImageUploadSerializer,
)



def is_liora_admin(user) -> bool:
    
    return (
        user.is_authenticated
        and user.groups.filter(name="liora_admin").exists()
    )



class HighJewelryList(APIView):
   

    permission_classes = [AllowAny]

    def get(self, request):
        qs = HighJewelryItem.objects.all()

        category = request.GET.get("category")
        if category:
            qs = qs.filter(category=category)

        ordering = request.GET.get("ordering")
        if ordering:
            qs = qs.order_by(ordering)

        # Usamos el serializer "de detalle" para incluir imágenes
        serializer = HighJewelryItemDetailSerializer(qs, many=True)
        return Response(serializer.data)



class HighJewelryView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):
        item_id = request.GET.get("id")
        if not item_id:
            return Response(
                {"detail": "Missing id parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            item_id = int(item_id)
        except ValueError:
            return Response(
                {"detail": "Invalid id value"},
                status=status.HTTP_400_BAD_REQUEST
            )

        item = get_object_or_404(HighJewelryItem, id=item_id)
        serializer = HighJewelryItemDetailSerializer(item)
        return Response(serializer.data)

    def post(self, request):
        if not is_liora_admin(request.user):
            return Response(
                {"detail": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = HighJewelryItemSerializer(data=request.data)
        if serializer.is_valid():
            item = serializer.save()
            return Response(
                HighJewelryItemDetailSerializer(item).data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
       
        if not is_liora_admin(request.user):
            return Response(
                {"detail": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        item_id = request.GET.get("id")
        if not item_id:
            return Response(
                {"detail": "Missing id parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            item_id = int(item_id)
        except ValueError:
            return Response(
                {"detail": "Invalid id value"},
                status=status.HTTP_400_BAD_REQUEST
            )

        item = get_object_or_404(HighJewelryItem, id=item_id)
        serializer = HighJewelryItemSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            item = serializer.save()
            return Response(
                HighJewelryItemDetailSerializer(item).data,
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
       
        if not is_liora_admin(request.user):
            return Response(
                {"detail": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        item_id = request.GET.get("id")
        if not item_id:
            return Response(
                {"detail": "Missing id parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            item_id = int(item_id)
        except ValueError:
            return Response(
                {"detail": "Invalid id value"},
                status=status.HTTP_400_BAD_REQUEST
            )

        item = get_object_or_404(HighJewelryItem, id=item_id)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




class HighJewelryImageUpload(APIView):
    
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        # Verificar permiso de admin Liora
        if not is_liora_admin(request.user):
            return Response(
                {"detail": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Aceptamos item o item_id
        raw_item = request.data.get("item") or request.data.get("item_id")
        image_file = request.FILES.get("image")
        order = request.data.get("order", 0)

        if raw_item is None or image_file is None:
            return Response(
                {"detail": "item/item_id and image are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            item_id = int(raw_item)
        except ValueError:
            return Response(
                {"detail": "item_id must be integer"},
                status=status.HTTP_400_BAD_REQUEST
            )

        item = get_object_or_404(HighJewelryItem, id=item_id)

        img = HighJewelryImage(item=item, order=order)
        img.image = image_file
        img.save()

        return Response(
            HighJewelryImageSerializer(img).data,
            status=status.HTTP_201_CREATED
        )
# ===================== WATCHES =====================

class WatchList(APIView):
    """
    GET /watches/all
      - Lista todos los relojes activos
      - Filtros opcionales ?category= y ?ordering=
    """
    permission_classes = [AllowAny]

    def get(self, request):
        qs = WatchItem.objects.all()

        category = request.GET.get("category")
        if category:
            qs = qs.filter(category=category)

        ordering = request.GET.get("ordering")
        if ordering:
            qs = qs.order_by(ordering)

        serializer = WatchItemSerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class WatchView(APIView):
    """
    GET /watches?id=1
    POST /watches
    PUT /watches?id=1
    DELETE /watches?id=1
    """
    permission_classes = [AllowAny]

    def get(self, request):
        item_id = request.GET.get("id")
        if not item_id:
            return Response(
                {"detail": "Missing id parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            item_id = int(item_id)
        except ValueError:
            return Response(
                {"detail": "Invalid id value"},
                status=status.HTTP_400_BAD_REQUEST
            )

        item = get_object_or_404(WatchItem, id=item_id)
        serializer = WatchItemSerializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Solo admin Liora
        if not is_liora_admin(request.user):
            return Response(
                {"detail": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = WatchItemCreateSerializer(data=request.data)
        if serializer.is_valid():
            item = serializer.save()
            return Response(
                WatchItemSerializer(item).data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        if not is_liora_admin(request.user):
            return Response(
                {"detail": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        item_id = request.GET.get("id")
        if not item_id:
            return Response(
                {"detail": "Missing id parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            item_id = int(item_id)
        except ValueError:
            return Response(
                {"detail": "Invalid id value"},
                status=status.HTTP_400_BAD_REQUEST
            )

        item = get_object_or_404(WatchItem, id=item_id)
        serializer = WatchItemCreateSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            item = serializer.save()
            return Response(
                WatchItemSerializer(item).data,
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        if not is_liora_admin(request.user):
            return Response(
                {"detail": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        item_id = request.GET.get("id")
        if not item_id:
            return Response(
                {"detail": "Missing id parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            item_id = int(item_id)
        except ValueError:
            return Response(
                {"detail": "Invalid id value"},
                status=status.HTTP_400_BAD_REQUEST
            )

        item = get_object_or_404(WatchItem, id=item_id)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class WatchImageUpload(APIView):
    """
    POST /watches/images
      - item / item_id: id del WatchItem
      - image: archivo
      - order: entero opcional
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if not is_liora_admin(request.user):
            return Response(
                {"detail": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        raw_item = request.data.get("item") or request.data.get("item_id")
        image_file = request.FILES.get("image")
        order = request.data.get("order", 0)

        if raw_item is None or image_file is None:
            return Response(
                {"detail": "item/item_id and image are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            item_id = int(raw_item)
        except ValueError:
            return Response(
                {"detail": "item_id must be integer"},
                status=status.HTTP_400_BAD_REQUEST
            )

        item = get_object_or_404(WatchItem, id=item_id)

        img = WatchImage(item=item, order=order)
        img.image = image_file
        img.save()

        # devolvemos al menos el id para el front
        return Response({"id": img.id}, status=status.HTTP_201_CREATED)


# ===================== BAGS & ACCESSORIES =====================

class BagList(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = BagItem.objects.all()

        category = request.GET.get("category")
        if category:
            qs = qs.filter(category=category)

        ordering = request.GET.get("ordering")
        if ordering:
            qs = qs.order_by(ordering)

        serializer = BagItemSerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BagView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        item_id = request.GET.get("id")
        if not item_id:
            return Response(
                {"detail": "Missing id parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            item_id = int(item_id)
        except ValueError:
            return Response(
                {"detail": "Invalid id value"},
                status=status.HTTP_400_BAD_REQUEST
            )

        item = get_object_or_404(BagItem, id=item_id)
        serializer = BagItemSerializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        if not is_liora_admin(request.user):
            return Response(
                {"detail": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = BagItemCreateSerializer(data=request.data)
        if serializer.is_valid():
            item = serializer.save()
            return Response(
                BagItemSerializer(item).data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        if not is_liora_admin(request.user):
            return Response(
                {"detail": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        item_id = request.GET.get("id")
        if not item_id:
            return Response(
                {"detail": "Missing id parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            item_id = int(item_id)
        except ValueError:
            return Response(
                {"detail": "Invalid id value"},
                status=status.HTTP_400_BAD_REQUEST
            )

        item = get_object_or_404(BagItem, id=item_id)
        serializer = BagItemCreateSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            item = serializer.save()
            return Response(
                BagItemSerializer(item).data,
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        if not is_liora_admin(request.user):
            return Response(
                {"detail": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        item_id = request.GET.get("id")
        if not item_id:
            return Response(
                {"detail": "Missing id parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            item_id = int(item_id)
        except ValueError:
            return Response(
                {"detail": "Invalid id value"},
                status=status.HTTP_400_BAD_REQUEST
            )

        item = get_object_or_404(BagItem, id=item_id)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BagImageUpload(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if not is_liora_admin(request.user):
            return Response(
                {"detail": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        raw_item = request.data.get("item") or request.data.get("item_id")
        image_file = request.FILES.get("image")
        order = request.data.get("order", 0)

        if raw_item is None or image_file is None:
            return Response(
                {"detail": "item/item_id and image are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            item_id = int(raw_item)
        except ValueError:
            return Response(
                {"detail": "item_id must be integer"},
                status=status.HTTP_400_BAD_REQUEST
            )

        item = get_object_or_404(BagItem, id=item_id)

        img = BagImage(item=item, order=order)
        img.image = image_file
        img.save()

        return Response({"id": img.id}, status=status.HTTP_201_CREATED)


# ===================== FRAGRANCES =====================

class FragranceList(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = FragranceItem.objects.all()

        category = request.GET.get("category")
        if category:
            qs = qs.filter(category=category)

        ordering = request.GET.get("ordering")
        if ordering:
            qs = qs.order_by(ordering)

        serializer = FragranceItemSerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FragranceView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        item_id = request.GET.get("id")
        if not item_id:
            return Response(
                {"detail": "Missing id parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            item_id = int(item_id)
        except ValueError:
            return Response(
                {"detail": "Invalid id value"},
                status=status.HTTP_400_BAD_REQUEST
            )

        item = get_object_or_404(FragranceItem, id=item_id)
        serializer = FragranceItemSerializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        if not is_liora_admin(request.user):
            return Response(
                {"detail": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = FragranceItemCreateSerializer(data=request.data)
        if serializer.is_valid():
            item = serializer.save()
            return Response(
                FragranceItemSerializer(item).data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        if not is_liora_admin(request.user):
            return Response(
                {"detail": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        item_id = request.GET.get("id")
        if not item_id:
            return Response(
                {"detail": "Missing id parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            item_id = int(item_id)
        except ValueError:
            return Response(
                {"detail": "Invalid id value"},
                status=status.HTTP_400_BAD_REQUEST
            )

        item = get_object_or_404(FragranceItem, id=item_id)
        serializer = FragranceItemCreateSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            item = serializer.save()
            return Response(
                FragranceItemSerializer(item).data,
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        if not is_liora_admin(request.user):
            return Response(
                {"detail": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        item_id = request.GET.get("id")
        if not item_id:
            return Response(
                {"detail": "Missing id parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            item_id = int(item_id)
        except ValueError:
            return Response(
                {"detail": "Invalid id value"},
                status=status.HTTP_400_BAD_REQUEST
            )

        item = get_object_or_404(FragranceItem, id=item_id)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class FragranceImageUpload(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if not is_liora_admin(request.user):
            return Response(
                {"detail": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN
            )

        raw_item = request.data.get("item") or request.data.get("item_id")
        image_file = request.FILES.get("image")
        order = request.data.get("order", 0)

        if raw_item is None or image_file is None:
            return Response(
                {"detail": "item/item_id and image are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            item_id = int(raw_item)
        except ValueError:
            return Response(
                {"detail": "item_id must be integer"},
                status=status.HTTP_400_BAD_REQUEST
            )

        item = get_object_or_404(FragranceItem, id=item_id)

        img = FragranceImage(item=item, order=order)
        img.image = image_file
        img.save()

        return Response({"id": img.id}, status=status.HTTP_201_CREATED)
