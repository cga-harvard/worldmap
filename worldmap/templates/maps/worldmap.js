{% load i18n %}

<script type="text/javascript" src="https://code.jquery.com/jquery-2.1.4.min.js"></script>

<link rel="stylesheet" type="text/css" href="{{ GEONODE_CLIENT_LOCATION }}externals/ext/resources/css/ext-all.css" />
<script type="text/javascript" src="{{ GEONODE_CLIENT_LOCATION }}externals/ext/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="{{ GEONODE_CLIENT_LOCATION }}externals/ext/ext-all.js"></script>

<script type="text/javascript">
  Ext.Ajax.defaultHeaders = { 'X-CSRFToken': '{{ csrf_token|escapejs }}' };
  Ext.BLANK_IMAGE_URL = "{{ GEONODE_CLIENT_LOCATION }}externals/ext/resources/images/default/s.gif";
</script>

<script src="{{ GEONODE_CLIENT_LOCATION }}script/ux.js"></script>
<script src="{{ GEONODE_CLIENT_LOCATION }}script/GeoNode.js"></script>

<link rel="stylesheet" type="text/css" href="{{ GEONODE_CLIENT_LOCATION }}externals/openlayers/theme/default/style.css" />
<script src="{{ GEONODE_CLIENT_LOCATION }}script/OpenLayers.js"></script>
<link rel="stylesheet" type="text/css" href="{{ GEONODE_CLIENT_LOCATION }}externals/geoext/resources/css/geoext-all.css" />
<script src="{{ GEONODE_CLIENT_LOCATION }}script/GeoExt.js"></script>
<link rel="stylesheet" href="{{ GEONODE_CLIENT_LOCATION }}externals/gxp/theme/all.css" />
<script src="{{ GEONODE_CLIENT_LOCATION }}script/gxp.js"></script>
<!--
<link rel="stylesheet" href="{{ GEONODE_CLIENT_LOCATION }}externals/ext/resources/css/xtheme-white.css" />
<link rel="stylesheet" type="text/css" href="{{ GEONODE_CLIENT_LOCATION }}theme/app/geoexplorer_white.css" />
-->
<!--[if IE]><link rel="stylesheet" type="text/css" href="{{ GEONODE_CLIENT_LOCATION }}theme/app/ie.css"/><![endif]-->
<script src="{{ GEONODE_CLIENT_LOCATION }}script/GeoExplorer.js"></script>
<script type="text/javascript">
OpenLayers.ImgPath = "{{ GEONODE_CLIENT_LOCATION }}externals/openlayers/img/";
var nicEditIconsPath = "{{ GEONODE_CLIENT_LOCATION }}externals/misc/images/nicEditorIcons.gif"

gxp.plugins.Styler.prototype.enableActionIfAvailable  = function(url) {
    Ext.Ajax.request({
        method: "POST",
        url:"{{ STATIC_URL }}/data/" + this.target.selectedLayer.getLayer().params.LAYERS + "/ajax-edit-check",
        callback: function(options, success, response) {
            this.launchAction.setDisabled(response.status !== 200);
        },
        scope: this
    });
};


gxp.WMSStylesDialog.prototype.createGeoServerStylerConfig = function (layerRecord, url) {
    var layer = layerRecord.getLayer();
    if (!url) {
        url = layerRecord.get("restUrl");
    }
    if (!url) {
        url = layer.url.split("?").shift().replace(/\/(wms|ows)\/?$/, "/rest");
    }
    return {
        xtype:"gxp_wmsstylesdialog",
        layerRecord:layerRecord,
        classifyEnabled: true,
        plugins:[
            {
                ptype:"gxp_geoserverstylewriter",
                baseUrl:url
            }
        ],
        listeners:{
            "styleselected":function (cmp, style) {
                layer.mergeNewParams({
                    styles:style
                });
            },
            "modified":function (cmp, style) {
                cmp.saveStyles();
            },
            "saved":function (cmp, style) {
                layer.mergeNewParams({
                    _olSalt:Math.random(),
                    styles:style
                });
            },
            scope:this
        }
    };
}

