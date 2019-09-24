# -*- coding: utf-8 -*-
#########################################################################
#
# Copyright (C) 2017 OSGeo
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#
#########################################################################

# Django settings for the GeoNode project.
import ast
import os
from urlparse import urlparse, urlunparse
from django.utils.translation import ugettext_lazy as _
# Load more settings from a file called local_settings.py if it exists
try:
    from worldmap_site.local_settings import *
#    from geonode.local_settings import *
except ImportError:
    from geonode.settings import *

#
# General Django development settings
#
PROJECT_NAME = 'worldmap_site'

SITE_NAME = os.getenv('SITE_NAME', " ")
SITENAME = 'worldmap_site'

# Defines the directory that contains the settings file as the LOCAL_ROOT
# It is used for relative settings elsewhere.
LOCAL_ROOT = os.path.abspath(os.path.dirname(__file__))

WSGI_APPLICATION = "{}.wsgi.application".format(PROJECT_NAME)

#ALLOWED_HOSTS = ['localhost', 'django'] if os.getenv('ALLOWED_HOSTS') is None \
#    else re.split(r' *[,|:|;] *', os.getenv('ALLOWED_HOSTS'))

PROXY_ALLOWED_HOSTS += ('nominatim.openstreetmap.org',)

# AUTH_IP_WHITELIST property limits access to users/groups REST endpoints
# to only whitelisted IP addresses.
#
# Empty list means 'allow all'
#
# If you need to limit 'api' REST calls to only some specific IPs
# fill the list like below:
#
# AUTH_IP_WHITELIST = ['192.168.1.158', '192.168.1.159']
AUTH_IP_WHITELIST = []

MANAGERS = ADMINS = os.getenv('ADMINS', [])

# WorldMap configuration

INSTALLED_APPS += (
        PROJECT_NAME,
        'certification',
        # additional apps for worldmap
        'geoexplorer-worldmap',
        'geonode_worldmap',
        'geonode_worldmap.gazetteer',
        'geonode_worldmap.wm_extra',
        #'geonode_contribs.worldmap.mapnotes',
        'geonode_datastore_shards',
        #'debug_toolbar',
     )

GEONODE_CLIENT_LOCATION = '/static/worldmap_client/'
USE_GAZETTEER = True
GAZETTEER_DB_ALIAS = 'default'
GAZETTEER_FULLTEXTSEARCH = False
# external services to be used by the gazetteer
GAZETTEER_SERVICES = 'worldmap,geonames,nominatim'
# this is the GeoNames key which is needed by the WorldMap Gazetteer
GAZETTEER_GEONAMES_USER = os.getenv('GEONAMES_USER', 'your-key-here')
WM_COPYRIGHT_URL = "http://gis.harvard.edu/"
WM_COPYRIGHT_TEXT = "Center for Geographic Analysis"
DEFAULT_MAP_ABSTRACT = "Your text"
# these are optionals
GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY', 'your-key-here')
USE_HYPERMAP = strtobool(os.getenv('USE_HYPERMAP', 'False'))
HYPERMAP_REGISTRY_URL = os.getenv('HYPERMAP_REGISTRY_URL', 'http://localhost:8001')
SOLR_URL = os.getenv('SOLR_URL', 'http://localhost:8983/solr/hypermap/select/')
MAPPROXY_URL = os.getenv('MAPPROXY_URL', 'http://localhost:8001')

# Location of url mappings
ROOT_URLCONF = os.getenv('ROOT_URLCONF', '{}.urls'.format(PROJECT_NAME))

MEDIA_ROOT = os.getenv('MEDIA_ROOT', os.path.join(LOCAL_ROOT, "uploaded"))

STATIC_ROOT = os.getenv('STATIC_ROOT',
                        os.path.join(LOCAL_ROOT, "static_root")
                        )

from settings import TEMPLATES
TEMPLATES[0]['OPTIONS']['context_processors'].append('geonode_worldmap.context_processors.resource_urls')

# Additional directories which hold static files
# In order to use the staticfiles in camp earlier than in geonode, use insert instead of append
# STATICFILES_DIRS.append(
STATICFILES_DIRS.insert(0,
    os.path.join(LOCAL_ROOT, "static"),
)

# Location of locale files
LOCALE_PATHS = (
    os.path.join(LOCAL_ROOT, 'locale'),
    ) + LOCALE_PATHS

