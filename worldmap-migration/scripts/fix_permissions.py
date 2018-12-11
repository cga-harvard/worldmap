
# core_userobjectrolemapping
#    id   | user_id | object_ct_id | object_id | role_id
# --------+---------+--------------+-----------+---------
#    5754 |       1 |           20 |       526 |       3
#   38419 |      88 |           18 |      5983 |       6
#   34634 |       1 |           18 |      5323 |       6
#    3180 |       1 |           20 |       399 |       3
#    3304 |      16 |           20 |       403 |       3

# role_id
#  id |     title      |    codename     | content_type_id | list_order
# ----+----------------+-----------------+-----------------+------------
#   1 | Read Only      | map_readonly    |              20 |          0
#   2 | Read/Write     | map_readwrite   |              20 |          1
#   3 | Administrative | map_admin       |              20 |          2
#   4 | Read Only      | layer_readonly  |              18 |          0
#   5 | Read/Write     | layer_readwrite |              18 |          1
#   6 | Administrative | layer_admin     |              18 |          2

# groups

# select * from core_userobjectrolemapping where object_ct_id = 18 and object_id = 27290;
#    id   | user_id | object_ct_id | object_id | role_id
# --------+---------+--------------+-----------+---------
#  180906 |   10531 |           18 |     27290 |       6


import psycopg2

def get_src():
    conn = psycopg2.connect("dbname='worldmaplegacy' user='worldmap' port='5432' host='localhost' password='worldmap'")
    return conn

def get_dst():
    conn = psycopg2.connect("dbname='worldmapnew' user='worldmap' port='5432' host='localhost' password='worldmap'")
    return conn

def get_group_id_by_name(group_name):
    dst = get_dst()
    dst_cur = dst.cursor()
    dst_cur.execute("select id from auth_group where name = '%s';" % group_name)
    if dst_cur.rowcount == 0:
        return None
    return dst_cur.next()[0]

def get_layer_id_by_old_id(id):
    """Get an resource id by old id"""
    src = get_src()
    dst = get_dst()
    src_cur = src.cursor()
    src_cur.execute('SELECT uuid, name FROM maps_layer WHERE id = %s;' % id)
    if src_cur.rowcount == 0:
        return None
    src_row = src_cur.next()
    uuid = src_row[0]
    name = src_row[1]
    dst_cur = dst.cursor()
    dst_cur.execute("SELECT id FROM base_resourcebase WHERE uuid = '%s';" % uuid)
    if dst_cur.rowcount == 0:
        return None
    new_id = dst_cur.next()[0]
    print 'Layer %s (%s) is now %s' % (id, name, new_id)
    return new_id

def get_map_id_by_old_id(id):
    """Get an resource id by old id"""
    src = get_src()
    dst = get_dst()
    src_cur = src.cursor()
    src_cur.execute('SELECT title, abstract, owner_id FROM maps_map WHERE id = %s;' % id)
    if src_cur.rowcount == 0:
        return None
    src_row = src_cur.next()
    title = src_row[0]
    abstract = src_row[1]
    old_owner_id = src_row[2]
    owner_id = get_userid_by_old_profile_id(old_owner_id)
    dst_cur = dst.cursor()
    dst_cur.execute("SELECT id FROM base_resourcebase WHERE title = '%s' and abstract = '%s' and owner_id = '%s';"
                    % (title.replace("'", "''"), abstract.replace("'", "''"), owner_id))
    if dst_cur.rowcount == 0:
        return None
    new_id = dst_cur.next()[0]
    print 'Map %s (%s) is now %s' % (id, title, new_id)
    return new_id

def get_userid_by_old_profile_id(id):
    """Get an username id by old profile id"""
    src = get_src()
    dst = get_dst()
    src_cur = src.cursor()

    src_cur.execute('SELECT username FROM auth_user WHERE id = %s;' % id)
    username = src_cur.next()[0]
    dst_cur = dst.cursor()
    dst_cur.execute("SELECT id FROM people_profile WHERE username = '%s';" % username)
    new_id = dst_cur.next()[0]
    print 'Id for user %s is now %s' % (username, new_id)
    return new_id

