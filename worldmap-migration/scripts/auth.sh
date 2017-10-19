#############################################################################
# Migration for auth tables
#############################################################################

#############################################################################

echo "\npeople_profile_user_permissions table migration"; do_dash
sudo -u $USER PGPASSWORD=$DB_PW \
psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $OLD_DB -c \
	"copy (select id, user_id, permission_id FROM auth_user_user_permissions) to stdout with csv" | \
sudo -u $USER \
psql $NEW_DB -c "copy people_profile_user_permissions (id, profile_id, permission_id) from stdin csv"

#############################################################################

echo "\ndialogos_comment table migration"; do_dash
sudo -u $USER PGPASSWORD=$DB_PW \
psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $OLD_DB -c \
	"copy (select id, author_id, name, email, website, content_type_id, object_id, comment, submit_date, ip_address, public FROM dialogos_comment) to stdout with csv" | \
sudo -u $USER \
psql $NEW_DB -c "copy dialogos_comment (id, author_id, name, email, website, content_type_id, object_id, comment, submit_date, ip_address, public) from stdin csv"

#############################################################################

echo "\ndjango_site table migration"; do_dash
sudo -u $USER PGPASSWORD=$DB_PW psql -U $DB_USER -h $DB_HOST $NEW_DB -c \
	"UPDATE django_site SET domain = 'worldmap.harvard.edu', name = 'Harvard WorldMap' WHERE id = 1"
