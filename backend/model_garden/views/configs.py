from rest_framework.response import Response
from rest_framework.views import APIView

from model_garden.utils import is_local_media_storage


class ConfigsAPIView(APIView):
    def get(self, request, format=None):
        return Response({'use_local_storage': is_local_media_storage()})
