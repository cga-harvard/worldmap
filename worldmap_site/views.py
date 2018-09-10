from django.shortcuts import render

from geonode.layers.models import Layer
from geonode.maps.models import Map
from geonode.people.models import Profile


def wm_home(request):
    """
    Home page for WorldMap.
    """

    # TODO filter these numbers on permissions
    n_maps = Map.objects.all().count()
    n_layers = Layer.objects.all().count()
    n_users = Profile.objects.all().count()

    return render(request, 'site_index.html', context={
        'n_maps': n_maps,
        'n_layers': n_layers,
        'n_users': n_users,
    })