def get_content_type_dict():
    """Get content_type_id by old id"""
    dst = get_dst()
    dst_cur = dst.cursor()
    dst_cur.execute("SELECT id, app_label, model FROM django_content_type")
    ctype_dicts = {}
    for row in dst_cur.fetchall():
        if row[1] == 'base' and row[2] == 'resourcebase':
            ctype_dicts['resourcebase'] = row[0]
        if row[1] == 'maps' and row[2] == 'map':
            ctype_dicts['map'] = row[0]
        if row[1] == 'layers' and row[2] == 'layer':
            ctype_dicts['layer'] = row[0]
    print ctype_dicts
    return ctype_dicts

def get_permissions_dict():
    """Dict to get auth permission id from code name"""
    dst = get_dst()
    dst_cur = dst.cursor()
    dst_cur.execute("SELECT codename, id FROM auth_permission;")
    permissions_dict = {}
    for row in dst_cur.fetchall():
        permissions_dict[row[0]] = row[1]
    return permissions_dict

def get_guardian_perms(role_id, obj_type):
    guardian_perms = []
    if role_id in (1, 4): # read only
        guardian_perms = [
            'view_resourcebase',
            'download_resourcebase',
        ]
    if role_id in (2, 5): # read write
        guardian_perms = [
            'view_resourcebase',
            'download_resourcebase',
            'change_resourcebase_metadata',
        ]
        if obj_type == 'layer':
            guardian_perms += ['change_layer_data', 'change_layer_style', ]
    if role_id in (3, 6): # administrative
        guardian_perms += [
            'view_resourcebase',
            'download_resourcebase',
            'change_resourcebase_metadata',
            'change_resourcebase',
            'delete_resourcebase',
            'change_resourcebase_permissions',
            'publish_resourcebase',
        ]
        if obj_type == 'layer':
            guardian_perms += ['change_layer_data', 'change_layer_style', ]
    print guardian_perms
    return guardian_perms

def set_user_perms_for_object(old_object_id, object_id, obj_type='layer'):
    old_object_ct_id = 18
    if obj_type == 'map':
        old_object_ct_id = 20
    src = get_src()
    sql = 'select user_id, role_id from core_userobjectrolemapping where object_ct_id = %s and object_id = %s;' % (old_object_ct_id, old_object_id)
    src_cur = src.cursor()
    src_cur.execute(sql)
    for src_row in src_cur:
        print src_row
        user_id = get_userid_by_old_profile_id(src_row[0])
        role_id = src_row[1]
        guardian_perms = get_guardian_perms(role_id, obj_type)
        for perm in guardian_perms:
            print 'Inserting permission %s for user %s for content %s' % (perm, user_id, object_id)
            perm_id = permissions[perm]
            if perm in ('change_layer_data', 'change_layer_style'):
                content_type_id = ctype_dict['layer']
            else:
                content_type_id = ctype_dict['resourcebase']
            try:
                sql_insert = "INSERT INTO guardian_userobjectpermission (permission_id, content_type_id, object_pk, user_id) VALUES (%s, %s, '%s', %s)" % (perm_id, content_type_id, object_id, user_id)
                dst_cur.execute(sql_insert)
                dst.commit()
            except Exception as error:
                print
                print type(error)
                dst.rollback()

def set_group_perms_for_object(old_object_id, object_id, obj_type='layer'):
    old_object_ct_id = 18
    if obj_type == 'map':
        old_object_ct_id = 20
    src = get_src()
    sql = 'select subject, role_id from core_genericobjectrolemapping where object_ct_id = %s and object_id = %s;' % (old_object_ct_id, old_object_id)
    src_cur = src.cursor()
    src_cur.execute(sql)
    for src_row in src_cur:
        print src_row
        group_name = src_row[0]
        role_id = src_row[1]
        try:
            if group_name == 'anonymous':
                guardian_perms = [
                    'view_resourcebase',
                    'download_resourcebase',
                ]
                for perm in guardian_perms:
                    perm_id = permissions[perm]
                    print 'Inserting permission %s for user anonymous for content %s' % (perm, object_id)
                    content_type_id = ctype_dict['resourcebase']
                    sql_insert = "INSERT INTO guardian_userobjectpermission (permission_id, content_type_id, object_pk, user_id) VALUES (%s, %s, '%s', %s)" % (perm_id, content_type_id, object_id, -1)
                    dst_cur.execute(sql_insert)
                    print 'Inserting permission %s for group anonymous for content %s' % (perm, object_id)
                    sql_insert = "INSERT INTO guardian_groupobjectpermission (permission_id, content_type_id, object_pk, group_id) VALUES (%s, %s, '%s', %s)" % (perm_id, content_type_id, object_id, anonymous_group_id)
                    dst_cur.execute(sql_insert)
                    dst.commit()
            if group_name in ('customgroup', 'authenticated'):
                if group_name == 'customgroup':
                    group_id = 5
                else:
                    group_id = 4
                guardian_perms = get_guardian_perms(role_id, obj_type)
                for perm in guardian_perms:
                    print 'Inserting permission %s for group %s for content %s' % (perm, group_id, object_id)
                    perm_id = permissions[perm]
                    if perm in ('change_layer_data', 'change_layer_style'):
                        content_type_id = ctype_dict['layer']
                    else:
                        content_type_id = ctype_dict['resourcebase']
                    sql_insert = "INSERT INTO guardian_groupobjectpermission (permission_id, content_type_id, object_pk, group_id) VALUES (%s, %s, '%s', %s)" % (perm_id, content_type_id, object_id, group_id)
                    dst_cur.execute(sql_insert)
                    dst.commit()
        except Exception as error:
            print
            print type(error)
            dst.rollback()



