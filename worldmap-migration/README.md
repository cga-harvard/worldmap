# worldmap-migration
Worldmap Database migrations....written in pure shell

Usage
=====

The code is made in bash for the migration of an old version of worldmap to the current version. In order for the migration process to be done correctly, please follow the instructions below.

1. Make sure to load the sql dump from old worldmap database. It is necessary to make a copy, wr don't recommend to use the original db because we dont want to lose information To clarify, `$OLD_DB` corresponds to the name that we will assign to the database that is the copy of the old worldmap database. And `$SQL_DUMP_PATH` is the path from dump file of old worldmap database which we should generate before to do this process. 
	
		sudo -u $DB_USER psql -c "CREATE DATABASE $OLD_DB"

		sudo -u $DB_USER psql -d $OLD_DB < $SQL_DUMP_PATH

2. Getting styles for Geoserver. 

    2.1. Copy styles_migration.sh to GEOSERVER DATA DIRECTORY
    		
		cp styles_migration.sh /path/to/data/dir/geoserver
		
     2.2. Edit GEOSERVER_URL and STYLES_FOLDER. Make sure `GEOSERVER_URL` corresponds to public location and `STYLES_FOLDER` is the directory where geoserver saves the styles.
		
		 vim styles_migration.sh
     2.3. Generate `styles.sh`. 
     
   	         ./styles_migration.sh

3. Configurate some env variables. Please edit config.sh file. 

   	 
```
   	 
	export USER=postgres
	export OLD_DB=Name_for_backup_database_of_old_worldmap
	export DB_USER=worldmap #DATABASE OWNER
	export DB_PW=password   #OWNER USER PASSWORD 
	export PGPASSWORD=$DB_PW
	export DB_HOST=localhost #database host location
	export NEW_DB=new_one_database_name
	export GEONODE_PATH=/home/paolo/worldmap #Worldmap location, if you will do the migration locally
	export GEOSERVER_URL=http://128.31.22.83:8080/geoserver/ #GEOSERVER LOCATION
	export ENV_PATH=/path/to/env 
	export DATABASE_URL=postgis://$DB_USER:$DB_PW@$DB_HOST:5432/$NEW_DB
	export STYLES_PATH=/path/to/styles/csv/file #you can find this file inside geoserver directory
	
```

4. Run migration scripts

		chmod +x main.sh
		chmod -R +x scripts/
		source main.sh --database $OLD_DB
		For example:
		source main.sh --database worldmaplegacy

   If you wanna migrate geoserver styles
   		
		source main.sh --database $OLD_DB  --styles

**Notes**

- Make sure you have loaded your database dump.

- Make sure you have the geoserver styles tables within files.
