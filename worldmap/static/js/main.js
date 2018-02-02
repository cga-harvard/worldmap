//main.jsp的页面的初始化
//TODO 整理全局变量 
var disopen = false;
// 打开测距
function mydisFunc() {
	if(disopen){
		measureOver();
		disopen=false;
	}
	else{
	measureStart();
	disopen=true;
	}
}
function closeAllPanel(){
	$('#sharePanel').css('display', 'none');
	$('#mapPanel').css('display', 'none');
	$('#searchBox').css('display', 'none');
	if(has(mySearchMarker))
		mySearchMarker.hide();
}
// 打开分享
function myshareFunc() {
	if ($('#sharePanel').css('display') == 'none')
		{
			closeAllPanel();
			$('#sharePanel').css('display', 'inline');
		}
	else
		$('#sharePanel').css('display', 'none');
}

// 打开搜索窗
function showSearchPanel() {
	if ($('#searchBox').css('display') == 'none'){
		closeAllPanel();
		$('#searchBox').css('display', 'inline');
	}
	else
		closeSearchPanel();
}

// 关闭搜索窗
function closeSearchPanel()
{
	$('#searchBox').css('display', 'none');
	if(has(mySearchMarker)) mySearchMarker.hide();
}

// 打开地图框
function showMapPanel() {
	if ($('#mapPanel').css('display') == 'none') {
		var mapsName = new Array();
		var username;
		var userid;
		$.ajax({
			url: "./getActiveUser.action",
			async: false,
			type: "POST",
			dataType: "text",
			data: {
			},success: function (result) {
				username = $.parseJSON(result).username;
				userid = $.parseJSON(result).userid;
			}});
		$.ajax({
			url: "./getMapList.action",
			async: false,
			type: "POST",
			dataType: "text",
			data: {
				userid: userid
			},
			success: function (result) {
				var resultobj = $.parseJSON(result);
				for (var i = 0; i < resultobj.length; i++) {
					var temp = {
						id: resultobj[i].id,
						name: resultobj[i].mapname
					}
					mapsName.push(temp);
				}
			}
		})
		$('#selectMapName').combobox({

			valueField: 'id',
			textField: 'name',
			data: mapsName,
			onSelect: function (param) {
				getMap(param.id);
			}
		});
		closeAllPanel();
		$('#mapPanel').css('display', 'inline');
	}
	else
		$('#mapPanel').css('display', 'none');
}

// 获取地图
function getMap(varmapid) {
	
	addMapToMap(varmapid);
}

// 添加地图至地图
function addMapToMap(varmapid)
{
	var newlayerlist;
	var submaptree;
	$.ajax({
		url: "./getMapLayerList.action",
		async: false,
		type: "POST",
		dataType: "text",
		data: {
			mapid:varmapid
		},success: function (result) {
			newlayerlist = layeranaly($.parseJSON(result)); 
		}});
	$.ajax({
		url: "./getMapInfo.action",
		async: false,
		type: "POST",
		dataType: "text",
		data: {
			mapid:varmapid
		},success: function (result) {
			var submap = $.parseJSON(result);
			submaptree = $.parseJSON(submap.layertree);
		}});
	function insertLayer(treejson){
		if(treejson.type=="layer"){
		myMapMana.maplayerlist.push(newlayerlist[treejson.index]);
		treejson.index=myMapMana.maplayerlist.length-1;
		}
	}
	travelTree(submaptree,insertLayer);
	submaptree[0].type="submap";
	submaptree[0].id=varmapid;
	addsubtree(submaptree);
	redraw();
}

function screenShot(){
	html2canvas($('#map'), {
		  onrendered: function(canvas) {
			  canvas.id = "mycanvas";
		        // document.body.appendChild(canvas);
		        // 生成base64图片数据
		        var dataUrl = canvas.toDataURL();
		        var newImg = document.createElement("img");
		        newImg.src =  dataUrl;
		        newImg.width = 320;
		        newImg.height = 180;
		        // document.body.appendChild(newImg);
		  }
	});
}

// 打开查询结果框
function showResultPanel(resultSet) {
	var gridDataSet="";
	for (var i = 0; i < resultSet.length; i++) {
		 gridDataSet=gridDataSet+'<tr class="tr" id="'+i+'">'+
				'<td>'+resultSet[i].layername+'</td>'+
				'<td>'+resultSet[i].name+'</td>'+
				'<td>'+resultSet[i].count+'</td>'+
				'<td>'+resultSet[i].type+'</td>'+
				'</tr>'
	}
	$('#resultSet').html(gridDataSet);
	$(".tr").click(function(){
			$('#resultPanel').window('close');
			zoomMapTo(resultSet[$(this).attr('id')]);
        });
        
	$('#resultPanel').window('open');
}

