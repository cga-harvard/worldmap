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
# Load more settings from a file called local_settings.py if it exists
try:
    from worldmap.local_settings import *
#    from geonode.local_settings import *
except ImportError:
    from geonode.settings import *

PROJECT_NAME = 'worldmap_site'
LOCAL_ROOT = os.path.abspath(os.path.dirname(__file__))

WSGI_APPLICATION = "{}.wsgi.application".format(PROJECT_NAME)

# # Location of url mappings
ROOT_URLCONF = os.getenv('ROOT_URLCONF', '{}.urls'.format(PROJECT_NAME))
MEDIA_ROOT = os.getenv('MEDIA_ROOT', os.path.join(LOCAL_ROOT, "uploaded"))
STATIC_ROOT = os.getenv('STATIC_ROOT',
                         os.path.join(LOCAL_ROOT, "static_root")
                         )

# Additional directories which hold static files
STATICFILES_DIRS.append(
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

if PROJECT_NAME not in INSTALLED_APPS:
     INSTALLED_APPS += (
        PROJECT_NAME,
        'certification',
        # additional apps for worldmap
        'geonode.contrib.datastore_shards',
        #'debug_toolbar',
     )

# EMAIL server configuration
DEFAULT_FROM_EMAIL = 'Harvard WorldMap <worldmap@harvard.edu>'
SERVER_EMAIL = 'server@worldmap.harvard.edu'
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'localhost'
EMAIL_PORT = 25
EMAIL_HOST_USER = ''
EMAIL_HOST_PASSWORD = ''
EMAIL_USE_TLS = False

UPLOADER = {
    # 'BACKEND': 'geonode.rest',
    'BACKEND': 'geonode.importer',
    'OPTIONS': {
        'TIME_ENABLED': True,
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

if USE_WORLDMAP:
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
    GEONODE_CLIENT_LOCATION = '/static/worldmap_client/'
    GAZETTEER_DB_ALIAS = 'default'
    GAZETTEER_FULLTEXTSEARCH = False
    WM_COPYRIGHT_URL = "http://gis.harvard.edu/"
    WM_COPYRIGHT_TEXT = "Center for Geographic Analysis"
    USE_GAZETTEER = True
    DEFAULT_MAP_ABSTRACT = """
        <h3>The Harvard WorldMap Project</h3>
        <p>WorldMap is an open source web mapping system that is currently
        under construction. It is built to assist academic research and
        teaching as well as the general public and supports discovery,
        investigation, analysis, visualization, communication and archiving
        of multi-disciplinary, multi-source and multi-format data,
        organized spatially and temporally.</p>
    """
    # these are optionals
    GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY', 'your-key-here')
    USE_HYPERMAP = strtobool(os.getenv('USE_HYPERMAP', 'False'))
    HYPERMAP_REGISTRY_URL = os.getenv('HYPERMAP_REGISTRY_URL', 'http://localhost:8001')
    SOLR_URL = os.getenv('SOLR_URL', 'http://localhost:8983/solr/hypermap/select/')
    MAPPROXY_URL = os.getenv('MAPPROXY_URL', 'http://localhost:8001')
    # shard per month
    SHARD_STRATEGY = 'monthly'
    SHARD_PREFIX = 'wm_'
    DATASTORE_URL = 'postgis://%s:%s@%s:5432/data' % (PG_USERNAME, PG_PASSWORD, PG_HOST)

###########################################
# other settings specific to WorldMap CGA #
###########################################

ACCOUNT_APPROVAL_REQUIRED = False

WM_BASELAYERS = [
    # {
    #     "source": {"ptype": "gxp_stamensource"},
    #     "name": "watercolor",
    #     "visibility": False,
    #     "group": "background",
    #     "title": "Stamen Watercolor"
    # },
    # {
    #     "source": {"ptype": "gxp_stamensource"},
    #     "name": "toner",
    #     "visibility": False,
    #     "group": "background",
    #     "title": "Stamen Toner"
    # },
    # {
    #     "source": {
    #         "url": "http://services.arcgisonline.com/arcgis/rest/services/World_Shaded_Relief/MapServer",
    #         "ptype": "gxp_arcgiscachesource"},
    #     "group": "background",
    #     "name": "World Shaded Relief",
    #     "visibility": False,
    #     "fixed": True,
    #     "format": "jpeg",
    #     "tiled" : False,
    #     "title": "ESRI World Shaded Relief"
    # },
    # {
    #     "source": {
    #         "url": "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
    #         "ptype": "gxp_arcgiscachesource"},
    #     "group": "background",
    #     "name": "World Street Map",
    #     "visibility": False,
    #     "fixed": True,
    #     "format": "jpeg",
    #     "tiled" : False,
    #     "title": "ESRI World Street Map"
    # },
    # {
    #     "source": {
    #         "url": "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
    #         "ptype": "gxp_arcgiscachesource"},
    #     "group": "background",
    #     "format": "jpeg",
    #     "name": "World Imagery",
    #     "visibility": False,
    #     "fixed": True,
    #     "tiled" : False,
    #     "title": "ESRI World Imagery"
    # },
    # {
    #     "source": {
    #         "url": "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer",
    #         "ptype": "gxp_arcgiscachesource"},
    #     "group": "background",
    #     "name": "Light Gray Canvas Base",
    #     "visibility": False,
    #     "fixed": True,
    #     "format": "jpeg",
    #     "tiled" : False,
    #     "title": "ESRI Light Gray Reference"
    # },
    # {
    #     "source": {
    #         "url": "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer",
    #         "ptype": "gxp_arcgiscachesource"},
    #     "group": "background",
    #     "name": "Dark Gray Canvas Base",
    #     "visibility": False,
    #     "fixed": True,
    #     "format": "jpeg",
    #     "tiled" : False,
    #     "title": "ESRI Dark Gray Reference"
    # },
    # {
    #     "source": {"ptype": "gx_googlesource"},
    #     "group": "background",
    #     "name": "SATELLITE",
    #     "visibility": False,
    #     "fixed": True,
    # },
    # {
    #     "source": {"ptype": "gx_googlesource"},
    #     "group": "background",
    #     "name": "TERRAIN",
    #     "visibility": True,
    #     "fixed": True,
    # },
    # {
    #     "source": {"ptype": "gx_googlesource"},
    #     "group": "background",
    #     "name": "HYBRID",
    #     "visibility": False,
    #     "fixed": True,
    # },
    # {
    #     "source": {"ptype": "gx_googlesource"},
    #     "group": "background",
    #     "name": "ROADMAP",
    #     "visibility": False,
    #     "fixed": True,
    #     "group": "background"
    # },
    # {
    #     "source": {
    #         "ptype": "gxp_bingsource",
    #         "apiKey": BING_API_KEY
    #     },
    #     "name": "AerialWithLabels",
    #     "fixed": True,
    #     "visibility": False,
    #     "group": "background"
    # },
]

MAP_BASELAYERS.extend(WM_BASELAYERS)

# disable for now csrf - we need to implement it when wfst
MIDDLEWARE_CLASSES = (
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'dj_pagination.middleware.PaginationMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'oauth2_provider.middleware.OAuth2TokenMiddleware',
)

# geofence
# GEOFENCE_URL = os.getenv('GEOFENCE_URL', 'postgresql://geonode:geonde@localhost:5432/geofence')

if DEBUG:
    MIDDLEWARE_CLASSES += (
        #'debug_toolbar.middleware.DebugToolbarMiddleware',
    )
    # TODO read INTERNAL_IPS form env variable
    INTERNAL_IPS = ('127.0.0.1', 'localhost', '10.0.2.2', )