TEMPLATES[0]['DIRS'].insert(0, os.path.join(LOCAL_ROOT, "templates"))
loaders = TEMPLATES[0]['OPTIONS'].get('loaders') or ['django.template.loaders.filesystem.Loader','django.template.loaders.app_directories.Loader']
# loaders.insert(0, 'apptemplates.Loader')
TEMPLATES[0]['OPTIONS']['loaders'] = loaders
TEMPLATES[0].pop('APP_DIRS', None)

CLIENT_RESULTS_LIMIT = 20
API_LIMIT_PER_PAGE = 1000
FREETEXT_KEYWORDS_READONLY = False
RESOURCE_PUBLISHING = False
ADMIN_MODERATE_UPLOADS = False
GROUP_PRIVATE_RESOURCES = False
GROUP_MANDATORY_RESOURCES = False
MODIFY_TOPICCATEGORY = True
USER_MESSAGES_ALLOW_MULTIPLE_RECIPIENTS = True
DISPLAY_WMS_LINKS = True

# prevent signing up by default
ACCOUNT_OPEN_SIGNUP = True
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = 'optional'
ACCOUNT_EMAIL_CONFIRMATION_EMAIL = True
ACCOUNT_EMAIL_CONFIRMATION_REQUIRED = True
ACCOUNT_CONFIRM_EMAIL_ON_GET = True
ACCOUNT_APPROVAL_REQUIRED = True

SOCIALACCOUNT_ADAPTER = 'geonode.people.adapters.SocialAccountAdapter'

SOCIALACCOUNT_AUTO_SIGNUP = False

# Uncomment this to enable Linkedin and Facebook login
# INSTALLED_APPS += (
#     'allauth.socialaccount.providers.linkedin_oauth2',
# )

SOCIALACCOUNT_PROVIDERS = {
    'linkedin_oauth2': {
        'SCOPE': [
            'r_emailaddress',
            'r_basicprofile',
        ],
        'PROFILE_FIELDS': [
            'emailAddress',
            'firstName',
            'headline',
            'id',
            'industry',
            'lastName',
            'pictureUrl',
            'positions',
            'publicProfileUrl',
            'location',
            'specialties',
            'summary',
        ]
    },
}

SOCIALACCOUNT_PROFILE_EXTRACTORS = {
    "linkedin_oauth2": "geonode.people.profileextractors.LinkedInExtractor",
}

# MAPs and Backgrounds

# Default preview library
LAYER_PREVIEW_LIBRARY = 'geoext'

# LAYER_PREVIEW_LIBRARY = 'leaflet'
LEAFLET_CONFIG = {
    'TILES': [
        # Find tiles at:
        # http://leaflet-extras.github.io/leaflet-providers/preview/

        # Map Quest
        ('Map Quest',
         'http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
         'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> '
         '&mdash; Map data &copy; '
         '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'),
        # Stamen toner lite.
        # ('Watercolor',
        #  'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png',
        #  'Map tiles by <a href="http://stamen.com">Stamen Design</a>, \
        #  <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; \
        #  <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, \
        #  <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'),
        # ('Toner Lite',
        #  'http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png',
        #  'Map tiles by <a href="http://stamen.com">Stamen Design</a>, \
        #  <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; \
        #  <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, \
        #  <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'),
    ],
    'PLUGINS': {
        'esri-leaflet': {
            'js': 'lib/js/esri-leaflet.js',
            'auto-include': True,
        },
        'leaflet-fullscreen': {
            'css': 'lib/css/leaflet.fullscreen.css',
            'js': 'lib/js/Leaflet.fullscreen.min.js',
            'auto-include': True,
        },
    },
    'SRID': 3857,
    'RESET_VIEW': False
}


# default map projection
# Note: If set to EPSG:4326, then only EPSG:4326 basemaps will work.
DEFAULT_MAP_CRS = "EPSG:3857"

# Where should newly created maps be focused?
DEFAULT_MAP_CENTER = (0, 0)

# How tightly zoomed should newly created maps be?
# 0 = entire world;
# maximum zoom is between 12 and 15 (for Google Maps, coverage varies by area)
DEFAULT_MAP_ZOOM = 0

