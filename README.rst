Worldmap
========

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
