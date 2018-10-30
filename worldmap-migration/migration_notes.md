# database migrations (for CAMP)

```shell
./manage.py migrate --fake gazetteer 0002_gazetteerattribute
./manage.py migrate --fake layers 0030_auto_20180228_0812
./manage.py migrate --fake services 0031_service_proxy_base
./manage.py migrate --fake wm_extra 0009_extmap_group_params
```

# fixes group

alter sequence auth_group_id_seq restart with 6;

# styles sync and thumbnail generation

Run this before syncing geofence permissions.

```python
import sys
import time
import timeit
import traceback
from geonode.layers.models import Layer

count = 0

for layer in Layer.objects.all():
    count += 1
    print 'Checking layer %s/%s: %s' % (count, Layer.objects.count(), layer.title)
    needs_sync = False
    if not layer.thumbnail_url:
        needs_sync = True
    if layer.styles.all().count() == 0:
        needs_sync = True
    if needs_sync:
        try:
            start = timeit.default_timer()
            layer.save()
            time.sleep(5)
            end = timeit.default_timer()
            total_time = end - start
            print 'Updated in %s' % total_time
        except Exception as e:
            traceback.format_exception(*sys.exc_info())
    else:
        print 'This layer already has the thumbnail and the styles synced'
```

# fix map layers IP

Use this command:

```bash
./manage updatemaplayerip
```

if raises error, use this SQL:

```sql
update maps_maplayer
set ows_url = replace(ows_url, 'worldmap.harvard.edu', '128.31.22.103'), layer_params = replace(layer_params, 'worldmap.harvard.edu', '128.31.22.103')
where local = True;
```

# fix broken maplayers (GeoNode 2.10 set styles in a list now vs a string)

```sql
update maps_maplayer
set styles = E'[\'' || styles || E'\']'
where local = true and not styles like '%[%';
```

# permissions checking

maps to check:

    http://worldmap.harvard.edu/maps/6442/info/
    http://worldmap.harvard.edu/maps/976/info/
    http://worldmap.harvard.edu/maps/121/info/

layers to check:

    http://worldmap.harvard.edu//data/geonode:informalurbanisation_okd
    http://worldmap.harvard.edu/data/geonode:etnicity_felix
    http://worldmap.harvard.edu//data/geonode:testpolygons_vxf
