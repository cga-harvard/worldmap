import json
import psycopg2
import sys

from django.conf import settings
from django.core.management.base import BaseCommand

from geonode.layers.models import Layer
from geonode.security.views import _perms_info_json
from geonode.geoserver.helpers import set_attributes_from_geoserver


def checkLayer(layer, remove=False):
    host = settings.DATABASES['default']['HOST']
    user = settings.DATABASES['default']['USER']
    password = settings.DATABASES['default']['PASSWORD']
    conn = psycopg2.connect("dbname='%s' host='%s' port='5432' user='%s' password='%s'" % (layer.store, host, user, password))
    cur = conn.cursor()
    layer_name = layer.alternate[8:]
    try:
        cur.execute('SELECT COUNT(*) FROM "%s";' % layer_name)
        num_features = cur.next()[0]
        if num_features == 0:
            print '%s, "%s", %s, %s, %s, %s%s' % (layer.alternate,
                                        layer.title.replace('"', '\''),
                                        layer.owner.username,
                                        layer.owner.email,
                                        layer.date.isoformat(),
                                        settings.SITEURL[0:-1], layer.get_absolute_url()
            )
            if remove:
                print 'Removing layer %s' % layer_name
                layer.delete()
    except:
        # some layer table name isn't the same as alternate, for now we skip them
        pass
    cur.close()
    conn.close()

def remove_empty_layers(remove_layers, filter, username, store):
    storeList = []
    if store:
        storeList.append(store)
    else:
        storeList.append('wmdata')
        storeList.append('dataverse')
        for year in [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]:
            for month in range(1, 13):
                storeList.append('wm_%s%02d' % (year, month))
    layers = Layer.objects.filter(storeType='dataStore').order_by('name')
    print 'Checking in stores: %s' % storeList
    if filter:
        layers = layers.filter(name__icontains=filter)
    if username:
        layers = layers.filter(owner__username=username)
    layers_count = layers.count()
    count = 0
    layer_errors = []
    for layer in layers:
        try:
            count += 1
            if layer.store in storeList:
                checkLayer(layer, remove_layers)
        except Exception:
            layer_errors.append(layer.alternate)
            exception_type, error, traceback = sys.exc_info()
            print exception_type, error, traceback
    print 'There are %s layers which could not be deleted because of errors' % len(layer_errors)
    for layer_error in layer_errors:
        print layer_error


class Command(BaseCommand):
    help = 'Remove vector layers with no features.'

    def add_arguments(self, parser):
        parser.add_argument(
            '-r',
            '--remove-layers',
            action='store_true',
            dest='remove_layers',
            default=False,
            help='Effective remove the layers.'
        )
        parser.add_argument(
            '-f',
            '--filter',
            dest="filter",
            default=None,
            help="Only check layers that match the given filter"),
        parser.add_argument(
            '-u',
            '--username',
            dest="username",
            default=None,
            help="Only check layers owned by the specified username"),
        parser.add_argument(
            '-s',
            '--store',
            dest="store",
            default=None,
            help="Only check layers in the given store name")

    def handle(self, **options):
        remove_layers = options.get('remove_layers')
        filter = options.get('filter')
        if not options.get('username'):
            username = None
        else:
            username = options.get('username')
        if not options.get('store'):
            store = None
        else:
            store = options.get('store')
        remove_empty_layers(remove_layers, filter, username, store)
