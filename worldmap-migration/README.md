# worldmap-migration
Worldmap Database migrations....written in pure shell

Usage
=====


1. Make sure to load the sql dump.

	sudo -u $DB_USER psql -c "CREATE DATABASE $OLD_DB"

	sudo -u $DB_USER psql -d $OLD_DB < $SQL_DUMP_PATH


2. Run migration scripts

	chmod +x main.sh
	source main.sh --database $OLD_DB
	# If you wanna migrate geoserver styles
	source main.sh --database $OLD_DB  --styles

**Notes**

- Make sure you have loaded your database dump.

- Make sure you have the geoserver styles tables within files.
