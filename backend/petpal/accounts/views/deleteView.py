from rest_framework import generics, status
from rest_framework.response import Response


class DeleteView(generics.DestroyAPIView):
    def destroy(self, request, *args, **kwargs):
        instance = request.user
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