gxp.WMSLayerPanel.prototype.createStylesPanel = function(url) {
    var config = gxp.WMSStylesDialog.createGeoServerStylerConfig(
            this.layerRecord, url
    );
    if (this.rasterStyling === true) {
        config.plugins.push({
            ptype: "gxp_wmsrasterstylesdialog"
        });
    }
    var ownerCt = this.ownerCt;
    if (!(ownerCt.ownerCt instanceof Ext.Window)) {
        config.dialogCls = Ext.Panel;
        config.showDlg = function(dlg) {
            dlg.layout = "fit";
            dlg.autoHeight = false;
            ownerCt.add(dlg);
        };
    }
    return Ext.apply(config, {
        title: this.stylesText,
        style: "padding: 10px",
        editable: false,
        listeners: Ext.apply(config.listeners, {
            "beforerender": {
                fn: function(cmp) {
                    var render = !this.editableStyles;
                    if (!render) {
                            Ext.Ajax.request({
                                method: "PUT",
                                url:"{{ STATIC_URL }}/data/" + this.layerRecord.getLayer().params.LAYERS + "/ajax-edit-check",
                                callback: function(options, success, response) {
                                    // we expect a 405 error code here if we are dealing with
                                    // GeoServer and have write access. Otherwise we will
                                    // create the panel in readonly mode.
                                    cmp.editable = (response.status == 200);
                                    cmp.ownerCt.doLayout();
                                }
                            });
                    }
                    return render;
                },
                scope: this,
                single: true
            }
        })
    });
};



</script>

<script type="text/javascript" src="{{ GEONODE_CLIENT_LOCATION }}externals/misc/nicEdit.js"></script>
{% if "gme-" in GOOGLE_API_KEY %}
    <script src="https://www.google.com/jsapi?client={{GOOGLE_API_KEY}}"></script>
{% else %}
    <script src="https://www.google.com/jsapi?key={{GOOGLE_API_KEY}}"></script>
{% endif %}


<link rel="stylesheet" type="text/css" href="{{ GEONODE_CLIENT_LOCATION }}theme/ux/colorpicker/color-picker.ux.css" />
<link rel="stylesheet" type="text/css" href="{{ GEONODE_CLIENT_LOCATION }}theme/ux/spinner/Spinner.css" />
<style type="text/css">
    #templates { display: none; }
</style>

<script type="text/javascript">
    var originalConfigureLayerNode =  GeoExt.WMSLegend.prototype.getLegendUrl;
    GeoExt.WMSLegend.prototype.getLegendUrl = function(layerName,layerNames) {
        var rec = this.layerRecord;
        var layer = rec.getLayer();
        if (OpenLayers.Layer.WMS && layer instanceof OpenLayers.Layer.WMS && layer.getVisibility() === false) {
            return "";
        } else {
            return originalConfigureLayerNode.apply(this, arguments);
        }
    };