layer_error_ids = []
map_error_ids = []

def set_perms_for_object(old_object_id, old_object_ct_id):
    object_id = None
    obj_type = None
    if old_object_ct_id == 18:
        obj_type = 'layer'
        object_id = get_layer_id_by_old_id(old_object_id)
    if old_object_ct_id == 20:
        # TODO
        obj_type = 'map'
        object_id = get_map_id_by_old_id(old_object_id)
    if object_id == None:
        if obj_type == 'layer':
            layer_error_ids.append(old_object_id)
        if obj_type == 'map':
            map_error_ids.append(old_object_id)
    else:
        set_user_perms_for_object(old_object_id, object_id, obj_type)
        set_group_perms_for_object(old_object_id, object_id, obj_type)
    print layer_error_ids
    print map_error_ids

ctype_dict = get_content_type_dict()
permissions = get_permissions_dict()

dst = get_dst()
src = get_src()
dst_cur = dst.cursor()
dst_cur.execute('TRUNCATE TABLE guardian_userobjectpermission;')
dst_cur.execute('TRUNCATE TABLE guardian_groupobjectpermission;')
# http://localhost:8000/layers/geonode:informalurbanisation_okd
# geonode:informalurbanisation_okd, 6921
# geonode:ukr_hotspots_7jf, 27290
# 18 layer, 20 map (OLD)
# 47 resource base, 50 layer, 54 map (local)
# 43 resource base, 52 layer, 57 map (staging)
# 6921 is new

# maps to check:
#
#     http://worldmap.harvard.edu/maps/6442/info/
#     http://worldmap.harvard.edu/maps/976/info/
#     http://worldmap.harvard.edu/maps/121/info/
#
# layers to check:
#     http://worldmap.harvard.edu/data/layers/geonode:ukr_hotspots_7jf
#     http://worldmap.harvard.edu//data/geonode:informalurbanisation_okd    (6921)
#     http://worldmap.harvard.edu/data/geonode:etnicity_felix   (10819)
#     http://worldmap.harvard.edu/data/geonode:testpolygons_vxf
#     http://worldmap.harvard.edu/data/geonode:PARK_hst (1700)
#     http://worldmap.harvard.edu/data/geonode:limite_parroquial_hxt

# how to translate core_genericobjectrolemapping
# subject=anonymous --> -1 can view and download
# subject=customgroup, role_id=1,4 --> registered_users can view and download
# subject=authenticated, role_id=1,4 --> registered_users can view and download
# subject=customgroup, role_id=2,5 --> harvard_users can edit
# subject=authenticated, role_id=2,5 --> registered_users can edit

# Registered group = 4
# Harvard group = 5

#set_perms_for_object(1700, 18)

# ********************
# MAIN COMMAND
src_cur = src.cursor()

anonymous_group_id = get_group_id_by_name('anonymous')

src_cur.execute('select id from maps_layer;')
count = 0
for src_row in src_cur:
    print '****** Layer %s' % count
    set_perms_for_object(src_row[0], 18)
    count += 1

src_cur.execute('select id from maps_map;')
count = 0
for src_row in src_cur:
    print '****** Map %s' % count
    set_perms_for_object(src_row[0], 20)
    count += 1

src.close()
dst.close()

print layer_error_ids
print map_error_ids

# ********************
