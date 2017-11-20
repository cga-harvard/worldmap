#Local Variables
## You can customize these variables to modify username,
##password  database's names.
USERNAME=worldmap
PASSWORD=worldmap
WORLDMAP_DB=worldmap
WMDATA=wmdata
OWNER=$(USERNAME)

start_django:
	python manage.py runserver 0.0.0.0:8000

create_user_db:
	#creating username for postgres
	sudo -u postgres psql -c "CREATE USER $(USERNAME) WITH SUPERUSER PASSWORD '$(PASSWORD)';" ;

drop_user_db:
	#deleting username for postgres
	sudo -u postgres psql -c "DROP ROLE $(USERNAME);"

create_db:
	#Creating Databases
	sudo -u postgres psql -c "CREATE DATABASE $(WORLDMAP_DB) WITH OWNER $(OWNER);"
	sudo -u postgres psql -d worldmap -c "CREATE EXTENSION postgis;"
	sudo -u postgres psql -c "CREATE DATABASE $(WMDATA) WITH OWNER $(OWNER);"
	sudo -u postgres psql -d wmdata -c "CREATE EXTENSION postgis;"

drop_db:
	#Deleting Databases
	sudo -u postgres psql -c "DROP DATABASE $(WORLDMAP_DB);"
	sudo -u postgres psql -c "DROP DATABASE $(WMDATA);"

clean: drop_db drop_user_db

default_db: create_user_db create_db sync

sync:
	python manage.py makemigrations --noinput
	python manage.py migrate --noinput
	python manage.py loaddata fixtures/sample_admin.json
	python manage.py loaddata fixtures/default_oauth_apps.json
	python manage.py loaddata fixtures/initial_data.json
	python manage.py loaddata fixtures/default_auth_groups.json

pull:
	git pull origin master

smoketest:

	python manage.py test geonode.tests.smoke --noinput --nocapture --detailed-errors --verbosity=1 --failfast

unittest:
	python manage.py test geonode.people.tests geonode.base.tests geonode.layers.tests geonode.maps.tests geonode.proxy.tests geonode.security.tests geonode.social.tests geonode.catalogue.tests geonode.documents.tests geonode.api.tests geonode.groups.tests geonode.services.tests geonode.geoserver.tests geonode.upload.tests geonode.tasks.tests --noinput --failfast

test:
	python manage.py test --failfast
static:
	@cd src/geonode-client && ant init dist
	@echo "Copy Static files to WorldmapClient Root...."
	@mkdir -p ~/worldmap/worldmap/static_root/worldmap_client/  
	@cp -R src/geonode-client/build/geonode-client/WEB-INF/app/static  ~/worldmap/worldmap/static_root/worldmap_client/  
