# How to build and run WorldMap

Follow these instructions to build and run WorldMap in Ubuntu 16.04 LTS.

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

## Install GeoNode

```
git clone -b wm-develop https://github.com/cga-harvard/cga-worldmap.git
cd cga-worldmap
pip install --upgrade pip
pip install -r requirements.txt
pip install -e .
pip install pygdal==1.11.3.3
paver setup
```

## Install WorldMap

```
# clone worldmap
cd ..
git clone https://github.com/cga-harvard/worldmap.git
cd worldmap
pip install -r requirements.txt

# create the PostGIS role and databases
make create_user_db
make create_db
make sync
make static
```

## Start Django

```
python manage.py runserver 0.0.0.0:8000

or

make start_django
```

## Start GeoServer

Open another shell terminal and start GeoServer:

```
cd ../cga-worldmap
paver start_geoserver
```

# Installing WorldMap in production

When running WorldMap in production it is highly recommended to use a proper web sever (nginx or Apache httpd) in place of the Django server.

You can find a sample configuration for nginx and uwsgi in the scripts directory (nginx_sample and uwsgi_sample files).

# For WorldMap translators

WorldMap is mainly based on GeoNode, therefore there are two steps involved in having it translated into your language: one is related to GeoNode, the other to WorldMap itself.

## GeoNode translation

First, make sure that the GeoNode translation part is 100% completed for your language. This can be done using the `Transifex` platform (or with `Git` for experienced translators) at: https://www.transifex.com/geonode/geonode

A complete guide about how to contribute to GeoNode translation can be founde here: http://docs.geonode.org/en/master/organizational/contribute/contribute_to_translation.html

## WorldMap translation

Second step is to translate those additional strings which are not part of GeoNode, but exclusive to WorldMap. This can be done using `Git` and a couple of Django commands.

As a first step, make sure your language files are included in WorldMap. Languages file are in the worldmap/locale directory.

If your locale file is not there, you can generate it with the Django `makemessages` command. For example for Italian:

```
cd ~/worldmap.git
python manage.py makemessages -l it
```

Open the locale file you want to translate, in this case worldmap/locale/it/LC_MESSAGES, and edit the translation strings as needed, for example:

```
#: worldmap/templates/site_index.html:68
msgid ""
"Build your own mapping portal and publish it to the world or to just a few "
"collaborators. WorldMap is open source software."
msgstr "Sviluppa il tuo geoportale e condividi l'informazione geografica "
"con tutti o con specifici collaboratori. WorldMap e' open source"
```

Once you have translated the strings you want, you need to compile them before you see them in the site. For this purpose you can use the Django `compilemessages` command:

```
python manage.py compilemessages
```

Now if you browse the site you should see your translations correctly in place.

The `makemessages` and `compilemessages` needs the `GNU gettext` toolset to be installed on your computer. For Ubuntu 16.04 LTS this can be done in this way:

```
sudo apt-get install gettext
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