ALT_OSM_BASEMAPS = os.environ.get('ALT_OSM_BASEMAPS', False)
CARTODB_BASEMAPS = os.environ.get('CARTODB_BASEMAPS', False)
STAMEN_BASEMAPS = os.environ.get('STAMEN_BASEMAPS', False)
THUNDERFOREST_BASEMAPS = os.environ.get('THUNDERFOREST_BASEMAPS', False)
MAPBOX_ACCESS_TOKEN = os.environ.get('MAPBOX_ACCESS_TOKEN', '')
BING_API_KEY = os.environ.get('BING_API_KEY', None)

MAP_BASELAYERS = [{
    "source": {"ptype": "gxp_olsource"},
    "type": "OpenLayers.Layer",
    "args": ["No background"],
    "name": "background",
    "visibility": False,
    "fixed": True,
    "group":"background"
}, {
#     "source": {
#         "ptype": "gxp_tianditusource"
#     },
#     "group": "background",
#     "name": "TIANDITUROAD",
#     "visibility": True,
#     "fixed": True,
# }, {
#     "source": {
#         "ptype": "gxp_tianditusource",
#     },
#     "group": "background",
#     "name": "TIANDITUIMAGE",
#     "visibility": False,
#     "fixed": True,
# }, {
#     "source": {
#         "ptype": "gxp_tianditusource"
#     },
#     "group": "background",
#     "name": "TIANDITUTERRAIN",
#     "visibility": False,
#     "fixed": True,
# }, {
#     "source": {
#         "ptype": "gxp_tianditusource"
#     },
#     "group": "background",
#     "name": "TIANDITUANNOTATION",
#     "visibility": True,
#     "fixed": True,
# }, {
    "source": {"ptype": "gxp_stamensource"},
    "name": "watercolor",
    "visibility": False,
    "group": "background",
    "title": "Stamen Watercolor"
},
{
    "source": {"ptype": "gxp_stamensource"},
    "name": "toner",
    "visibility": False,
    "group": "background",
    "title": "Stamen Toner"
},
{
    "source": {
        "url": "http://services.arcgisonline.com/arcgis/rest/services/World_Shaded_Relief/MapServer",
        "ptype": "gxp_arcgiscachesource"},
    "group": "background",
    "name": "World Shaded Relief",
    "visibility": False,
    "fixed": True,
    "format": "jpeg",
    "tiled" : False,
    "title": "ESRI World Shaded Relief"
},
{
    "source": {
        "url": "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
        "ptype": "gxp_arcgiscachesource"},
    "group": "background",
    "name": "World Street Map",
    "visibility": False,
    "fixed": True,
    "format": "jpeg",
    "tiled" : False,
    "title": "ESRI World Street Map"
},
{
    "source": {
        "url": "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
        "ptype": "gxp_arcgiscachesource"},
    "group": "background",
    "format": "jpeg",
    "name": "World Imagery",
    "visibility": False,
    "fixed": True,
    "tiled" : False,
    "title": "ESRI World Imagery"
},
{
    "source": {
        "url": "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer",
        "ptype": "gxp_arcgiscachesource"},
    "group": "background",
    "name": "Light Gray Canvas Base",
    "visibility": False,
    "fixed": True,
    "format": "jpeg",
    "tiled" : False,
    "title": "ESRI Light Gray Reference"
},
{
    "source": {
        "url": "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer",
        "ptype": "gxp_arcgiscachesource"},
    "group": "background",
    "name": "Dark Gray Canvas Base",
    "visibility": False,
    "fixed": True,
    "format": "jpeg",
    "tiled" : False,
    "title": "ESRI Dark Gray Reference"
},
{
    "source": {"ptype": "gxp_olsource"},
    "type": "OpenLayers.Layer.XYZ",
    "title": "UNESCO",
    "args": ["UNESCO", "http://en.unesco.org/tiles/${z}/${x}/${y}.png"],
    "wrapDateLine": True,
    "name": "background",
    "attribution": "&copy; UNESCO",
    "visibility": False,
    "fixed": True,
    "group":"background"
}, {
    "source": {"ptype": "gxp_olsource"},
    "type": "OpenLayers.Layer.XYZ",
    "title": "UNESCO GEODATA",
    "args": ["UNESCO GEODATA", "http://en.unesco.org/tiles/geodata/${z}/${x}/${y}.png"],
    "name": "background",
    "attribution": "&copy; UNESCO",
    "visibility": False,
    "wrapDateLine": True,
    "fixed": True,
    "group":"background"
}, {
    "source": {"ptype": "gxp_olsource"},
    "type": "OpenLayers.Layer.XYZ",
    "title": "Humanitarian OpenStreetMap",
    "args": ["Humanitarian OpenStreetMap", "http://a.tile.openstreetmap.fr/hot/${z}/${x}/${y}.png"],
    "name": "background",
    "attribution": "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>, Tiles courtesy of <a href='http://hot.openstreetmap.org/' target='_blank'>Humanitarian OpenStreetMap Team</a>",
    "visibility": False,
    "wrapDateLine": True,
    "fixed": True,
    "group":"background"
# }, {
#     "source": {"ptype": "gxp_olsource"},
#     "type": "OpenLayers.Layer.XYZ",
#     "title": "MapBox Satellite Streets",
#     "args": ["MapBox Satellite Streets", "http://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/${z}/${x}/${y}?access_token="+MAPBOX_ACCESS_TOKEN],
#     "name": "background",
#     "attribution": "&copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <a href='https://www.mapbox.com/feedback/' target='_blank'>Improve this map</a>",
#     "visibility": False,
#     "wrapDateLine": True,
#     "fixed": True,
#     "group":"background"
# }, {
#     "source": {"ptype": "gxp_olsource"},
#     "type": "OpenLayers.Layer.XYZ",
#     "title": "MapBox Streets",
#     "args": ["MapBox Streets", "http://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/${z}/${x}/${y}?access_token="+MAPBOX_ACCESS_TOKEN],
#     "name": "background",
#     "attribution": "&copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <a href='https://www.mapbox.com/feedback/' target='_blank'>Improve this map</a>",
#     "visibility": False,
#     "wrapDateLine": True,
#     "fixed": True,
#     "group":"background"
}, {
    "source": {"ptype": "gxp_osmsource"},
    "type": "OpenLayers.Layer.OSM",
    "title": "OpenStreetMap",
    "name": "mapnik",
    "attribution": "&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors",
    "visibility": True,
    "wrapDateLine": True,
    "fixed": True,
    "group": "background"
},

]

