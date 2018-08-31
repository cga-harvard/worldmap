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
        'worldmap_site.certification',
        # additional apps for worldmap
        'geonode.contrib.datastore_shards',
        'debug_toolbar',
     )

if USE_WORLDMAP:

    # shard per month
    SHARD_STRATEGY = 'monthly'
    SHARD_PREFIX = 'wm_'
    DATASTORE_URL = 'postgis://%s:%s@%s:5432/data' % (PG_USERNAME, PG_PASSWORD, PG_HOST)

###########################################
# other settings specific to WorldMap CGA #
###########################################

ACCOUNT_APPROVAL_REQUIRED = False

GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY', 'your-api-key-here')

WM_BASELAYERS = [
    {
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
        "source": {"ptype": "gx_googlesource"},
        "group": "background",
        "name": "SATELLITE",
        "visibility": False,
        "fixed": True,
    }, {
        "source": {"ptype": "gx_googlesource"},
        "group": "background",
        "name": "TERRAIN",
        "visibility": True,
        "fixed": True,
    }, {
        "source": {"ptype": "gx_googlesource"},
        "group": "background",
        "name": "HYBRID",
        "visibility": False,
        "fixed": True,
    }, {
        "source": {"ptype": "gx_googlesource"},
        "group": "background",
        "name": "ROADMAP",
        "visibility": False,
        "fixed": True,
        "group": "background"
    }
]

MAP_BASELAYERS.extend(WM_BASELAYERS)

# debug toolbar
if DEBUG:
    MIDDLEWARE_CLASSES += (
        'debug_toolbar.middleware.DebugToolbarMiddleware',
    )
    # TODO read INTERNAL_IPS form env variable
    INTERNAL_IPS = ('127.0.0.1', 'localhost', '10.0.2.2', )
