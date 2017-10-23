sudo -u $USER PGPASSWORD=$DB_PW \
psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $OLD_DB -c \
    "copy (SELECT id, title, abstract, delimiter, owner_id, table_name, tablespace, uploaded_file, create_table_sql, created, modified FROM datatables_datatable) to stdout with csv;" | \
sudo -u $USER PGPASSWORD=$DB_PW \
psql $NEW_DB -c "copy datatables_datatable(id, title, abstract, delimiter, owner_id, table_name, tablespace, uploaded_file, create_table_sql, created, modified) from stdin csv"


sudo -u $USER PGPASSWORD=$DB_PW \
psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $OLD_DB -c \
    "copy (SELECT id, datatable_id , attribute, attribute_label, attribute_type, searchable, visible, display_order, created, modified FROM datatables_datatableattribute) to stdout with csv;" | \
sudo -u $USER PGPASSWORD=$DB_PW \
psql $NEW_DB -c "copy datatables_datatableattribute(id, datatable_id , attribute, attribute_label, attribute_type, searchable, visible, display_order, created, modified) from stdin csv"

sudo -u $USER PGPASSWORD=$DB_PW \
psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $OLD_DB -c \
    "copy (SELECT id, name, description, sort_order, slug, created, modified FROM datatables_geocodetype) to stdout with csv;" | \
sudo -u $USER PGPASSWORD=$DB_PW \
psql $NEW_DB -c "copy datatables_geocodetype(id, name, description, sort_order, slug, created, modified) from stdin csv"


sudo -u $USER PGPASSWORD=$DB_PW \
psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $OLD_DB -c \
    "copy (SELECT datatables_jointarget.id, datatables_jointarget.name, datatables_jointarget.layer_id, datatables_jointarget.attribute_id, datatables_jointarget.geocode_type_id, datatables_jointarget.expected_format_id, datatables_jointarget.year, datatables_jointarget.created, datatables_jointarget.modified FROM datatables_jointarget,augmented_maps_layer,datatables_jointargetformattype WHERE augmented_maps_layer.id=datatables_jointarget.layer_id AND datatables_jointargetformattype.id=datatables_jointarget.expected_format_id  ) to stdout with csv;" | \
sudo -u $USER PGPASSWORD=$DB_PW \
psql $NEW_DB -c "copy datatables_jointarget(id, name, layer_id, attribute_id, geocode_type_id, expected_format_id, year, created, modified) from stdin csv"


sudo -u $USER PGPASSWORD=$DB_PW \
psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $OLD_DB -c \
    "copy (SELECT id, name, is_zero_padded, expected_zero_padded_length, description, regex_match_string, created, modified FROM datatables_jointargetformattype) to stdout with csv;" | \
sudo -u $USER PGPASSWORD=$DB_PW \
psql $NEW_DB -c "copy datatables_jointargetformattype(id, name, is_zero_padded, expected_zero_padded_length, description, regex_match_string, created, modified) from stdin csv"

sudo -u $USER PGPASSWORD=$DB_PW \
psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $OLD_DB -c \
    "copy (SELECT datatables_latlngtablemappingrecord.id, datatables_latlngtablemappingrecord.datatable_id, datatables_latlngtablemappingrecord.lat_attribute_id, datatables_latlngtablemappingrecord.lng_attribute_id, datatables_latlngtablemappingrecord.layer_id, datatables_latlngtablemappingrecord.mapped_record_count, datatables_latlngtablemappingrecord.unmapped_record_count, datatables_latlngtablemappingrecord.unmapped_records_list, datatables_latlngtablemappingrecord.created, datatables_latlngtablemappingrecord.modified FROM datatables_latlngtablemappingrecord,augmented_maps_layer where augmented_maps_layer.id=datatables_latlngtablemappingrecord.layer_id ) to stdout with csv;" | \
sudo -u $USER PGPASSWORD=$DB_PW \
psql $NEW_DB -c "copy datatables_latlngtablemappingrecord(id, datatable_id, lat_attribute_id, lng_attribute_id, layer_id, mapped_record_count, unmapped_record_count, unmapped_records_list, created, modified) from stdin csv"