var app;
var init = function() {
{% autoescape off %}

    var config = Ext.apply({
        tools:  [{
            ptype: "gxp_geonodequerytool",
            id: "worldmap_query_tool",
            actionTarget:  {target: "paneltbar", index: 2},
            toolText: '<span class="x-btn-text">{% trans 'Identify' %}</span>',
            iconCls: null,
            outputConfig: {width: 400, height: 200, panIn: false},
            featurePanel: 'queryPanel',
            attributePanel: 'gridWinPanel',
            toggleGroup: 'featureGroup'
        },
            {
                ptype: "gxp_coordinatetool",
                title: "<span class='x-btn-text'>{% trans 'Map Coordinates - longitude, latitude' %}</span>",
                actionTarget:  {target: "paneltbar"}
            },
            {
                ptype: "gxp_printpage",
                openInNewWindow: true,
                includeLegend: true,
                text: '<span class="x-btn-text">{% trans 'Print' %}</span>',
                iconCls: null,
                actionTarget: {target: "paneltbar", index: 4}
            },
            {
                ptype: "gxp_annotation",
                user: "{{ user.id }}",
                toggleGroup: 'featureGroup',
                actionTarget:  {target: "paneltbar", index: 6}
            },
            {
                ptype: "gxp_googleearth",
                text: '<span class="x-btn-text">{% trans 'Google Earth' %}</span>',
                iconCls: null,
                actionTarget: {target: "paneltbar", index: 7}
            },
            {
            	ptype: "gxp_streetviewtool",
            	actionTarget:   {target: "paneltbar", index: 8},
                toggleGroup: 'featureGroup'
            },
            {
            	  ptype: "gxp_measure",
                toggleGroup: 'featureGroup',
                text: '<span class="x-btn-text">{% trans 'Measure' %}</span>',
                iconCls: null,
            	  actionTarget:   {target: "paneltbar", index: 9}
            },
            {
            	ptype: 'gxp_mapshare',
            	target: this,
            	text: '<span class="x-btn-text">{% trans 'Share Map' %}</span>',
            	iconCls: null,
                actionTarget:  {target: "paneltbar", index: 24}
            }{% if USE_GAZETTEER %},
            {
                ptype: "gxp_gazetteertool",
                actionTarget:  {target: "paneltbar", index: 5},
                title: '<span class="x-btn-text">{% trans 'Find Place' %}</span>',
                iconCls: null,
                toggleGroup: 'featureGroup',
                pressed: false
            }{% endif %}
            {% if user.is_authenticated and DB_DATASTORE  %},
            {
                ptype: "gxp_featuremanager",
                id: "feature_manager",
                paging: false,
                autoSetLayer: true,
                autoLoadFeatures: true,
                listeners: {
                    'layerchange': function(mgr, layer, schema) {
                        app.checkLayerPermissions(layer);
                    }
                },
                actionTarget:  {target: "paneltbar"},
                toggleGroup: 'featureGroup'
            },
            {
                ptype: "gxp_featureeditor",
                id: "gn_layer_editor",
                featureManager: "feature_manager",
                autoLoadFeature: true,
                iconClsAdd: null,
                iconClsEdit: null,
                createFeatureActionText: '<span class="x-btn-text" >{% trans 'Create Feature' %}</span>',
                editFeatureActionText: '<span class="x-btn-text">{% trans 'Edit Feature' %}</span>',
                actionTarget:  {target: "paneltbar", index: 2},
                toggleGroup: 'featureGroup'
            }{% endif %}
            {% if editmap %},
            {
            	ptype: "gxp_maprevisiontool",
            	actionTarget:   {target: "paneltbar", index: 20}
            }{% endif %}
            ],
            proxy: "{{ PROXY_URL }}",

        /* The URL to a REST map configuration service.  This service
         * provides listing and, with an authenticated user, saving of
         * maps on the server for sharing and editing.
         */
        rest: "{% url "maps_browse" %}",
        homeUrl: "{% url "home" %}",
        localGeoServerBaseUrl: "{{ GEOSERVER_BASE_URL }}",
        localCSWBaseUrl: "{{ CATALOGUE_BASE_URL }}",
        csrfToken: "{{ csrf_token }}",
        {% if user.is_authenticated %}
        db_datastore: true,
        {% endif %}
        authorizedRoles: "{{ user.is_authenticated|yesno:"ROLE_ADMINISTRATOR,ROLE_ANONYMOUS" }}"
    }, {{ config }});

    app = new GeoExplorer(config, true);

    var permalinkTemplate = new Ext.Template("{protocol}//{host}/maps/{id}/edit");
    var permalink = function(id) {
        return permalinkTemplate.apply({
            protocol: window.location.protocol,
            host: window.location.host,
            id: id
        })
    };


    var titleTemplate = new Ext.Template("<span>{title}</span>");
    Ext.DomHelper.overwrite(Ext.get("page-breadcrumb"), titleTemplate.apply({title: (config.about.title ? config.about.title : gettext('New Map'))}));

    app.on("saved", function(id) {
        //reset title header
        Ext.DomHelper.overwrite(Ext.get("page-breadcrumb"), titleTemplate.apply({title: (config.about.title ? config.about.title : gettext('New Map'))}));




    }, this);


    {% endautoescape %}
    }

    window.onload = init;

</script>