baselayers = MAP_BASELAYERS
MAP_BASELAYERS = [PUBLIC_GEOSERVER]
MAP_BASELAYERS.extend(baselayers)

CORS_ORIGIN_ALLOW_ALL = True

GEOIP_PATH = os.path.join(os.path.dirname(__file__), '..', 'GeoLiteCity.dat')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d '
                      '%(thread)d %(message)s'
        },
        'simple': {
            'format': '%(message)s',
        },
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'null': {
            'level': 'INFO',
            'class': 'logging.NullHandler',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple'
        },
        'mail_admins': {
            'level': 'INFO', 'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler',
        }
    },
    "loggers": {
        "django": {
            "handlers": ["console"], "level": "INFO", },
        "geonode": {
            "handlers": ["console"], "level": "INFO", },
        "gsconfig.catalog": {
            "handlers": ["console"], "level": "INFO", },
        "owslib": {
            "handlers": ["console"], "level": "INFO", },
        "pycsw": {
            "handlers": ["console"], "level": "INFO", },
        "camp": {
            "handlers": ["console"], "level": "DEBUG", },
        },
    }

############################################
# other settings specific to WorldMap CAMP #
############################################

# per-deployment settings should go here
SITE_HOST_NAME = os.getenv('SITE_HOST_NAME', "localhost")
SITE_HOST_PORT = os.getenv('SITE_HOST_PORT', "8000")

# use the WorldMap client
GEONODE_CLIENT_HOOKSET = "geonode_worldmap.hooksets.WorldMapHookSet"
CORS_ORIGIN_WHITELIST = (
    HOSTNAME
)

#Define email service on GeoNode
EMAIL_ENABLE = False

if EMAIL_ENABLE:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = os.getenv('EMAIL_HOST', default='')
    EMAIL_PORT = 25
    EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', default='')
    EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', default='')
    EMAIL_USE_TLS = True
    DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

