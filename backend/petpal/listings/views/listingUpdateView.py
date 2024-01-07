from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..models import Listing
from ..serializers import ListingUpdateSerializer
from accounts.models import ShelterProfile

class ListingUpdateView(generics.UpdateAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingUpdateSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        listing = self.get_object()

        print(listing)

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

        # All checks have passed, update the listing
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(listing, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
