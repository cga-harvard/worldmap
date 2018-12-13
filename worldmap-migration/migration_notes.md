# GeoServer

```shell
cd /mnt/sdp/backup/geoserver
tar xvzf 20181125.geoserver.tar.gz
cd /mnt/sdp
mv opt opt.old
mv /mnt/sdp/backup/geoserver/mnt/sdp/opt .
cd /mnt/sdp/opt/geonode/data/workspaces/geonode
./update_store_connection.sh # copy the script from this git repo and change the pwd
```

Deploy geoserver.war:

```
cd /opt/tomcat-latest/webapps
cp ~/downwloads/geoserver.war .
sudo service tomcat start
sudo service tomcat stop
```

Delete the security directory and use the latest version:

```shell
cd /mnt/sdp/opt/geonode/data
rm -rf security
cp -r /opt/tomcat-latest/webapps/geoserver/data/security .
```

Copy the GeoFence directory:

```
cd /mnt/sdp/opt/geonode/data
cp -r ~/downloads/geofence .
```

Deploy the jar libraries needed for GeoFence and PostGIS:

```
cd /opt/tomcat-latest/webapps/geoserver/WEB-INF/lib
cp ~/downloads/hibernate-spatial-postgis-1.1.3.1.jar .
cp ~/downloads/postgis-jdbc-1.3.3.jar .
```

Remove monitor:

```
cd /opt/tomcat-latest/webapps/geoserver/WEB-INF/lib
rm gs-monitor-*
```

Change the values in Django admin for the oauth application:

```
From:
http://localhost:8080/geoserver/index.html
http://localhost/geoserver/index.html
To:
http://128.31.22.103:8080/geoserver/index.html
http://128.31.22.103/geoserver/index.html
```

Start Tomcat and cross fingers :)

Once started, first thing to do is to change GeoServer proxy and security parameters accordingly. Then change the passwords for admin and root!

NB: the first GeoServer start will be extremely slow with hundreds of errors like this:

```
03 Dec 17:39:38 ERROR [geoserver.wms] - An error occurred trying to determine if the layer is geometryless
java.io.IOException: Schema 'unigisassignmnet_dyt' does not exist.
```

# PostgreSQL

Only for Camp

```shell
./manage.py migrate --fake gazetteer 0002_gazetteerattribute
./manage.py migrate --fake layers 0030_auto_20180228_0812
./manage.py migrate --fake services 0031_service_proxy_base
./manage.py migrate --fake wm_extra 0009_extmap_group_params
```
alter sequence auth_group_id_seq restart with 6;

# compromised sequences

Some sequence seems compromised. Set it correctly using this command:

```sql
select setval('base_resourcebase_id_seq', (select (max(id) + 1) from base_resourcebase), false);
select setval('layers_attribute_id_seq', (select (max(id) + 1) from layers_attribute), false);
select setval('base_contactrole_id_seq', (select (max(id) + 1) from base_contactrole), false);
```

# sync geofence permissions

```shell
sync_geofence
```

# styles sync and thumbnail generation

Run this after syncing geofence permissions.

```python
import sys
import time
import timeit
# import traceback
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
            end = timeit.default_timer()
            total_time = end - start
            print 'Updated in %s' % total_time
        except Exception as e:
            print str(e)
            # traceback.format_exception(*sys.exc_info())
    else:
        print 'This layer already has the thumbnail and the styles synced'
```

# fix map layers IP

```sql
update maps_maplayer
set ows_url = replace(ows_url, 'worldmap.harvard.edu', '128.31.22.103'), layer_params = replace(layer_params, 'worldmap.harvard.edu', '128.31.22.103')
where local = True;
```

# fix broken maplayers which cause the malformed string error (GeoNode 2.10 set styles in a list now vs a string)

```sql
update maps_maplayer
set styles = E'[\'' || styles || E'\']'
where local = true and not styles like '%[%';
```

# fix map snapshots:

```sql
update maps_mapsnapshot
set config = replace(config, 'worldmap.harvard.edu', '128.31.22.103');
```

# permissions checking

Fix permssions by using this:

```shell
python fix_permissions.py
```

maps to check:

    http://worldmap.harvard.edu/maps/6442/info/
    http://worldmap.harvard.edu/maps/976/info/
    http://worldmap.harvard.edu/maps/121/info/

layers to check:

    http://worldmap.harvard.edu//data/geonode:informalurbanisation_okd
    http://worldmap.harvard.edu/data/geonode:etnicity_felix
    http://worldmap.harvard.edu//data/geonode:testpolygons_vxf

Make sure this doesn't apply: https://github.com/cga-harvard/geonode/issues/528

# account activation

run this query after some clean up in the database (it looks like there is some user with multiple emails):

```sql
insert into account_emailaddress (email, verified, "primary", user_id) select email, true, true, min(id) from people_profile group by email;
```
