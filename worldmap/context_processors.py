from django.conf import settings

def worldmap(request):
    """
    Global values specific to WorldMap to pass to templates
    """

    return {
        'GEONODE_CLIENT_LOCATION': settings.GEONODE_CLIENT_LOCATION,
        'DB_DATASTORE': settings.DB_DATASTORE,
        'HYPERMAP_REGISTRY_URL': settings.HYPERMAP_REGISTRY_URL,
        'MAPPROXY_URL': settings.MAPPROXY_URL,
        'SOLR_URL': settings.SOLR_URL,
        'USE_GAZETTEER': settings.USE_GAZETTEER,
        'GOOGLE_API_KEY': settings.GOOGLE_API_KEY,
        'GOOGLE_MAPS_API_KEY': settings.GOOGLE_MAPS_API_KEY
    }
