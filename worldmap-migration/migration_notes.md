# database migrations

```shell
./manage.py migrate --fake gazetteer 0002_gazetteerattribute
./manage.py migrate --fake layers 0030_auto_20180228_0812
./manage.py migrate --fake services 0031_service_proxy_base
./manage.py migrate --fake wm_extra 0009_extmap_group_params
```


# thumbnail generation

```python
import sys
import traceback
from geonode.layers.models import Layer

count = 0

for layer in Layer.objects.all():
    count += 1
    if not layer.thumbnail_url:
        try:
            print 'Layer %s/%s: %s' % (count, Layer.objects.count(), layer.title)
            layer.save()
        except Exception as e:
            traceback.format_exception(*sys.exc_info())
    else:
        print 'This layer already has the thumbnail'
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