PG_HOST = os.getenv('PG_HOST', 'localhost')
PG_USERNAME = os.getenv('PG_USERNAME', 'worldmap')
PG_PASSWORD = os.getenv('PG_PASSWORD', 'worldmap')
PG_WORLDMAP_DJANGO_DB = os.getenv('PG_WORLDMAP_DJANGO_DB', 'geonode')
PG_WORLDMAP_UPLOADS_DB = os.getenv('PG_WORLDMAP_UPLOADS_DB', 'geonode_data')

DATABASES = {
        'default': {
            'ENGINE': 'django.contrib.gis.db.backends.postgis',
            'NAME': PG_WORLDMAP_DJANGO_DB,
            'USER': PG_USERNAME,
            'PASSWORD': PG_PASSWORD,
            'HOST': PG_HOST,
            'PORT': '5432',
            'CONN_TOUT': 900,
        },
        # vector datastore for uploads
        'datastore': {
            'ENGINE': 'django.contrib.gis.db.backends.postgis',
            # 'ENGINE': '', # Empty ENGINE name disables
            'NAME': PG_WORLDMAP_UPLOADS_DB,
            'USER': PG_USERNAME,
            'PASSWORD': PG_PASSWORD,
            'HOST': PG_HOST,
            'PORT': '5432',
            'CONN_TOUT': 900,
        }
    }

# shard per month
SHARD_STRATEGY = 'monthly'
SHARD_PREFIX = 'wm_'
DATASTORE_URL = 'postgis://%s:%s@%s:5432/data' % (PG_USERNAME, PG_PASSWORD, PG_HOST)

GEOSERVER_LOCATION = os.getenv(
    'GEOSERVER_LOCATION', 'http://localhost:8080/geoserver/'
)

GEOSERVER_LOCATION = os.getenv(
    'GEOSERVER_LOCATION', 'http://localhost:8080/geoserver/'
)

GEOSERVER_PUBLIC_HOST = os.getenv(
    'GEOSERVER_PUBLIC_HOST', SITE_HOST_NAME
)

GEOSERVER_PUBLIC_PORT = os.getenv(
    'GEOSERVER_PUBLIC_PORT', 8080
)

GEOSERVER_PUBLIC_LOCATION = os.getenv(
    'GEOSERVER_PUBLIC_LOCATION', 'http://{}:{}/geoserver/'.format(GEOSERVER_PUBLIC_HOST, GEOSERVER_PUBLIC_PORT)
)

OGC_SERVER_DEFAULT_USER = os.getenv(
    'GEOSERVER_ADMIN_USER', 'admin'
)

OGC_SERVER_DEFAULT_PASSWORD = os.getenv(
    'GEOSERVER_ADMIN_PASSWORD', ''
)

# OGC (WMS/WFS/WCS) Server Settings
OGC_SERVER = {
    'default': {
        'BACKEND': 'geonode.geoserver',
        'LOCATION': GEOSERVER_LOCATION,
        'LOGIN_ENDPOINT': 'j_spring_oauth2_geonode_login',
        'LOGOUT_ENDPOINT': 'j_spring_oauth2_geonode_logout',
        'PUBLIC_LOCATION': GEOSERVER_PUBLIC_LOCATION,
        'USER': OGC_SERVER_DEFAULT_USER,
        'PASSWORD': OGC_SERVER_DEFAULT_PASSWORD,
        'MAPFISH_PRINT_ENABLED': True,
        'PRINT_NG_ENABLED': True,
        'GEONODE_SECURITY_ENABLED': True,
        'GEOFENCE_SECURITY_ENABLED': GEOFENCE_SECURITY_ENABLED,
        'GEOFENCE_URL': os.getenv('GEOFENCE_URL', 'internal:/'),
        'GEOGIG_ENABLED': False,
        'WMST_ENABLED': False,
        'BACKEND_WRITE_ENABLED': True,
        'WPS_ENABLED': False,
        'LOG_FILE': '%s/geoserver/data/logs/geoserver.log',
        # Set to dictionary identifier of database containing spatial data in
        # DATABASES dictionary to enable
        'DATASTORE': os.getenv('DEFAULT_BACKEND_DATASTORE', 'wmdata'),
        'PG_GEOGIG': False,
        # 'CACHE': ".cache"  # local cache file to for HTTP requests
        'TIMEOUT': int(os.getenv('OGC_REQUEST_TIMEOUT', '30'))  # number of seconds to allow for HTTP requests
    }
}

