#!/bin/bash
set -e

DATABASE_NAME=worldmap
DATASTORE_NAME=worldmap_data

# Create django database.
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -c "CREATE DATABASE $DATABASE_NAME;"

# Then, create datastore database and include postgis extension.
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -c "CREATE DATABASE $DATASTORE_NAME;"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DATASTORE_NAME" <<-EOSQL
    CREATE EXTENSION postgis;
    CREATE EXTENSION postgis_topology;
    GRANT ALL ON geometry_columns TO PUBLIC;
    GRANT ALL ON spatial_ref_sys TO PUBLIC;
EOSQL
