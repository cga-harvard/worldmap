#!/bin/bash
STYLES_FOLDER=styles
GEOSERVER_URL=54.186.220.207
OIFS="$IFS"
IFS=$'\n'
for XML_FILE in `find $STYLES_FOLDER -type f -name "*.xml"`
do
    LAYER_NAME="$(cat $XML_FILE | grep '<name>' | sed 's/  <name>\(.*\)<\/name>/\1/g')"
    echo "Processing layer $LAYER_NAME"

    ID="$(cat $XML_FILE | grep '<id>' | sed 's/  <id>\(.*\)<\/id>/\1/g')"
    VERSION="$(cat $XML_FILE | grep '<version>' | \
        sed 's/    <version>\(.*\)<\/version>/\1/g')"

    FILENAME="$(cat $XML_FILE | grep '<filename>' | \
        sed 's/  <filename>\(.*\)<\/filename>/\1/g')"
    SLD_BODY=""
    if [ -f $STYLES_FOLDER/$FILENAME ]; then
        SLD_BODY=$(cat $STYLES_FOLDER/$FILENAME | sed 's/\"/\"\"/g')
    fi
    SLD_URL="http://$GEOSERVER_URL:8080/geoserver/rest/styles/$FILENAME"

    echo -e $LAYER_NAME,,"\""$SLD_BODY"\"","'"$VERSION"'",$SLD_URL,"\r" >> styles.csv
done
IFS="$OIFS"
