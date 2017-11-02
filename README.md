# How to build and run WorldMap

Follow this instructions to build and run WorldMap in Ubuntu 16.04 LTS.

## Install Ubuntu dependencies

```
$ sudo apt-get update
$ sudo apt-get install python-virtualenv python-dev libxml2 libxml2-dev libxslt1-dev zlib1g-dev libjpeg-dev libpq-dev libgdal-dev git default-jdk postgresql postgresql-contrib postgis
```

## Install Java 8 (needed by GeoServer)

```
$ sudo apt-add-repository ppa:webupd8team/java
$ sudo apt-get update
$ sudo apt-get install oracle-java8-installer
```

## Create and activate the virtualenv

```
$ virtualenv --no-site-packages env
$ source env/bin/activate
```

## Setup environmental variables

Create an env_vars file such as this one and source it. The content of the file should be something like this (change it accordingly to your system):

```
export GOOGLE_MAPS_API_KEY=your-key-here
export DATABASE_URL=postgis://worldmap:worldmap@localhost:5432/worldmap
export DATASTORE_URL=postgis://worldmap:worldmap@localhost:5432/wmdata
export DISABLE_SECURITY=False
export ALLOWED_HOSTS=localhost
export GEOSERVER_PUBLIC_LOCATION=http://localhost:8080/geoserver/
export GEOSERVER_LOCATION=http://localhost:8080/geoserver/
export GEOSERVER_BASE_URL=http://localhost:8080/geoserver/
export USE_GAZETTEER=False
export HYPERMAP_REGISTRY_URL=http://your-hypermap-host
export SOLR_URL=http://your-solr-host/hypermap/select
```

```
$ vi env_vars # copy the content there
$ source env_vars
```

## Create the PostGIS role and databases

```
$ sudo su postgres
$ psql

postgres=# CREATE USER worldmap WITH SUPERUSER PASSWORD 'worldmap';;
CREATE ROLE
postgres=# CREATE DATABASE worldmap WITH OWNER worldmap;
CREATE DATABASE
postgres=# \c worldmap
You are now connected to database "worldmap" as user "postgres".
worldmap=# CREATE EXTENSION postgis;
CREATE EXTENSION
worldmap=# CREATE DATABASE wmdata WITH OWNER worldmap;
CREATE DATABASE
worldmap=# \c wmdata
You are now connected to database "wmdata" as user "postgres".
worldmap=# CREATE EXTENSION postgis;
CREATE EXTENSION
wmdata=# \q

$ exit
```

## Install GeoNode

```
git clone -b wm-develop https://github.com/cga-harvard/cga-worldmap.git
cd cga-worldmap
pip install -r requirements.txt
pip install -e .
pip install pygdal==1.11.3.3
paver setup
paver sync
```

## Install WorldMap

```
cd ..
git clone https://github.com/cga-harvard/worldmap.git
cd worldmap
pip install -r requirements.txt
python manage.py migrate
```

## Start Django

```
cd ../worldmap
python manage.py runserver 0.0.0.0:8000
```

## Start GeoServer

Open another shell terminal and start GeoServer:

```
cd ../cga-worldmap
paver start_geoserver
```

# For JavaScript Developers

## Minified Scripts

JavaScript Developers can switch to using unminified scripts and CSS:

Run geonode-client in debug mode:

```
$ cd src/geonode-client
$ ant init debug
```

Set the GEONODE_CLIENT_LOCATION entry in local_settings.py to ``http://localhost:9090/``

Note that this requires ant (http://ant.apache.org/) in addition to the
build requirements.

To build the javascript files:

```
$ ant buildjs
```

## How to add a new gxp tool/plugin

Edit src/geonode-client/buildjs.cfg and add the needed plugin/tool:

```
[OpenLayers.js]
...
include =
  ...
  OpenLayers/Control/Measure.js
  ...
[gxp.js]
...
include =
  ...
  plugins/Measure.js
  ...
```

Rebuild the client:

```
$ cd src/geonode-client
$ ant init build
```
