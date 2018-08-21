#############################################################################
# Executing migration for layers tables
#############################################################################

echo "\nCreate view for bbox in legacy database"; do_dash
sudo -u $USER PGPASSWORD=$DB_PW \
psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $OLD_DB -c \
    "CREATE OR REPLACE VIEW maps_layer_bbox AS
        SELECT id,
            CAST(bbox[1] AS float) AS bbox_x0,
            CAST(bbox[2] AS float) AS bbox_y0,
            CAST(bbox[3] AS float) AS bbox_x1,
            CAST(bbox[4] AS float) as bbox_y1
        FROM (SELECT id,
            string_to_array(replace(replace(replace(llbbox, ']',
            ''), '[',''), ',',''), ' ')
            AS bbox
    FROM maps_layer) AS seq"

#############################################################################

echo "\nCreate new layers table views with bbox in legacy database"; do_dash
sudo -u $USER PGPASSWORD=$DB_PW \
psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $OLD_DB -c \
    "CREATE OR REPLACE VIEW augmented_maps_layer AS
        SELECT * FROM maps_layer
        INNER JOIN
            maps_layer_bbox USING (id) WHERE
                maps_layer_bbox.bbox_x0 > -181 AND
                maps_layer_bbox.bbox_x1 < 181 AND
                maps_layer_bbox.bbox_y0 > -91 AND
                maps_layer_bbox.bbox_y1 < 90"

#############################################################################

echo "\nGet layers content type needed for polymorphic, taggit and certifications"; do_dash
LAYER_CT_ID=$(sudo -u $USER psql $NEW_DB -c \
    "COPY (
        SELECT id FROM django_content_type WHERE model='layer')
    TO STDOUT WITH CSV")

#############################################################################

# TODO topic_category is not migrated! Fon now we hard-code "1"
echo "\nCopy items to resourcebase. Removing temporal extent fields
from previous database works"; do_dash
# ERROD: invalid input syntax for type timestamp with time zone: "0840"
# PGPASSWORD=$DB_PW psql -U $DB_USER -h $DB_HOST $OLD_DB -c "copy (select id, $ID, uuid, owner_id, title, date, date_type, abstract, language, supplemental_information, 'EPSG:4326', 'csw_typename', 'csw_schema', 'csw_mdsource', 'csw_type', 'csw_wkt_geometry', false, 0, 0, false, true, bbox_x0, bbox_y0, bbox_x1, bbox_y1, typename, false, temporal_extent_start, temporal_extent_end from augmented_maps_layer) to stdout with csv" | psql $NEW_DB -c "copy base_resourcebase (id, polymorphic_ctype_id, uuid, owner_id, title, date, date_type, abstract, language, supplemental_information, srid, csw_typename, csw_schema, csw_mdsource, csw_type, csw_wkt_geometry, metadata_uploaded, popular_count, share_count, featured, is_published, bbox_x0, bbox_y0, bbox_x1, bbox_y1, detail_url, metadata_uploaded_preserve, temporal_extent_start, temporal_extent_end) from stdin csv"
sudo -u $USER PGPASSWORD=$DB_PW \
psql -U $DB_USER -h $DB_HOST $OLD_DB -c "copy (select id, $LAYER_CT_ID, uuid, owner_id, title, date, date_type, abstract, language, supplemental_information, 'EPSG:4326', 'csw_typename', 'csw_schema', 'csw_mdsource', 'csw_type', 'csw_wkt_geometry', false, 0, 0, false, true, bbox_x0, bbox_y0, bbox_x1, bbox_y1, typename, typename, false, 1, false from augmented_maps_layer) to stdout with csv" | \
sudo -u $USER \
psql $NEW_DB -c "copy base_resourcebase (id, polymorphic_ctype_id, uuid, owner_id, title, date, date_type, abstract, language, supplemental_information, srid, csw_typename, csw_schema, csw_mdsource, csw_type, csw_wkt_geometry, metadata_uploaded, popular_count, share_count, featured, is_published, bbox_x0, bbox_y0, bbox_x1, bbox_y1, detail_url, alternate, metadata_uploaded_preserve, category_id, is_approved) from stdin csv"

