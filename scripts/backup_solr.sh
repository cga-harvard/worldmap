cd /data/backup/solr
rm *.tar.gz
solr_data_dir=/opt/solr/solr-6.5.1/server/solr/hypermap
today=$(date +"%Y%m%d")
tar -zcvf $today.tar.gz $solr_data_dir
s3cmd put $today.tar.gz s3://wm-solr-backup
