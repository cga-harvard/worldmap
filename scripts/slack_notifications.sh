#!/bin/sh
/usr/bin/curl \
    -X POST \
    -s \
    --data-urlencode "payload={ \
        \"channel\": \"#worldmap-log\", \
        \"username\": \"Monit\", \
        \"pretext\": \"WM on MOC | $MONIT_DATE\", \
        \"color\": \"danger\", \
        \"icon_emoji\": \":ghost:\", \
        \"text\": \"$MONIT_SERVICE - $MONIT_DESCRIPTION - $1\" \
    }" \
    https://hooks.slack.com/services/xxxxx/yyyyy/zzzzz
