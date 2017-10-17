#############################################################################
# Migration for styles tables
#############################################################################


echo "\nSaving layers style from geoserver database dump"; do_dash
sudo -u $USER PGPASSWORD=$DB_PW \
psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $NEW_DB -c \
	"copy layers_style (name, sld_title, sld_body, sld_version, sld_url, workspace)
	from '$STYLES_PATH' WITH DELIMITER ',' CSV"

#############################################################################

echo "\nStoring layer style into layers_layer_styles"; do_dash
for layer in `sudo -u $USER PGPASSWORD=$DB_PW psql $NEW_DB -c 'copy(select name from layers_style) to stdout csv'`; do
    sudo -u $USER PGPASSWORD=$DB_PW \
    psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $NEW_DB -c \
        "INSERT INTO layers_layer_styles (layer_id, style_id)
         SELECT layers_layer.resourcebase_ptr_id as layer_id, layers_style.id as style_id
         FROM layers_style, layers_layer WHERE layers_layer.typename='geonode:$layer'
         AND layers_style.name='$layer'"
done

echo "Done"