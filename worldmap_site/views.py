from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from geonode.layers.views import layer_upload
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

@login_required
def layer_upload_wm(request, template='layers/layer_upload_standard.html'):
    print 'Using geonode.rest uploader'
    settings.UPLOADER['BACKEND'] = 'geonode.rest'
    return layer_upload(request, template)

@login_required
def layer_upload_geojson(request, template='layers/layer_upload_geojson.html'):
    print 'Using geonode.importer uploader'
    settings.UPLOADER['BACKEND'] = 'geonode.importer'
    return layer_upload(request, template)
