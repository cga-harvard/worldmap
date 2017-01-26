import os

from django.conf import settings

# GEONODE_CLIENT_LOCATION = '/static/worldmap_client/'
GEONODE_CLIENT_LOCATION = "http://localhost:9090/"

GEOSERVER_BASE_URL = "http://localhost:8080/geoserver/"

#LAYER_PREVIEW_LIBRARY = 'geoext'
LAYER_PREVIEW_LIBRARY = 'worldmap'


settings.TEMPLATES[0]['OPTIONS']['context_processors'].append("worldmap.context_processors.worldmap")

#import ipdb;ipdb.set_trace()

#print 'test'
