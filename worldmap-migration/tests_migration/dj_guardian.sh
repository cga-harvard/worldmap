#!/bin/bash

source ../config.sh

TEST_USER="jorge"
TEST_EMAIL="jorge@piensa.co"
TEST_PW="jorge"

sudo -u $USER PGPASSWORD=$DB_PW \
psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $NEW_DB -c \
	"TRUNCATE TABLE base_resourcebase CASCADE;
	TRUNCATE TABLE layers_layer CASCADE;
	TRUNCATE TABLE guardian_userobjectpermission;"

# Create users.
source $ENV_PATH/bin/activate
echo "from geonode.people.models import Profile;
     Profile.objects.create_user('$TEST_USER', '$TEST_EMAIL', '$TEST_PW')" | \
python $GEONODE_PATH/manage.py shell

ID=$(sudo -u $USER psql $NEW_DB -c \
    "COPY (
        SELECT id FROM people_profile WHERE username='$TEST_USER')
    TO STDOUT WITH CSV")

# Create sample layer.
cat base.txt | sed 's/owner_id/'"$ID"'/g' | \
sudo -u $USER psql $NEW_DB -c "copy base_resourcebase (id, polymorphic_ctype_id, uuid, owner_id, title, date, date_type, abstract, language, supplemental_information, srid, csw_typename, csw_schema, csw_mdsource, csw_type, csw_wkt_geometry, metadata_uploaded, popular_count, share_count, featured, is_published, bbox_x0, bbox_y0, bbox_x1, bbox_y1, detail_url, metadata_uploaded_preserve) from stdin csv"

cat layer.txt | \
sudo -u $USER \
psql $NEW_DB -c 'COPY layers_layer (resourcebase_ptr_id, title_en, abstract_en, purpose_en, constraints_other_en, supplemental_information_en, data_quality_statement_en, workspace, store, "storeType", name, typename, charset, is_mosaic, has_time, has_elevation) from stdin csv'

# Give permissions.
sudo -u $USER psql $NEW_DB -c "INSERT INTO guardian_userobjectpermission(object_pk, content_type_id, permission_id, user_id)   SELECT '3355' as object_pk, django_content_type.id as ct_id, unnest(array[166, 167, 168, 169, 170, 171, 172, 173]) as permission_id, people_profile.id AS user_id FROM people_profile INNER JOIN django_content_type ON django_content_type.model='resourcebase' AND people_profile.username='$TEST_USER'"


