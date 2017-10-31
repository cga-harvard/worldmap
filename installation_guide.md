## Development Installations
### Ubuntu

Ubuntu development build instructions using an isolated virtual environment (tested on Ubuntu 14.04 LTS):

    # Install Ubuntu dependencies
    sudo apt-get update
    sudo apt-get install python-virtualenv python-dev libxml2 libxml2-dev libxslt1-dev zlib1g-dev libjpeg-dev libpq-dev libgdal-dev git default-jdk

    # Install Java 8 (needed by latest GeoServer 2.12)
    sudo apt-add-repository ppa:webupd8team/java
    sudo apt-get update
    sudo apt-get install oracle-java8-installer

    # Create and activate the virtualenv
    virtualenv --no-site-packages venv
    source venv/bin/activate

    # git clone GeoNode:
    git clone https://github.com/cga-harvard/cga-worldmap.git
    cd cga-worldmap
    git checkout wm-master
    
    # Install pip GeoNode dependencies
    pip install -r requirements.txt
    pip install -e .
    pip install pygdal==`gdal-config --version`
    
    #git clone Worldmap:
    cd ..
    git clone https://github.com/cga-harvard/worldmap.git
    cd worldmap
    pip install -r requirements.txt
    
    # Paver setup
    paver setup
    paver sync
    paver start
    
    # If you got an error with django-user-accounts  (Only if it is necessary)
    pip uninstall -y django-user-accounts
    pip uninstall -y geonode-user-accounts==1.0.13
    pip install geonode-user-accounts==1.0.13
    
    
For Ubuntu 16.04 you should create your virtual-env like this instead (so with site packages)::

    virtualenv venv

Instead of installing pygdal, you should do the following::

    # Install the system python-gdal
    sudo apt-get install python-gdal
    # Create a symbolic link in your virtualenv
    ln -s /usr/lib/python2.7/dist-packages/osgeo venv/lib/python2.7/site-packages/osgeo

You can now setup and start Worldmap::

    # Paver setup
    paver setup
    paver sync
    paver start
    
In case you want to be involved in static files development::

    sudo apt-get install npm
    sudo npm install -g bower
    sudo npm install -g grunt-cli


### MAC OSX

    #Installing Homebrew 
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
   
    #Installing Libraries
    HOMEBREW_NO_AUTO_UPDATE=1  brew install libspatialite proj gdal
    
    #Installing Java 8:
    brew update
    brew tap caskroom/cask
    brew cask install caskroom/versions/java8
    
    #Create and activate the virtualenv
    virtualenv --no-site-packages venv
    source venv/bin/activate

    # git clone GeoNode:
    git clone https://github.com/cga-harvard/cga-worldmap.git
    cd cga-worldmap
    git checkout wm-master
    
    # Install pip GeoNode dependencies
    pip install -r requirements.txt
    pip install -e .
    pip install pygdal==`gdal-config --version`
    
    #git clone Worldmap:
    cd ..
    git clone https://github.com/cga-harvard/worldmap.git
    cd worldmap
    pip install -r requirements.txt
    
    # Paver setup
    paver setup
    paver sync
    paver start
    
    # If you got an error with django-user-accounts  (Only if it is necessary)
    pip uninstall -y django-user-accounts
    pip uninstall -y geonode-user-accounts==1.0.13
    pip install geonode-user-accounts==1.0.13
    

### For JavaScript Developers
#### Minified Scripts

JavaScript Developers can switch to using unminified scripts and CSS:

    Get and run geonode-client:

        $ cd src/geonode-client $ ant init debug

    Set the GEONODE_CLIENT_LOCATION entry in local_settings.py to

        http://localhost:9090/

Note that this requires ant (http://ant.apache.org/) in addition to the build requirements.

To build the javascript files:

     ant buildjs

#### How to add a new gxp tool/plugin

Edit src/geonode-client/buildjs.cfg and add the needed plugin/tool:

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

### Rebuild the client:

    cd src/geonode-client
    ant init build

    
    
    
    
