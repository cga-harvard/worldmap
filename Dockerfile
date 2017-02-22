FROM geonode/django:geonode
MAINTAINER Ariel Núñez<ariel@terranodo.io>

# Copy the requirements first to avoid having to re-do it when the code changes.
# Requirements in requirements.txt are pinned to specific version
# usually the output of a pip freeze

COPY requirements.txt /usr/src/app/
RUN pip install --no-cache-dir -r requirements.txt
COPY . /usr/src/app/
RUN pip install --no-deps --no-cache-dir -e /usr/src/app/
EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]