#############################################################################

echo "\nSet detail_url as /layers/typename"; do_dash
sudo -u $USER psql $NEW_DB -c \
    "UPDATE base_resourcebase SET detail_url = '/layers/'||detail_url;"

#############################################################################

#TODO: include layer_temporal_extents, and correct gazetteer migrations.
# TODO handles in_gazetteer stuff
echo "\nCopy items to layer table"; do_dash
sudo -u $USER PGPASSWORD=$DB_PW \
psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $OLD_DB -c \
    'COPY (SELECT id, title, abstract, purpose, constraints_other, supplemental_information, data_quality_statement, workspace, store, "storeType", name, typename, name, false, false, false FROM augmented_maps_layer) to stdout with csv' | \
sudo -u $USER \
psql $NEW_DB -c 'COPY layers_layer (resourcebase_ptr_id, title_en, abstract_en, purpose_en, constraints_other_en, supplemental_information_en, data_quality_statement_en, workspace, store, "storeType", name, typename, charset, is_mosaic, has_time, has_elevation) from stdin csv'

#############################################################################

echo "\nCreating geowebcache url for layers"; do_dash
sudo -u $USER PGPASSWORD=$DB_PW \
psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $NEW_DB -c \
    "copy (select resourcebase_ptr_id, 'tiles', 'Tiles', 'image/png', 'image', CONCAT('$GEOSERVER_URL', 'gwc/service/gmaps?layers=', typename, '&zoom={z}&x={x}&y={y}&format=image/png8') FROM layers_layer) to stdout with csv" | \
sudo -u $USER \
psql $NEW_DB -c "copy base_link(resource_id, extension, name, mime, link_type, url) from stdin csv"

#############################################################################

echo "\nCopy items to wm_extra_layerstats table"; do_dash
sudo -u $USER PGPASSWORD=$DB_PW \
psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $OLD_DB -c \
    "copy (SELECT augmented_maps_layer.id, maps_layerstats.visits, maps_layerstats.uniques, maps_layerstats.downloads, maps_layerstats.last_modified FROM augmented_maps_layer, maps_layerstats WHERE augmented_maps_layer.id = maps_layerstats.layer_id) to stdout csv" | \
sudo -u $USER \
psql $NEW_DB -c "copy wm_extra_layerstats (layer_id, visits, uniques, downloads, last_modified) from stdin csv"

#############################################################################

echo "\nGet base content type needed for django_guardian"; do_dash
BASE_CT_ID=$(sudo -u $USER psql $NEW_DB -c \
    "COPY (
        SELECT id FROM django_content_type WHERE model='resourcebase')
    TO STDOUT WITH CSV")
#Layer Content type ID
LAYER_CT_ID=$(sudo -u $USER psql $NEW_DB -c \
    "COPY (
        SELECT id FROM django_content_type WHERE model='layer')
    TO STDOUT WITH CSV")
ADD_RESOURCE=$(sudo -u $USER psql $NEW_DB -c \
    "COPY (
        SELECT id FROM auth_permission WHERE codename='add_resourcebase')
    TO STDOUT WITH CSV")

CHANGE_RESO=$(sudo -u $USER psql $NEW_DB -c \
    "COPY (
        SELECT id FROM auth_permission WHERE codename='change_resourcebase')
    TO STDOUT WITH CSV")

DEL_RESOURCE=$(sudo -u $USER psql $NEW_DB -c \
    "COPY (
        SELECT id FROM auth_permission WHERE codename='delete_resourcebase')
    TO STDOUT WITH CSV")

CAN_VIEW=$(sudo -u $USER psql $NEW_DB -c \
    "COPY (
        SELECT id FROM auth_permission WHERE codename='view_resourcebase')
    TO STDOUT WITH CSV")

