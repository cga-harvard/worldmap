from django.conf import settings

def worldmap(request):
    """
    Global values specific to WorldMap to pass to templates
    """
    return {
        'GEONODE_CLIENT_LOCATION': settings.GEONODE_CLIENT_LOCATION,
        'GEOSERVER_BASE_URL': settings.GEOSERVER_BASE_URL,
        'DB_DATASTORE': settings.DB_DATASTORE,
    }
