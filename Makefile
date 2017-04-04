up:
	# bring up the services
	docker-compose up -d

build:
	docker-compose build django
	docker-compose build celery

sync: up 
	# set up the database tablea
	#it shouldn't be done, but it works 
	docker-compose exec django django-admin.py makemigrations --noinput
	docker-compose exec django django-admin.py migrate account --noinput
	#New GeoNode release should be worked with only one migrate command
	docker-compose exec django django-admin.py migrate --noinput
	docker-compose exec django django-admin.py loaddata sample_admin
	docker-compose exec django django-admin.py loaddata fixtures/default_oauth_apps_docker.json
	docker-compose exec django django-admin.py loaddata fixtures/initial_data.json

pull:
	docker-compose pull

wait:
	sleep 5

logs:
	docker-compose logs --follow

down:
	docker-compose down

test:
	docker-compose exec django django-admin.py test --failfast

reset: down up wait sync

hardreset: pull build reset