CHANGE_PERM=$(sudo -u $USER psql $NEW_DB -c \
    "COPY (
        SELECT id FROM auth_permission WHERE codename='change_resourcebase_permissions')
    TO STDOUT WITH CSV")

DOWN_RESO=$(sudo -u $USER psql $NEW_DB -c \
    "COPY (
        SELECT id FROM auth_permission WHERE codename='download_resourcebase')
    TO STDOUT WITH CSV")

PUBLISH_RESO=$(sudo -u $USER psql $NEW_DB -c \
    "COPY (
        SELECT id FROM auth_permission WHERE codename='publish_resourcebase')
    TO STDOUT WITH CSV")

CHANGE_META=$(sudo -u $USER psql $NEW_DB -c \
    "COPY (
        SELECT id FROM auth_permission WHERE codename='change_resourcebase_metadata')
    TO STDOUT WITH CSV")
CHANGE_STYLE=$(sudo -u $USER psql $NEW_DB -c \
    "COPY (
        SELECT id FROM auth_permission WHERE codename='change_layer_style')
    TO STDOUT WITH CSV")
EDIT_LAYER_DT=$(sudo -u $USER psql $NEW_DB -c \
    "COPY (
        SELECT id FROM auth_permission WHERE codename='change_layer_data')
    TO STDOUT WITH CSV")

#################################################################################
echo "\nCopy django_guardian permissions"; do_dash
sudo -u $USER PGPASSWORD=$DB_PW psql -U $DB_USER -h $DB_HOST $OLD_DB -c \
    "copy(
        SELECT user_id, $BASE_CT_ID, CAST(augmented_maps_layer.id AS VARCHAR) as resourcebase_id,
            CASE
                WHEN role_id=4 THEN unnest(array[$ADD_RESOURCE, $CAN_VIEW, $DOWN_RESO])
                WHEN role_id=5 THEN unnest(array[$ADD_RESOURCE, $CHANGE_RESO, $DEL_RESOURCE, $CAN_VIEW, $CHANGE_PERM, $DOWN_RESO, $PUBLISH_RESO, $CHANGE_META])
                WHEN role_id=6 THEN unnest(array[$ADD_RESOURCE, $CHANGE_RESO, $CAN_VIEW, $DOWN_RESO, $PUBLISH_RESO, $CHANGE_META])
            END AS permission_id
        FROM core_userobjectrolemapping, augmented_maps_layer
        WHERE augmented_maps_layer.id = core_userobjectrolemapping.object_id
            AND core_userobjectrolemapping.object_ct_id=18
    ) to stdout with csv;" | \
sudo -u $USER psql $NEW_DB -c \
    "copy guardian_userobjectpermission(user_id, content_type_id, object_pk, permission_id)
        FROM STDIN CSV
    "
### Change styles  permissions
sudo -u $USER PGPASSWORD=$DB_PW psql -U $DB_USER -h $DB_HOST $NEW_DB -c \
    "copy(
        SELECT 	base_resourcebase.owner_id,
        		$LAYER_CT_ID,
        		base_resourcebase.id,
        		$CHANGE_STYLE
        FROM base_resourcebase,
             layers_layer
        WHERE layers_layer.resourcebase_ptr_id = base_resourcebase.id
    ) to stdout with csv;" | \
sudo -u $USER psql $NEW_DB -c \
    "copy guardian_userobjectpermission(user_id, content_type_id, object_pk, permission_id)
        FROM STDIN CSV"

### Edit layer data permissions
sudo -u $USER PGPASSWORD=$DB_PW psql -U $DB_USER -h $DB_HOST $NEW_DB -c \
    "copy(
        SELECT  base_resourcebase.owner_id,
                        $LAYER_CT_ID,
                        base_resourcebase.id,
                        $EDIT_LAYER_DT
        FROM base_resourcebase,
             layers_layer
        WHERE layers_layer.resourcebase_ptr_id = base_resourcebase.id
    ) to stdout with csv;" | \
sudo -u $USER psql $NEW_DB -c \
    "copy guardian_userobjectpermission(user_id, content_type_id, object_pk, permission_id)
        FROM STDIN CSV"

