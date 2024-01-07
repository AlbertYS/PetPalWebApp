from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..models import Listing
from ..serializers import ListingDeleteSerializer
from accounts.models import ShelterProfile

class ListingDeleteView(generics.DestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingDeleteSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        listing = self.get_object()

        user = request.user

        # Check to see if the user is associated with a shelter
        if user.user_type != 2:
            return self.permission_denied(request)
        shelters = ShelterProfile.objects.all()
        user_shelter = None
        for shelter in shelters:
            if shelter.user == user:
                user_shelter = shelter
                break
        if user_shelter is None:
            return self.permission_denied(request)

        # Check if this associated shelter is the same as the one in the listing
        if listing.shelter_profile != user_shelter:
            return self.permission_denied(request)

        # All checks have passed, delete the listing
        self.perform_destroy(listing)
        return Response(status=status.HTTP_204_NO_CONTENT)