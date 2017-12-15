# worldmap-migration
Worldmap Database migrations....written in pure shell

Usage
=====


1. Make sure to load the sql dump.

	sudo -u $DB_USER psql -c "CREATE DATABASE $OLD_DB"

	sudo -u $DB_USER psql -d $OLD_DB < $SQL_DUMP_PATH


2. Run migration scripts

	chmod +x main.sh
	source main.sh -d $OLD_DB

If you wanna migrate geoserver styles
	source main.sh --database $OLD_DB  --styles


**Notes**

- Make sure you have loaded your database dump.

- Make sure you have the geoserver styles tables within files.


Other things to do during migration
===================================

* install GDAL GeoServer plugin
* run django find_geoserver_broken_layers to check if some layers was not imported
* truncate styles and links table
* run django fix_migrated_layers (regenerate styles, links and thumbnails)
* run django sync_geofence command

GeoServer data Directory
========================

* security directory must be removed, and we need to use the one which comes with geoserver-2.12.x.war
* add geofence directory (included in geoserver-2.12.x.war)
* configure security (input oauth parameters)