# If you want to enable Mosaics use the following configuration
UPLOADER = {
    # 'BACKEND': 'geonode.rest',
    'BACKEND': 'geonode.importer',
    'OPTIONS': {
        'TIME_ENABLED': False,
        'MOSAIC_ENABLED': False,
        'GEOGIG_ENABLED': False,
    },
    'SUPPORTED_CRS': [
        'EPSG:4326',
        'EPSG:3785',
        'EPSG:3857',
        'EPSG:900913',
        'EPSG:32647',
        'EPSG:32736'
    ]
}


### WorldMap Settings ###


# for now we remove CsrfViewMiddleware, which creates failures on x-csrftoken
# We need to fix this

# MIDDLEWARE_CLASSES += (
#     # 'django.middleware.csrf.CsrfViewMiddleware', # remove csrf because it will stop users from extranet
#     # Add cache middleware for the per-site cache
#     'django.middleware.cache.UpdateCacheMiddleware',
#     'django.middleware.common.CommonMiddleware',
#     'django.middleware.cache.FetchFromCacheMiddleware',
# )


# Modify the default permission of download data from true to false
# DEFAULT_ANONYMOUS_VIEW_PERMISSION = strtobool(
#     os.getenv('DEFAULT_ANONYMOUS_VIEW_PERMISSION', 'True')
# )
# DEFAULT_ANONYMOUS_DOWNLOAD_PERMISSION = strtobool(
#     os.getenv('DEFAULT_ANONYMOUS_DOWNLOAD_PERMISSION', 'False')
# )

# Remove google earth from download formats
DOWNLOAD_FORMATS_VECTOR = [
    'JPEG', 'PDF', 'PNG', 'Zipped Shapefile', 'GML 2.0', 'GML 3.1.1', 'CSV',
    'Excel', 'GeoJSON', 'KML', 'Tiles',
    'QGIS layer file (.qlr)',
    'QGIS project file (.qgs)',
]
DOWNLOAD_FORMATS_RASTER = [
    'JPEG',
    'PDF',
    'PNG',
    'ArcGrid',
    'GeoTIFF',
    'Gtopo30',
    'ImageMosaic',
    'KML',
    # 'View in Google Earth',
    'Tiles',
    'GML',
    'GZIP',
    'QGIS layer file (.qlr)',
    'QGIS project file (.qgs)',
    'Zipped All Files'
]

DEFAULT_MAP_ABSTRACT = """
    <h3>The Harvard WorldMap Project2</h3>

    <p>WorldMap is an open source web mapping system. It has been developed to
    assist academic research and teaching as well as the general public.
    It supports data discovery, analysis, visualization, and data sharing of
    multi-disciplinary, multi-source and multi-format data, which is organized
    spatially and temporally.</p>

    <h4>Introduction to the WorldMap Project</h4>
    <p>WorldMap attempts to address the problem of discovering where things
    happen. It draws together an array of public maps and scholarly data
    to create a common source where users can:</p>

    <ul>
    <li>1. Interact with the best available public data for a
    city/region/continent</li>
    <li>2. See the whole of that area, yet also zoom in to particular places</li>
    <li>3. Accumulate both contemporary and historical data supplied by researchers
    and make it permanently accessible online</li>
    <li>4. Work collaboratively across disciplines and organizations with
    spatial information in an online environment</li>
    </ul>

    <p>The WorldMap project aims to accomplish these goals in stages, with public
    and private support. It draws on the basic insight of geographic
    information systems that spatiotemporal data becomes more meaningful
    as more "layers" are added, and makes use of tiling and indexing
    approaches to facilitate rapid search and visualization of
    large volumes of disparate data.</p>

    <p>WorldMap aims to augment existing initiatives for globally sharing
    spatial data and technology such as GSDI (Global Spatial Data
    Infrastructure). WorldMap makes use of OGC (Open Geospatial Consortium)
    compliant web services such as WMS (Web Map Service), emerging
    open standards such as WMS-C (cached WMS), and standards-based metadata
    formats, to enable WorldMap data layers to be inserted into existing
    data infrastructures.</p>

    <p>All WorldMap source code is made available here for others to use
    and improve upon.</p>
"""

CORS_ORIGIN_WHITELIST = [
    'http://localhost:8000',
    'http://localhost:8080',
]
