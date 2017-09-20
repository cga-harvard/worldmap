Worldmap
========

How to build and run WorldMap
-----------------------------

Create a virtual environment and activate it::

    $ virtualenv --no-site-packages env
    $ . env/bin/activate

Create a directory for your env:

    $ mkdir worldmap
    $ cd worldmap

Clone GeoNode:

    $ git clone https://github.com/cga-harvard/cga-worldmap.git
    $ cd cga-worldmap.git
    $ git checkout wm-master
    $ pip install -r requirements.txt
    $ pip install -e .
    $ pip install pinax-theme-bootstrap-account==1.0b2
    $ pip install pygdal==1.10.1

Clone Worldmap and build it:

    $ cd ..
    $ git clone https://github.com/cga-harvard/worldmap.git
    $ cd worldmap
    $ paver setup
    $ paver sync

Start it:

    $ paver start

How to use the WorldMap client
------------------------------

In your local_settings.py file, change the variable LAYER_PREVIEW_LIBRARY to 'worldmap'::

    LAYER_PREVIEW_LIBRARY = 'worldmap'

For JavaScript Developers
-------------------------

Minified Scripts
................

JavaScript Developers can switch to using unminified scripts and CSS:

1. Get and run geonode-client:

    $ cd src/geonode-client
    $ ant init debug

2. Set the GEONODE_CLIENT_LOCATION entry in local_settings.py to
    ``http://localhost:9090/``

Note that this requires ant (http://ant.apache.org/) in addition to the
build requirements.

How to add a new gxp tool/plugin
................................

Edit src/geonode-client/buildjs.cfg and add the needed plugin/tool::

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

Rebuild the client::

    $ cd src/geonode-client
    $ ant init build