function openMarkBoard(data){
	$('#MarkBoard').css('display','inline');
	var html="<h4><strong>查询结果</strong></h4>";
	//通过判断是否很有bound属性来判别是否是面要素
	if(data.hasOwnProperty("bound")){//面要素成员属性独特、单独处理
		for(index in data)
		{
			var label = index;
			if(index=="gid") {
				label="GID";
				html=html+'<strong>'+label+':</strong>'+data[index]+'<br>';
			}
			if(index=="count") {
				label="数量";
				html=html+'<strong>'+label+':</strong>'+data[index]+'<br>';
			}
			if(index=="name") {
				label="地名";
				html=html+'<strong>'+label+':</strong>'+data[index]+'<br>';
			}
			else if(index=="geometry") {
				label="要素类型";
				html=html+'<strong>'+label+':</strong>'+data[index].type+'<br>';
			}
			else if(index=="name_py") {
				label="英文名";
				html=html+'<strong>'+label+':</strong>'+data[index]+'<br>';
			}
		}
	}
	else{//不是面要素
		for(index in data)
		{
			var label = index;
			if(index=="name") label="地名";
			if(index=="value") {
				label="数据内容";
				var len = data[index].length;
				if(len>=3)
				html=html+'<strong>'+label+':</strong>'+data[index][len-3]+'<br>';
			}
			else
			html=html+'<strong>'+label+':</strong>'+data[index]+'<br>';
		}
		var len = data.value.length;
		html=html+'<strong>ID:</strong>'+"<span class='ID'>"+data.value[len-1]+','+data.value[len-2]+'</span><br>';
		html=html+'<a href="#" class="detailLink">详细信息</a>';
		$('.detailLink').click(function(){
			var id = $('#MarkBoard').find('.ID').html();
			$.ajax({
				url: "./getFeaturesDetail.action",
				async: false,
				type: "POST",
				dataType: "text",
				data: {
					index:"["+id+"]"
				},success: function (result) {
					ShowDetailInfoPanel($.parseJSON(result));
				}});
		})
	}
	
	$('#MarkBoard').find('#res').html(html);
}
function closeMarkBoard()
{
	$('#MarkBoard').css('display','none');
	$('#MarkBoard').find('#res').html("");
}
function setMarkBoardPos(tx,ty)
{
	var topOffSet = $('#headInterval').height();
	var mapW = $('#map').width();
	var mapH = $('#map').height();
	var boardH = parseInt($('#MarkBoard').css('height'));
	$('#MarkBoard').css('left',mapW/2-48+'px'); // here the 48 is set in
												// olpopup.css
	$('#MarkBoard').css('top',mapH/2-boardH-7+'px'); // here the 7 is
																// set in
																// olpopup.css
																// sqrt(10)
}
// 缩放地图至 （按照对象的情况确定缩放层级
function zoomMapTo(obj)
{	
	var layer = myMapMana.maplayerlist[obj.index.layer];
	var index = obj.index.feature;
	switch(layer.type)
	{
	case 0:
		var data = layer.style.dataSet._data;
		var feature = data[index];
		var BB = feature.bound;
		
		var dx = BB.maxX-BB.minX;
		var dy = BB.maxY-BB.minY;
		var tx = (BB.minX+BB.maxX)/2;
		var ty = (BB.minY+BB.maxY)/2;
		var avgDis = dx>dy?dx:dy;
		if(avgDis){
			var newView= new ol.View({
	            center: ol.proj.fromLonLat([tx, ty]),
	            resolution:avgDis*100// here 100 is a magic number
										// (setsumei:lonlat to Mercator(100k) to
										// pixel(1k*1k))
	            })
			mymap.setView(newView);
		}
		else{
			var newView= new ol.View({
	            center: ol.proj.fromLonLat([tx, ty]),
	            resolution:myMapMana.zoomlevel
	            })
			mymap.setView(newView);
		}
		openMarkBoard(feature);
		setMarkBoardPos();
		break;
	case 1:
		var data = layer.style.series.data;
		var feature=data[index];
		var tx=feature.lonlat[0];
		var ty=feature.lonlat[1];
		var dx=layer.style.append.avgDis.dx;
		var dy=layer.style.append.avgDis.dy;
		var avgDis = dx>dy?dx:dy;
		if(avgDis){
		var newView= new ol.View({
            center: ol.proj.fromLonLat([tx, ty]),
            resolution:avgDis*100// here 100 is a magic number
									// (setsumei:lonlat to Mercator(100k) to
									// pixel(1k*1k))
            })
		mymap.setView(newView);
		}
		else{
			var newView= new ol.View({
	            center: ol.proj.fromLonLat([tx, ty]),
	            zoom:myMapMana.zoomlevel
	            })
			mymap.setView(newView);
		}
		openMarkBoard(feature);
		setMarkBoardPos();
		break;
	case 2:
		var data = layer.style.series.data;
		var feature = data[index];
		var tx=data[index].lonlat[0];
		var ty=data[index].lonlat[1];
		var dx=layer.style.append.avgDis.dx;
		var dy=layer.style.append.avgDis.dy;
		var avgDis = dx>dy?dx:dy;
		if(avgDis){
		var newView= new ol.View({
            center: ol.proj.fromLonLat([tx, ty]),
            resolution:avgDis*100// here 100 is a magic number
            })
		mymap.setView(newView);
		}
		else{
			var newView= new ol.View({
	            center: ol.proj.fromLonLat([tx, ty]),
	            zoom:myMapMana.zoomlevel
	            })
			mymap.setView(newView);
		}
		openMarkBoard(feature);
		setMarkBoardPos();
		break;
	case 3:
		var data = layer.style.data;
		var feature = data[index];
		var coorda = data[index].lonlat[0];
		var coordb = data[index].lonlat[1];
		var dx=Math.abs(coorda[0]-coordb[0]);
		var dy=Math.abs(coorda[1]-coordb[1]);
		var tx = (data[index].lonlat[0][0]+data[index].lonlat[1][0])/2;
		var ty = (data[index].lonlat[0][1]+data[index].lonlat[1][1])/2;
		var avgDis = dx>dy?dx:dy;
		if(avgDis){
		var newView= new ol.View({
            center: ol.proj.fromLonLat([tx, ty]),
            resolution:avgDis*100// here 100 is a magic number
            })
		mymap.setView(newView);
		}
		else{
			var newView= new ol.View({
	            center: ol.proj.fromLonLat([tx, ty]),
	            zoom:myMapMana.zoomlevel
	            })
			mymap.setView(newView);
		}
		openMarkBoard(feature);
		setMarkBoardPos();
		break;
	}
}
    function showLayerPanel() {
        $("#layerPanel").window('open');
        getLayerData(0,10);
    }

	function mouseMove(ev) {
		Ev = ev || window.event;
		mousePos = mouseCoords(ev);
	}
	function mouseCoords(ev) {
    	if (ev.pageX || ev.pageY) {
            return { x: ev.pageX, y: ev.pageY };
        }
        return {
            x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        	y: ev.clientY + document.body.scrollTop - document.body.clientTop
    	};
	} 
	function initMouseFunc(){
		document.onmousemove = mouseMove; 
	}
	// 原layerpanel.js
    function diappearText(obj) {
        if(obj.value == ""){
            obj.removeAttribute('placeholder');
        }
    }

    function showText(obj,text) {
        if(obj.value == ""){
            obj.setAttribute("placeholder",text);
        }
	}
	
    var jsonData;
    var selected;
    function getLayerData(offset,limit) { // 这里的逻辑需要修改
		$.ajax({
			url:"./searchLayers.action",
			async:true,
			type:"POST",
			dataType:"json",
			data:{
				keyword:$("#keyword").val(),
				type:$("#type").val(),
				offset:offset,
				limit:limit
			},
			success:function(result){
				if(result == null || result == ""){
					var table = $("#table");
					var nodes = table.children();
			        for(var i = 0 ;i < nodes.length;i++){
			            nodes.remove();
			        }
					$("#databorder").html("无查询结果");
					$("#table").append("<tr><td>无查询结果</td></tr>");
					$("#count").html("0");
				}else{
					addDataColum(result);			
				}				
			}
		})
	}
    
	// 锟斤拷锟斤拷锟斤拷锟斤拷锟?
	function addDataColum(result){
		offset = result["offset"];
		var limit = result["limit"];
		var totalCount = result["totalCount"];
		var lastPage;
		if(totalCount%10==0 && totalCount!=0)
			lastPage = Math.floor(totalCount/10 - 1) * 10;
		else
			lastPage = Math.floor(totalCount/10) * 10;
		if(offset == 0)
			$("#li2").hide();
		else
			$("#li2").show();
			$("#li2").attr("href", "javascript:getLayerData("+ (offset-10) +",10)");
		if(offset == lastPage)
			$("#li3").hide();
		else
			$("#li3").show();
			$("#li3").attr("href", "javascript:getLayerData("+ (offset+10) +",10)");
		$("#li4").attr("href", "javascript:getLayerData("+ lastPage +",10)");
		var jsonData = result["layers"];
		// jsonData = JSON.parse(res);//锟斤拷锟斤拷锟斤拷转锟斤拷锟斤拷json
		var table = $("#table");
		// 锟斤拷删锟斤拷锟斤拷锟斤拷锟接节碉拷
		var nodes = table.children();
        for(var i = 0 ;i < nodes.length;i++){
            nodes.remove();
        }
     
        	for(var i = 0 ; i<jsonData.length; i++){
    			var jsonEachData = jsonData[i];// 锟斤拷取每一锟斤拷锟斤拷锟斤拷
    			var elementString ="<tr class='tr'>" ;
    			for(var field in jsonEachData){
    				if(field == "layername")
    					elementString += "<td class='layername'>" + jsonEachData[field] +"</td>";
    				if(field == "type"){
    					switch(jsonEachData[field]){
    						case 0:
    							elementString += "<td class='type'>" + "分层设色图" +"</td>";
    							break;
    						case 1:
    							elementString += "<td class='type'>" + "等级符号图" +"</td>";
    							break;
    						case 2:
    							elementString += "<td class='type'>" + "点图" +"</td>";
    							break;
    						case 3:
    							elementString += "<td class='type'>" + "轨迹图" +"</td>";
    							break;
    						default:
    							break;
    					}
    				}					
    				if(field == "userid")
    					elementString += "<td class='author'>" + jsonEachData[field] +"</td>";
    				
    				if(field == "datacontent"){
    					var obj = jsonEachData[field];
    					elementString += "<td style='display:none'>" +  JSON.stringify(obj) + "</td>";
    				}
    				if(field == "id"){
    					elementString += "<td class='layerid' style='display:none'>" +  jsonEachData[field] + "</td>";
    				}
    					
    			}
    			elementString += "</tr>";
    			table.append(elementString);
    		}
        
        
       
        $("#count").html($("#table tr").length);
      	// 为table提供tr回调函数
		 $(".tr").click(function(){
            if($(this).hasClass("select")){
                $(this).removeClass("select");
                var contentDateBorder = "";             
                $("#table").find("tr").each(function () {
                	  if($(this).hasClass("select")){
                		  // contentDateBorder +=
							// $(this).children('td:eq(4)').text()
							// +"<br/><br/>";
                	  }
           		});
                $("#databorder").html(contentDateBorder);
            }
            else{
            	$(this).addClass("select");
            	var contentDateBorder = "";             
                $("#table").find("tr").each(function () {
                	  if($(this).hasClass("select")){
                		  // contentDateBorder +=
							// $(this).children('td:eq(4)').text()
							// +"<br/><br/>";
                	  }
           		});
                $("#databorder").html(contentDateBorder);
            }
        })
        // 为table锟斤拷每一锟斤拷tr锟斤拷一锟斤拷mouseover/mouseout锟铰硷拷
         $(".tr").mouseover(function() {
        	 $(this).addClass("over");
        	 var contentDateBorder = "";             
             $("#table").find("tr").each(function () {
             	  if($(this).hasClass("select") || $(this).hasClass("over")){
             		  // contentDateBorder +=
						// $(this).children('td:eq(4)').text() +"<br/><br/>";
             	  }
        		});
             $("#databorder").html(contentDateBorder);
        })
        $(".tr").mouseout(function() { 
        	 $(this).removeClass("over");
        	 var contentDateBorder = "";             
             $("#table").find("tr").each(function () {
             	  if($(this).hasClass("select") || $(this).hasClass("over")){
             		  // contentDateBorder +=
						// $(this).children('td:eq(4)').text() +"<br/><br/>";
             	  }
        		});
             $("#databorder").html(contentDateBorder);
        })
	}