sudo -u $USER PGPASSWORD=$DB_PW psql -U $DB_USER -h $DB_HOST $NEW_DB -c \
    "copy(
        SELECT DISTINCT -1,
                        $BASE_CT_ID,
                        resourcebase_ptr_id,
                        $CAN_VIEW
        FROM layers_layer
    ) to stdout with csv;" | \
sudo -u $USER psql $NEW_DB -c \
    "copy guardian_userobjectpermission(user_id, content_type_id, object_pk, permission_id)
        FROM STDIN CSV
    "

sudo -u $USER PGPASSWORD=$DB_PW psql -U $DB_USER -h $DB_HOST $NEW_DB -c \
    "copy(
        SELECT DISTINCT -1,
                        $BASE_CT_ID,
                        resourcebase_ptr_id,
                        $DOWN_RESO
        FROM layers_layer
    ) to stdout with csv;" | \
sudo -u $USER psql $NEW_DB -c \
    "copy guardian_userobjectpermission(user_id, content_type_id, object_pk, permission_id)
        FROM STDIN CSV
    "
###############################################################################
echo "\nCopy tagged items from layers"; do_dash
sudo -u $USER PGPASSWORD=$DB_PW psql -U $DB_USER -h $DB_HOST $OLD_DB -c \
    "copy(
        SELECT taggit_taggeditem.id,
               taggit_taggeditem.tag_id,
               augmented_maps_layer.id as object_id,
               $LAYER_CT_ID as content_type_id
        FROM taggit_taggeditem,
             augmented_maps_layer
        WHERE taggit_taggeditem.object_id = augmented_maps_layer.id
        AND tag_id in (SELECT id from taggit_tag)
    ) to stdout with csv;" | \
sudo -u $USER psql $NEW_DB -c \
    "copy taggit_taggeditem(id, tag_id, object_id, content_type_id)
        FROM STDIN CSV
    "

#############################################################################

echo "\nCopy certifications for layers"; do_dash
sudo -u $USER PGPASSWORD=$DB_PW psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $OLD_DB -c \
    "copy(SELECT certifier_id, $LAYER_CT_ID, augmented_maps_layer.id as object_id from certification_certification, augmented_maps_layer
        WHERE certification_certification.object_id = augmented_maps_layer.id) to stdout with csv;" | \
sudo -u $USER psql $NEW_DB -c \
    "copy certification_certification(certifier_id, object_ct_id, object_id) from stdin csv"

#############################################################################

echo "\nCopy attributes for layers"; do_dash

sudo -u $USER PGPASSWORD=$DB_PW \
psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $OLD_DB -c \
    "copy (SELECT maps_layerattribute.id,maps_layerattribute.layer_id, maps_layerattribute.attribute, maps_layerattribute.attribute_label, maps_layerattribute.attribute_type, maps_layerattribute.last_modified, maps_layerattribute.display_order, maps_layerattribute.visible, maps_layerattribute.in_gazetteer, maps_layerattribute.is_gaz_start_date,maps_layerattribute.is_gaz_end_date,maps_layerattribute.date_format,0,now() FROM maps_layerattribute,augmented_maps_layer WHERE augmented_maps_layer.id=maps_layerattribute.layer_id ) to stdout with csv;" | \
sudo -u $USER PGPASSWORD=$DB_PW \
psql $NEW_DB -c "copy layers_attribute(id,layer_id,attribute,attribute_label,attribute_type,last_modified,display_order,visible,in_gazetteer,is_gaz_start_date,is_gaz_end_date,date_format,count,last_stats_updated) from stdin csv"
