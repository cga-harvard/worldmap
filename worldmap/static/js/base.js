window.onload=function(){
	 setImgHeight();//set the height according to the width, the rate is 4:3[noData.jpg]
}
//be activated when browser's size is changed
window.onresize=function(){
	 setImgHeight();//set the height according to the width, the rate is 4:3[noData.jpg]
}
//set the selectchange event of category selectpicker
function selectOnChange1(obj){
	var value = obj.options[obj.selectedIndex].value;
	showMaps("tmi1","hottest",value);
}
function selectOnChange2(obj){
	var value = obj.options[obj.selectedIndex].value;
	showMaps("tmi2","latest", value);
}
function showCategorys(language){
	var url = "/getCategory/";
	var data = null;
	var csrftoken = getCookie('csrftoken');
	$.ajax({
		url: url,
		async: false,
		cache: false,
		type: "POST",
        data: {
            language: language
        },
		success: function (res) {
			data = $.parseJSON(res);
		},
		beforeSend: function(xhr, settings) {
		  xhr.setRequestHeader("X-CSRFToken", csrftoken);
		}
	});
	var selectHTML = "";
	for(category in data){
		var categoryid = parseInt(category);
		var categorydescription = data[category][0];
		selectHTML += "<option value="+categoryid+">"+categorydescription+"</option>"
	}
	$("#category1").append(selectHTML);
	$("#category2").append(selectHTML);
    $("#category1").selectpicker('refresh');
    $("#category2").selectpicker('refresh');
}
function showMaps(divIdPrefix, type, category){
	var result = null;
	var url = "/getMostMaps/";
	var csrftoken = getCookie('csrftoken');
	$.ajax({
		url: url,
		async: false,
		type: "POST",
		data: {
			category: category,
			type: type
		},
		success: function (res) {
			result = $.parseJSON(res);
		},
		beforeSend: function(xhr, settings) {
		  xhr.setRequestHeader("X-CSRFToken", csrftoken);
		}
	});
	for(var i = 0; i< 6; i++)
	{
		var mapname, curdiv, imgurl, mapurl, img;
		if(result[i] != null)
		{
			mapname = result[i][0];
			curdiv = divIdPrefix + (i+1);
			imgurl = result[i][1];
			mapurl = result[i][2];
			img = $("#"+curdiv).find("img");
			$("#"+curdiv).attr("onclick","location='"+mapurl+"'");
			$("#"+curdiv).children("p").text(mapname);
			
            if(type=="admin"){
                if (mapname=="李白行迹图") {
                    imgurl =window.location.href+"uploaded/admingif/libai.gif"
                }else if (mapname=="杜甫行迹图") {
                    imgurl =window.location.href+"uploaded/admingif/dufu.gif"
                }else if (mapname=="汤显祖行迹图") {
                    imgurl =window.location.href+"uploaded/admingif/tangxianzu.gif"                  
                }else if (mapname=="全宋文专题") {
                    imgurl =window.location.href+"uploaded/admingif/quansongwen.gif"                 
                }else if (mapname=="清代妇女作家专题图") {
                    imgurl =window.location.href+"uploaded/admingif/qingdaifunv.gif"                   
                }
            }

            img.attr("src",imgurl);
		}
		else
		{
			curdiv = divIdPrefix + (i+1);
			img = $("#"+curdiv).find("img");
			if(typeof($("#"+curdiv).attr("onclick"))!="undefined")
			{
				$("#"+curdiv).removeAttr("onclick");
				$("#"+curdiv).children("p").text("");
				img.attr("src","{{ STATIC_URL }}img/map/noData.jpg");
			}
		}
	}
}
// get cookie value from cookies
function getCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}
function setImgHeight() {
	var imgs = $(".picItem");
	imgs.each(function (i) {
		var img = $(this);
		var width = img.width();
		var height = width* 0.75;
		img.height(height);
	});
    var imgs = $(".item");
    imgs.each(function (i) {
        var img = $(this);
        var width = img.width();
        var height = width* 0.75;
        img.height(height);
    });
}
    // <script type="text/javascript" src="{{ GEONODE_CLIENT_LOCATION }}externals/ext/adapter/ext/ext-base.js"></script>
    // <script type="text/javascript" src="{{ GEONODE_CLIENT_LOCATION }}externals/ext/ext-all.js"></script>
    // <script type="text/javascript" src="{{ GEONODE_CLIENT_LOCATION }}script/ux.js"></script>
    // <script type="text/javascript" src="{{ GEONODE_CLIENT_LOCATION }}script/GeoNode.js"></script>
    // <script type="text/javascript" src="{{ GEONODE_CLIENT_LOCATION }}script/OpenLayers.js"></script>
    // <script type="text/javascript" src="{{ GEONODE_CLIENT_LOCATION }}script/GeoExt.js"></script>
    // <script type="text/javascript" src="{{ GEONODE_CLIENT_LOCATION }}script/gxp.js"></script>
    // <!--[if IE]><link rel="stylesheet" type="text/css" href="{{ GEONODE_CLIENT_LOCATION }}theme/app/ie.css"/><![endif]-->
    // <script type="text/javascript" src="{{ GEONODE_CLIENT_LOCATION }}script/GeoExplorer.js"></script>
    //
    // <script>
    // var app;
    // var init = function() {
    //     {% autoescape off %}
    //     var config = Ext.apply({
    //         about: {
    //             "title": "GeoNode Demo Map",
    //             "abstract": "This is a demonstration of GeoNode, an application for assembling and publishing web based maps.  After adding layers to the map, use the 'Save Map' button above to contribute your map to the GeoNode community.",
    //             "contact": "For more information, contact <a href='http://opengeo.org'>OpenGeo</a>."
    //         },
    //         defaultSourceType: "gxp_wmscsource",
    //         sources: {
    //             "demo": {url: "http://demo.geonode.org/geoserver/wms/"},
    //             "un": {url: "http://preview.grid.unep.ch:8080/geoserver/ows/"}
    //         },
    //         map: {
    //             "projection": "EPSG:900913",
    //             "maxResolution": 156543.0339,
    //             "maxExtent": [
    //                 -20037508.34, -20037508.34,
    //                 20037508.34, 20037508.34
    //             ],
    //             "units": "m",
    //             "layers": [ {
    //                 "name": "geonode:CA",
    //                 "source": "demo",
    //                 "group": "background",
    //                 "fixed": true
    //             } ],
    //             "center": [-9431265.5574205, 1449637.0555531],
    //             "zoom": 5
    //         },
    //         proxy: "{{ PROXY_URL }}",
    //         rest: "{% url "maps_browse" %}",
    //         ajaxLoginUrl: "{% url "account_ajax_login" %}",
    //         homeUrl: "{% url "home" %}",
    //         localGeoServerBaseUrl: "{{ GEOSERVER_BASE_URL }}",
    //         localCSWBaseUrl: "{{ CATALOGUE_BASE_URL }}",
    //         hypermapRegistryUrl: "{{ HYPERMAP_REGISTRY_URL }}",
    //         mapProxyUrl: "{{ HYPERMAP_REGISTRY_URL }}",
    //         solrUrl: "{{ SOLR_URL }}",
    //         username: "{{ user.username }}",
    //         csrfToken: "{{ csrf_token }}",
    //         {% if user.is_authenticated %}
    //         db_datastore: true,
    //         {% endif %}
    //         authorizedRoles: "{{ user.is_authenticated|yesno:"ROLE_ADMINISTRATOR,ROLE_ANONYMOUS" }}"
    //     });
    //
    //     app = new GeoExplorer(config, true);
    //     {% endautoescape %}
    //
    //     var searchStore = new Ext.data.JsonStore({
    //         url: app.solrUrl,
    //         root: 'response.docs',
    //         idProperty: 'id',
    //         remoteSort: true,
    //         totalProperty: 'response.numFound',
    //         fields: [
    //             {name: 'id', type: 'string'},
    //             {name: 'uuid', type: 'string'},
    //             {name: 'name', type: 'string'},
    //             {name: 'title', type: 'string'},
    //             {name: 'abstract', type: 'string'},
    //             {name: 'min_x', type: 'string'},
    //             {name: 'min_y', type: 'string'},
    //             {name: 'max_x', type: 'string'},
    //             {name: 'max_y', type: 'string'},
    //             {name: 'layer_originator', type: 'string'},
    //             {name: 'is_public', type: 'string'},
    //             {name: 'url', type: 'string'},
    //             {name: 'service_type', type: 'string'},
    //             {name: 'bbox', type: 'string'},
    //             {name: 'location', type: 'string'},
    //             {name: 'layer_date', type: 'string'},
    //             {name: 'layer_datetype', type: 'string'},
    //             {name: 'srs', type: 'string'},
    //             // not used?
    //             {name: 'Availability', type: 'string'},
    //             {name: 'LayerUsername', type: 'string'}
    //
    //         ]
    //     });
    //
    //     GeoNode.queryTerms = {
    //         intx: "product(max(0,sub(min(180,max_x),max(-180,min_x))),max(0,sub(min(90,max_y),max(-90,min_y))))",
    //         sort: "score desc",
    //         //qf: "LayerTitleSynonyms^0.2 ThemeKeywordsSynonymsIso^0.1 ThemeKeywordsSynonymsLcsh^0.1 PlaceKeywordsSynonyms^0.1 Publisher^0.1 layer_originator^0.1 Abstract^0.2",
    //         fl: "id, uuid, name, title, abstract, min_x, min_y, max_x, max_y, layer_originator, is_public, url, service_type, bbox, location, layer_datetype, srs",
    //         qf: "title_txt^1 abstract_txt^0.2 originator_txt layer_username",
    //         wt: "json",
    //         defType: "edismax",
    //         q: "*",
    //         fq: [
    //             "{!frange l=0 incl=false cache=false}$intx"
    //         ]
    //     };
    //
    //     loadLayerFromSearchStore(searchStore,"tmi1",'service_type:"Hypermap:WorldMap"');
    //     loadLayerFromSearchStore(searchStore,"tmi2",'service_type:"OGC:WMS"');
    //     //loadLayerFromSearchStore(searchStore,"tmi3","service_type:'ESRI:ArcGIS:ImageServer'");
    //     //loadLayerFromSearchStore(searchStore,"tmi4","service_type:'ESRI:ArcGIS:MapServer'");
    //
    // }
    //
    // $(document).ready(init);
    //
    //
    // function setQueryItems(serviceType){
    //     // Clear the Key Words
    //     GeoNode.queryTerms.q = "*";
    //     // Remove any layer_originator filter if there
    //     for(var i=0;i<GeoNode.queryTerms.fq.length;i++){
    //         if(GeoNode.queryTerms.fq[i].indexOf('layer_originator') > -1){
    //             GeoNode.queryTerms.fq.splice(i, 1);
    //         }
    //     };
    //     // Remove any DataType filter if there
    //     for(var i=0;i<GeoNode.queryTerms.fq.length;i++){
    //         if(GeoNode.queryTerms.fq[i].indexOf('service_type') > -1){
    //             GeoNode.queryTerms.fq.splice(i, 1);
    //         }
    //     };
    //     // Add DataType filter
    //     var datatypes = serviceType;
    //     if(datatypes !== ''){
    //         GeoNode.queryTerms.fq.push(datatypes);
    //     };
    //     // Remove any date filter if there
    //     for(var i=0;i<GeoNode.queryTerms.fq.length;i++){
    //         if(GeoNode.queryTerms.fq[i].indexOf('layer_date') > -1){
    //             GeoNode.queryTerms.fq.splice(i, 1);
    //         }
    //     };
    //     // Set the query start
    //     GeoNode.queryTerms.start = 0;
    // }
    // function loadLayerFromSearchStore(searchStore,divIdPrefix,serviceType) {
    //     setQueryItems(serviceType);
    //     searchStore.load({params:GeoNode.queryTerms});
    //     var layer;
    //     var layerStore = searchStore.data.items;
    //     for(layer in layerStore){
    //         var layerName = layer["title"];
    //         var curdiv = divIdPrefix + (parseInt(layer["id"])+1);
    //         //$("#"+curdiv).attr("onclick","location='./main.action?mapid="+mapid+"'");
    //         $("#"+curdiv).children("p").text(layerName);
    //         //img.attr("src","./img/map/"+mapid+".jpg");
    //     }
    // }
    // </script>