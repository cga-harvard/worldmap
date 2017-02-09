import os

from django.conf import settings

GEOSERVER_BASE_URL = os.getenv('GEOSERVER_BASE_URL',
                               "http://localhost:8080/geoserver/")

#GEONODE_CLIENT_LOCATION = '/static/worldmap_client/'
GEONODE_CLIENT_LOCATION = "http://localhost:9090/"

#LAYER_PREVIEW_LIBRARY = 'geoext'
LAYER_PREVIEW_LIBRARY = 'worldmap'
#LAYER_PREVIEW_LIBRARY = 'react'


settings.TEMPLATES[0]['OPTIONS']['context_processors'].append("worldmap.context_processors.worldmap")

WORLDMAP_APPS = (
    # WorldMap applications
    'wm_extra',
)

GEONODE_APPS = (
    # GeoNode internal apps
    'geonode.people',
    'geonode.base',
    'geonode.layers',
    'geonode.maps',
    'geonode.proxy',
    'geonode.security',
    'geonode.social',
    'geonode.catalogue',
    'geonode.documents',
    'geonode.api',
    'geonode.groups',
    'geonode.services',

    # GeoServer Apps
    # Geoserver needs to come last because
    # it's signals may rely on other apps' signals.
    'geonode.geoserver',
    'geonode.upload',
    'geonode.tasks'
)

GEONODE_CONTRIB_APPS = (
    # GeoNode Contrib Apps
    'geonode.contrib.dynamic',
    'geonode.contrib.exif',
    'geonode.contrib.favorite',
    'geonode.contrib.geogig',
    'geonode.contrib.geosites',
    'geonode.contrib.nlp',
    'geonode.contrib.slack',
    'geonode.contrib.metadataxsl'
)

# Uncomment the following line to enable contrib apps
# GEONODE_APPS = GEONODE_APPS + GEONODE_CONTRIB_APPS

_DEFAULT_INSTALLED_APPS = (

    'modeltranslation',

    # Boostrap admin theme
    # 'django_admin_bootstrapped.bootstrap3',
    # 'django_admin_bootstrapped',

    # Apps bundled with Django
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.admin',
    'django.contrib.sitemaps',
    'django.contrib.staticfiles',
    'django.contrib.messages',
    'django.contrib.humanize',
    'django.contrib.gis',

    # Third party apps

    # Utility
    'pagination',
    'taggit',
    'friendlytagloader',
    'geoexplorer',
    'leaflet',
    'django_extensions',
    # 'geonode-client',
    # 'overextends',
    # 'haystack',
    'autocomplete_light',
    'mptt',
    # 'modeltranslation',
    'djcelery',
    'storages',

    # Theme
    "pinax_theme_bootstrap_account",
    "pinax_theme_bootstrap",
    'django_forms_bootstrap',

    # Social
    'account',
    'avatar',
    'dialogos',
    'agon_ratings',
    #'notification',
    'announcements',
    'actstream',
    'user_messages',
    'tastypie',
    'polymorphic',
    'guardian',
    'oauth2_provider',

) + GEONODE_APPS + WORLDMAP_APPS

INSTALLED_APPS = os.getenv('INSTALLED_APPS',_DEFAULT_INSTALLED_APPS)


#### layers configuration

_INIT_DEFAULT_LAYER_SOURCE = {
    "ptype":"gxp_gnsource",
    "url":"/geoserver/wms",
    "restUrl": "/gs/rest"
}

DEFAULT_LAYER_SOURCE = os.getenv('DEFAULT_LAYER_SOURCE',_INIT_DEFAULT_LAYER_SOURCE)

_DEFAULT_MAP_BASELAYERS = [{
    "source": {"ptype": "gxp_olsource"},
    "type": "OpenLayers.Layer",
    "args": ["No background"],
    "name": "background",
    "visibility": False,
    "fixed": True,
    "group":"background"
},
{
    "source": {"ptype": "gxp_osmsource"},
    "type": "OpenLayers.Layer.OSM",
    "name": "mapnik",
    "visibility": True,
    "fixed": True,
    "group": "background"
},
]

MAP_BASELAYERS = os.getenv('MAP_BASELAYERS',_DEFAULT_MAP_BASELAYERS)

LOCAL_GEOSERVER = {
    "source": {
        "ptype": "gxp_wmscsource",
        "url": settings.OGC_SERVER['default']['PUBLIC_LOCATION'] + "wms",
        "restUrl": "/gs/rest"
    }
}
baselayers = MAP_BASELAYERS
MAP_BASELAYERS = [LOCAL_GEOSERVER]
MAP_BASELAYERS.extend(baselayers)
