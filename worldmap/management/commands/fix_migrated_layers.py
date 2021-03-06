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

import sys
import requests

from django.core.management.base import BaseCommand

from geonode.geoserver.helpers import gs_catalog, ogc_server_settings
from geonode.layers.models import Layer
from geonode.people.models import Profile


def fix_layer_in_gwc(layer):
    print 'Fixing %s in GWC' % layer.alternate
    headers = {'Content-Type': 'application/xml'}
    url = ogc_server_settings.public_url
    user = gs_catalog.username
    password = gs_catalog.password
    url_xml = "%sgwc/rest/layers/%s.xml" % (url, layer.alternate)
    print url_xml
    resp = requests.get(url=url_xml, auth=(user, password))
    xml = resp.content
    xml_fixed = xml.replace('<mimeFormats>\n    <string>image/png</string>\n  </mimeFormats>', '<mimeFormats>\n    <string>image/png</string>\n    <string>image/png8</string>\n  </mimeFormats>')
    data = xml_fixed.replace('\n', '')
    print requests.post(url_xml, data=data, headers=headers, auth=(user, password)).text


def is_gs_resource_valid(layer):
    gs_resource = gs_catalog.get_resource(
            layer.name,
            store=layer.store,
            workspace=layer.workspace)
    if gs_resource:
        return True
    else:
        return False


class Command(BaseCommand):
    """
    Fixes migrated WorldMap layers (from 1.2 to 2.8.x).
    This includes:
    1) layer.save to generate syles, links and thumbnails and sync with sync_geofence
    2) fixes GWC
    The command detects also broken GeoNode layers (layer without a resource in GeoServer)
    """
    help = 'Fixes migrated WorldMap layers (from 1.2 to 2.8.x)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--layername',
            dest='layername',
            default=None,
            help='Filter by a layername.',
        )
        parser.add_argument(
            '--owner',
            dest='owner',
            default=None,
            help='Filter by a owner.',
        )

    def handle(self, **options):
        if options['layername']:
            layers = Layer.objects.filter(name__icontains=options['layername'])
        else:
            layers = Layer.objects.all()
        if options['owner']:
            layers = layers.filter(owner=Profile.objects.filter(username=options['owner']))

        layers_count = layers.count()
        count = 0

        layer_errors = []
        for layer in layers:
            count += 1
            try:
                print 'Fixing layer %s/%s: %s owned by %s' % (count,
                                                              layers_count,
                                                              layer.alternate,
                                                              layer.owner.username)
                if is_gs_resource_valid(layer):
                    print 'Saving %s layer' % layer.alternate
                    layer.save()
                    fix_layer_in_gwc(layer)
                else:
                    print 'Layer %s is broken' % layer.alternate
                    layer_errors.append(layer)
                    if options['remove']:
                        print 'Removing this layer...'
                        layer.delete()
            except:
                print("Unexpected error:", sys.exc_info()[0])

        print '\n***** Layers with errors: %s in a total of %s *****' % (len(layer_errors), layers_count)
        for layer_error in layer_errors:
            print '%s by %s' % (layer.alternate, layer.owner.username)
