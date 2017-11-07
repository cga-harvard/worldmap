#############################################################################
# Migration for users table
#############################################################################

sudo -u $USER PGPASSWORD=$DB_PW \
psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $OLD_DB -c \
    "COPY(SELECT DISTINCT auth_user.id,
        auth_user.password,
        auth_user.last_login,
        auth_user.is_superuser,
        auth_user.username,
        auth_user.first_name,
        auth_user.last_name,
        auth_user.email,
        auth_user.is_staff,
        auth_user.is_active,
        auth_user.date_joined,
        maps_contact.organization,
        maps_contact.position,
        maps_contact.voice,
        maps_contact.fax,
        maps_contact.delivery,
        maps_contact.city,
        maps_contact.area,
        maps_contact.zipcode,
        maps_contact.country
        FROM auth_user, maps_contact
    WHERE maps_contact.user_id = auth_user.id) to stdout with csv" | \
sudo -u $USER psql $NEW_DB -c \
    "COPY people_profile (id,
        password,
        last_login,
        is_superuser,
        username,
        first_name,
        last_name,
        email, 
        is_staff,
        is_active,
        date_joined,
        organization,
        position,
        voice,
        fax,
        delivery,
        city,
        area,
        zipcode,
        country)
    FROM STDIN CSV"

#############################################################################

echo "\nReset user sequence"; do_dash
sudo -u $USER psql $NEW_DB -c \
    "SELECT setval(pg_get_serial_sequence('people_profile', 'id'),
        coalesce(max(id),0) + 1, false)
    FROM people_profile;"
#############################################################################
echo "\nAuth_group table migration"; do_dash
sudo -u $USER PGPASSWORD=$DB_PW psql -U $DB_USER -h $DB_HOST $NEW_DB -c "UPDATE auth_group SET name = 'beta-users' WHERE id=1; UPDATE auth_group SET name = 'dataverse' WHERE id=2; INSERT INTO auth_group (name,id) VALUES ('anonymous','3');"

sudo -u $USER PGPASSWORD=$DB_PW \
    psql -U $USER $NEW_DB -c "INSERT INTO auth_group (name,id) VALUES ('Registered users','4');"


#############################################################################
do_hr
echo "Migration for registered users"
do_hr
#############################################################################
sudo -u $USER PGPASSWORD=$DB_PW \
    psql -U $USER $NEW_DB -c "UPDATE auth_group SET id=4 WHERE name='Registered users';"

REGISTER_GP=$(sudo -u $USER  PGPASSWORD=$DB_PW  psql $NEW_DB -c \
    "COPY (
        SELECT id FROM auth_group where name='Registered users')
    TO STDOUT WITH CSV")

sudo -u $USER PGPASSWORD=$DB_PW  \
psql $NEW_DB -c "copy(select id,$REGISTER_GP from people_profile where id >-1) to stdout with csv;" | \
sudo -u $USER PGPASSWORD=$DB_PW  \
psql  $NEW_DB -c "copy people_profile_groups(profile_id,group_id) from stdin csv;"

#############################################################################
do_hr
echo "Migration for people groups"
do_hr
#############################################################################
sudo -u $USER PGPASSWORD=$DB_PW psql -U $DB_USER -h $DB_HOST $OLD_DB -c \
        "copy(
                SELECT user_id, group_id FROM auth_user_groups 
        ) to stdout with csv;" | \
sudo -u $USER PGPASSWORD=$DB_PW  psql $NEW_DB -c \
        "copy people_profile_groups(profile_id, group_id)
                FROM STDIN CSV;
        "
#############################################################################
do_hr
echo "Migration for Harvard group"
do_hr
#############################################################################

sudo -u $USER PGPASSWORD=$DB_PW \
    psql -U $USER $NEW_DB -c "INSERT INTO auth_group(name,id) values('Harvard','5');"

GROUP_ID=$(sudo -u $USER psql $NEW_DB -c \
    "COPY (
        SELECT id FROM auth_group where name='Harvard')
    TO STDOUT WITH CSV")
sudo -u $USER PGPASSWORD=$DB_PW  \
    psql -v ON_ERROR_STOP=1 -U $DB_USER -h $DB_HOST $OLD_DB -c \
        "copy(SELECT user_id,$GROUP_ID FROM maps_contact WHERE is_harvard=true) to stdout with csv;" | \
sudo -u $USER PGPASSWORD=$DB_PW  \
psql $NEW_DB -c "copy people_profile_groups(profile_id,group_id) from stdin csv;" 