// 这里可以重新发送请求来获得图层数据，用以优化
function addLayerToMap()
{
	var selectedset = new Array();
	$(".tr.select").each(function(){
		selectedset.push(parseInt(($(this).find(".layerid").html())));
	});
	var newJsonData=null;
	$.ajax({
		url: "./getLayerByIdlist.action",
		async: false,
		type: "GET",
		dataType: "text",
		data: {
			idlist: "["+selectedset+"]"
		},success: function (result) {
			newJsonData = JSON.parse(result);
		}});
	var temp = new Array();
	for(var i=0; i<newJsonData.length;i++)
	{
			temp=temp.concat(layeranaly(newJsonData[i]));			
	}	
	for(var i=0; i<temp.length;i++)
		{
			if(nothave(temp[i]))
			{
				temp[i].mlid=0;
				myMapMana.maplayerlist.push(temp[i]);
				addTreeNode(temp[i],myMapMana.maplayerlist.length-1);
			}
		}
    $("#layerPanel").window('close');
    redraw();
}

var printData=function(data,except){// printDataObject
	function notin(a,except){
		if(except){
			for(var ex=0;ex<except.length;ex++)
			{
				if(a==except[ex]) return false;
			}
			return true;
		}
		else return true;
	}
	var res=new Array();
	for(index in data){
		if(notin(index,except)){
			res.push(index+':'+data[index]);
		}
	}
	return res;
}

