from geoserver.catalog import Catalog
import xmltodict
import os
import shutil

def chunks(l, n):
    """Yield successive n-sized chunks from l."""
    for i in range(0, len(l), n):
        yield l[i:i + n]

def create_workspaces (catalog,len):
    template="wm_{0}"
    for i in range (len):
        print "Creating store wm_%d ...." % i
        work_name=template.format(i)
        uri_name='http://google.com/search?q={0}'.format(work_name)
        catalog.create_workspace(name=work_name,uri=uri_name)


cat = Catalog("http://localhost:8080/geoserver/rest/", "admin", "geoserver")
#Get Datastores
stores = cat.get_stores()
stores_chunks = list(chunks(stores,100))
create_workspaces = create_workspaces (cat, len(stores_chunks))

#path to original workspace
original_workspace = 'path_to_workspace_folder'
workspaces = ["wm_%d" % i for i in range (len(stores_chunks))]
i=0
for workspace in workspaces:
    print 'Current Workspace: %s' % workspace
    namespace_xml =open(os.path.join(original_workspace,workspace+'/namespace.xml'),'r').read()
    namespace_id = xmltodict.parse(namespace_xml)['namespace']['id']
    workspace_xml =open(os.path.join(original_workspace,workspace+'/workspace.xml'),'r').read()
    workspace_id = xmltodict.parse(workspace_xml)['workspace']['id']
    for store in stores_chunks[i]:
        print 'Current Store %s' % store.name
        print 'Process in current workspace: %f %' % (float((i+1.0)/len(stores_chunks[i]))*100.0)
        store_path = os.path.join(original_workspace,os.path.join('geonode',store.name))
        folders = [os.path.join(store_path,item) for item in os.listdir(store_path) if os.path.isdir(os.path.join(store_path,item))]
        if 'datastore.xml' in os.listdir(store_path):
            datastore_xml = open(os.path.join(store_path,'datastore.xml'),'r').read()
            dict_datastore= xmltodict.parse(datastore_xml)
            dict_datastore['dataStore']['workspace']['id'] = workspace_id
            datastore_xml = xmltodict.unparse(dict_datastore,pretty=True)
            datastore_xml = datastore_xml.replace('<?xml version="1.0" encoding="utf-8"?>\n','')
            xml = open(os.path.join(store_path,'datastore.xml'),'wb')
            xml.write(datastore_xml)
            xml.close()
        if 'coveragestore.xml' in os.listdir(store_path):
            coverage_xml = open(os.path.join(store_path,'coveragestore.xml'),'r').read()
            dict_coverage = xmltodict.parse(coverage_xml)
            dict_coverage['coverageStore']['workspace']['id'] = workspace_id
            coverage_xml = xmltodict.unparse(dict_coverage,pretty=True)
            coverage_xml = coverage_xml.replace('<?xml version="1.0" encoding="utf-8"?>\n','')
            xml = open(os.path.join(store_path,'coveragestore.xml'),'wb')
            xml.write(coverage_xml)
            xml.close()
        for folder in folders:
            if 'featuretype.xml' in os.listdir(folder):
                featuretype_xml = open(os.path.join(folder,'featuretype.xml'),'r').read()
                dict_feature = xmltodict.parse(featuretype_xml)
                dict_feature['featureType']['namespace']['id'] = namespace_id
                feature_xml = xmltodict.unparse(dict_feature,pretty=True)
                feature_xml = feature_xml.replace('<?xml version="1.0" encoding="utf-8"?>\n','')
                xml = open(os.path.join(folder,'featuretype.xml'),'wb')
                xml.write(feature_xml.encode('utf-8'))
                xml.close()
            if 'coverage.xml' in os.listdir(folder):
                cov_xml = open(os.path.join(folder,'coverage.xml'),'r').read()
                dict_cov = xmltodict.parse(cov_xml)
                dict_cov['coverage']['namespace']['id'] = namespace_id
	            cov_xml = xmltodict.unparse(dict_cov,pretty=True)
	            cov_xml = cov_xml.replace('<?xml version="1.0" encoding="utf-8"?>\n','')
                xml = open(os.path.join(folder,'coverage.xml'),'wb')
                xml.write(cov_xml.encode('utf-8'))
                xml.close()
        #Moving folder to new workspaces
        print 'Moving to new workspace.....'
        print 'Path %s' % os.path.join(original_workspace,os.path.join(workspace,store.name))
        shutil.move(store_path,os.path.join(original_workspace,os.path.join(workspace,store.name)))
    i+=1;
