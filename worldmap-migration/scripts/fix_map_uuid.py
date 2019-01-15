import psycopg2
import uuid


conn = psycopg2.connect("dbname='worldmapnew' user='worldmap' port='5432' host='localhost' password='worldmap'")
src_cur = conn.cursor()
dst_cur = conn.cursor()
src_cur.execute('select id from base_resourcebase where id in (select resourcebase_ptr_id from maps_map);')
for src_row in src_cur:
    id = src_row[0]
    uuid4 = str(uuid.uuid4())
    print 'Setting uuid for map id %s to %s' % (id, uuid4)
    dst_cur.execute("update base_resourcebase set uuid = '%s' where id = %s" % (uuid4, id))
conn.commit()