var printDataString=function(data,except){
	function notin(a,except){
		if(except){
			for(var ex=0;ex<except.length;ex++)
			{
				if(a==except[ex]) return false;
			}
			return true;
		}
		else return true;
	}
	var res="";
	for(index in data){
		if(notin(index,except)){
			res=res+''+data[index];
		}
	}
	return res;
}

function ShowDetailInfoPanel(obj){
	var data = $.parseJSON(obj.jsondata);
	var html="<thead><tr><th width='24%'>属性</th><th width='74%'>内容</th></tr></thead><tbody>"
	for (index in data)
	{
		html+="<tr><td>"+index+"</td>";
		html+="<td>"+data[index]+"</td></tr>";
	}
	html+="</tbody>"
	$('#DetailInfoPanel').find('#detail').html(html);
	$('#DetailInfoPanel').window({
	    shadow:false,	    
	});
	$('#DetailInfoPanel').window('open');
	$('#DetailInfoPanel').window('center');
}


// 页面初始化
$(document).ready(function () {
	initMouseFunc();// 绑定tooltip的鼠标跟随事件
	// getLayerData();//获取图层数据（这里要重写（这里的具体代码见layerpanel.js
	yukiInit();// 初始化（这里的代码见yukimap）
	createAutoComplete();// 建立查询数据组（这里的代码见AttrSearch
	checkAuthority();
	measureInit();
	Dragging(getDraggingDialog).enable();
	$("#myChangeBaseMap").parent().css({"left":"", "right":"5px"});
	var node = $('#baseMapTree').tree('find', basemapid);//找到id为”tt“这个树的节点id为”1“的对象
	$('#baseMapTree').tree('select', node.target);
	switch(basemapid) {
		case 0: {
			addLayer2Bottom(tianditu_annotation);
			addLayer2Bottom(tianditu_road_layer);
			break;
		}
		case 1: {
		    addLayer2Bottom(tianditu_image_annotation);
		    addLayer2Bottom(tianditu_image_layer);
			break;
		}
		case 2: {
			addLayer2Bottom(qing_layer);
			break;
		}
		case 3: {
			addLayer2Bottom(yuan_layer);
			break;
		}
	}
	$("#baseMapTree").tree({
        onSelect: function(node){
        	switch(basemapid){
	        	case 0:{
	        		mymap.removeLayer(tianditu_road_layer);
	    		    mymap.removeLayer(tianditu_annotation);
	    		    break;
	        	}
	        	case 1:{
	        		mymap.removeLayer(tianditu_image_layer);
	    			mymap.removeLayer(tianditu_image_annotation);
	    			break;
	        	}
	        	case 2:{
	        		mymap.removeLayer(qing_layer);
	        		break;
	        	}
	        	case 3:{
	        		mymap.removeLayer(yuan_layer);
	        		break;
	        	}
        	}
        	switch(node.text) {
	        	case "地图": {
        			addLayer2Bottom(tianditu_annotation);
        			addLayer2Bottom(tianditu_road_layer);
        			basemapid = 0;
	        		break;
	        	}
	        	case "影像": {
        		    addLayer2Bottom(tianditu_image_annotation);
        		    addLayer2Bottom(tianditu_image_layer);
        		    basemapid = 1;
	        		break;
	        	}
	        	case "清代": {
	        		addLayer2Bottom(qing_layer);
	        		basemapid = 2;
	        		break;
	        	}
	        	case "元代": {
	        		addLayer2Bottom(yuan_layer);
	        		basemapid = 3;
	        		break;
	        	}
        	}
    	}
    });
});

function addLayer2Bottom(layer){
	var layers = mymap.getLayers();
	layers.insertAt(0, layer);
}

