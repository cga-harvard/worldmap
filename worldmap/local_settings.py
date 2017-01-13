import os

from django.conf import settings

GEOSERVER_BASE_URL = "http://localhost:8080/geoserver/"
GEONODE_CLIENT_LOCATION = '/static/worldmap_client/'
LAYER_PREVIEW_LIBRARY = 'worldmap'

#import ipdb;ipdb.set_trace()

settings.TEMPLATES[0]['OPTIONS']['context_processors'].append("worldmap.context_processors.worldmap")