sudo -u $USER PGPASSWORD=$DB_PW \
psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $OLD_DB -c \
    "copy (SELECT id, datatable_id, table_attribute_id, source_layer_id, layer_attribute_id, view_name, view_sql, join_layer_id,matched_records_count,unmatched_records_count,unmatched_records_list, created, modified FROM datatables_tablejoin) to stdout with csv;" | \
sudo -u $USER PGPASSWORD=$DB_PW \
psql $NEW_DB -c "copy datatables_tablejoin(id, datatable_id, table_attribute_id, source_layer_id, layer_attribute_id, view_name, view_sql, join_layer_id, matched_records_count, unmatched_records_count, unmatched_records_list, created, modified ) from stdin csv"


sudo -u $USER PGPASSWORD=$DB_PW \
psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $OLD_DB -c \
    "copy (SELECT  dataverse_layer_metadata_dataverselayermetadata.id, dataverse_layer_metadata_dataverselayermetadata.dv_user_id, dataverse_layer_metadata_dataverselayermetadata.dv_username, dataverse_layer_metadata_dataverselayermetadata.dv_user_email, dataverse_layer_metadata_dataverselayermetadata.return_to_dataverse_url, dataverse_layer_metadata_dataverselayermetadata.datafile_download_url,  dataverse_layer_metadata_dataverselayermetadata.dataverse_installation_name, dataverse_layer_metadata_dataverselayermetadata.dataverse_id, dataverse_layer_metadata_dataverselayermetadata.dataverse_name, dataverse_layer_metadata_dataverselayermetadata.dataverse_description, dataverse_layer_metadata_dataverselayermetadata.dataset_id, dataverse_layer_metadata_dataverselayermetadata.dataset_version_id, dataverse_layer_metadata_dataverselayermetadata.dataset_semantic_version, dataverse_layer_metadata_dataverselayermetadata.dataset_name, dataverse_layer_metadata_dataverselayermetadata.dataset_citation, dataverse_layer_metadata_dataverselayermetadata.dataset_description, dataverse_layer_metadata_dataverselayermetadata.dataset_is_public, dataverse_layer_metadata_dataverselayermetadata.datafile_id, dataverse_layer_metadata_dataverselayermetadata.datafile_label, dataverse_layer_metadata_dataverselayermetadata.datafile_expected_md5_checksum, dataverse_layer_metadata_dataverselayermetadata.datafile_filesize, dataverse_layer_metadata_dataverselayermetadata.datafile_content_type, dataverse_layer_metadata_dataverselayermetadata.datafile_create_datetime, dataverse_layer_metadata_dataverselayermetadata.created, dataverse_layer_metadata_dataverselayermetadata.modified, dataverse_layer_metadata_dataverselayermetadata.map_layer_id, dataverse_layer_metadata_dataverselayermetadata.datafile_is_restricted FROM dataverse_layer_metadata_dataverselayermetadata,augmented_maps_layer WHERE augmented_maps_layer.id=dataverse_layer_metadata_dataverselayermetadata.map_layer_id) to stdout with csv;" | \
sudo -u $USER PGPASSWORD=$DB_PW \
psql $NEW_DB -c "copy dataverse_layer_metadata_dataverselayermetadata(id, dv_user_id, dv_username, dv_user_email, return_to_dataverse_url, datafile_download_url,  dataverse_installation_name, dataverse_id, dataverse_name, dataverse_description, dataset_id, dataset_version_id, dataset_semantic_version, dataset_name, dataset_citation, dataset_description, dataset_is_public, datafile_id, datafile_label, datafile_expected_md5_checksum, datafile_filesize, datafile_content_type, datafile_create_datetime, created, modified, map_layer_id, datafile_is_restricted) from stdin csv"


sudo -u $USER PGPASSWORD=$DB_PW \
psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $OLD_DB -c \
    "copy (SELECT id, name, dataverse_username, worldmap_username, worldmap_user_id, is_active, description, created, modified   FROM dataverse_permission_links) to stdout with csv;" | \
sudo -u $USER PGPASSWORD=$DB_PW \
psql $NEW_DB -c "copy dataverse_permission_links(id, name, dataverse_username, worldmap_username, worldmap_user_id, is_active, description, created, modified ) from stdin csv"
