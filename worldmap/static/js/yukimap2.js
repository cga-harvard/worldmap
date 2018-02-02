//————————————————————————**yukimap2.js**————————————————————————//
//包含echarts&自制面图层显示工具olv.js
//yukimap2其实就是yukimapForOpenlayers
//包含前端容器 YKmap 和YKlayer
//包含保存地图用的结构Icemap和Icelayer
//包含所有管理用全局变量
//入口function myinit()
//————————————————————————以上为说明————————————————————————//
//面状物的包围盒工具
function getBoundBox(pointArray)
{
	var maxX,minX,maxY,minY;
	maxX=minX=pointArray[0][0][0][0];
	maxY=minY=pointArray[0][0][0][1];
	for(var i=0;i<pointArray.length;i++)
		{
			var pointArrayL0=pointArray[i];
			for(var j=0;j<pointArrayL0.length;j++)
				{
					var pointArrayL1=pointArrayL0[j];
					for(var k=0;k<pointArrayL1.length;k++)
						{
							var tx = pointArrayL1[k][0];
							var ty = pointArrayL1[k][1];
							if(tx>maxX) maxX=tx;
							if(tx<minX) minX=tx;
							if(ty>maxY) maxY=ty;
							if(ty<minY) minY=ty;
						}
				}
		}
	return({maxX:maxX,minX:minX,maxY:maxY,minY:minY});
}
//点状物的缩放等级确定
function getAverageDistance(pointArray)
{
	var maxX,minX,maxY,minY;
	maxX=minX=pointArray[0].lonlat[0];
	maxY=minY=pointArray[0].lonlat[1];
	for(var i=0;i<pointArray.length;i++)
	{
		var tx = pointArray[i].lonlat[0];
		var ty = pointArray[i].lonlat[1];
		if(tx>maxX) maxX=tx;
		if(tx<minX) minX=tx;
		if(ty>maxY) maxY=ty;
		if(ty<minY) minY=ty;
	}
	var k = Math.sqrt(pointArray.length)-1;
	var dx = (maxX-minX)/k;
	var dy = (maxY-minY)/k;
	return {dx:dx,dy:dy};
}
//自制的判定地图中是否包含某个图层的工具
function nothave(yklayer) {
	var templist = myMapMana.maplayerlist;
	for (var i = 0; i < templist.length; i++) {
		if(templist[i]!=null){
		if (templist[i].layerid == yklayer.layerid) return false;
	}
	}
	return true;
}
//前端数据结构定义
//前端图层结构
function Yklayer(layerjson) {
	function stateanaly(statedata) {
		if (statedata == null) return true;
		else return statedata;
	}
	function zanaly(zdata) {//等着重构的图层层叠管理,保证了一张地图创建的时候图层是从0开始的序列,新加载图层会排在后面
		if (zdata == null) {
			var zIndex = maxz;
			maxz = maxz + 1;
			return zIndex;
		}
		else {
			maxz = zdata;
			return zdata;
		}
	}
	function dataanaly(datajson) {//数据的读入，仅当读取未进行过渲染的图层数据时才包含此类数据
		if (datajson == null) {
			return null;
		}
		else {
			
			return $.parseJSON(datajson);
		}
	}
	this.mlid = layerjson.mlid;//在maplayer表中的唯一标识符
	this.layerid = layerjson.id;//在layer表中的唯一标识符
	this.layername = layerjson.layername;//图层名
	this.layeruserid = layerjson.userid;//图层创建者的用户id
	this.storelocation = layerjson.storelocation;//图层额外数据的保存路径
	this.accessibility = layerjson.accessibility;//图层的公开设定
	this.appendsrc = layerjson.appendDataSrc;//图层的追加参考地理数据的路径（如geojson或者坐标匹配表）
	this.type = parseInt(layerjson.type);//图层类型
	this.data = dataanaly(layerjson.datacontent);//图层数据(因为style里都有备份数据)
	this.state = stateanaly(layerjson.state);//图层在当前地图的显隐状态
	this.style = dataanaly(layerjson.style);//根据不同的类型有着不同结构的样式表
	this.zIndex = zanaly(layerjson.zIndex);//图层叠放顺序(mapv图层单独管理 不受干扰)
	this.mapv = null;//管理mapv图层的引用
}
//由json解析图层列表的函数 被AddLayerToMap调用 和YKmap的构造函数调用
function layeranaly(data) {
		var layers = new Array();
		if (data == null) return layers;
		var i = 0;
		for (var i = 0; i < data.length; i++) {
			layers.push(new Yklayer(data[i]));
		}
		if (i == 0) layers.push(new Yklayer(data));
		return layers;
	}
//前端地图容器结构
function Ykmap(mapjson) {
	//图层解析函数
	var mapstyle = $.parseJSON(mapjson.mapstyle);//解析百度地图配置json
	this.mapid = mapjson.id;//地图id
	this.mapuserid = mapjson.userid;
	this.mapaccess = mapjson.accessibility;
	this.mapname = mapjson.mapname;//地图名称
	this.centerx = mapstyle.centerx;//百度地图初始化经纬度
	this.centery = mapstyle.centery;
	this.zoomlevel = mapstyle.zoomlevel;//百度地图初始化缩放等级
	this.mapmode = mapstyle.mapmode;//百度地图初始化地图类型
	//TODO 增加百度地图的样式配置
	this.maplayerlist = layeranaly(mapjson.maplayer);//地图图层列表
	this.layertree = $.parseJSON(mapjson.layertree);
	this.maptype = mapjson.maptype || "0";
	this.basemapid = mapjson.basemapid;
}


function has(item) {
	if (item) return true;
	else return false;
}
//这是一个针对代码可读性的优化方案 = = 
//目的是这样子的:
//在一次使用时，不改变数组中元素的下标，删除元素为改变元素内容为null，使得下标访问为稳定的
//这样子很多地方关于数组的操作的编写会变得轻松和简单
function travelList(list,func)
{
	for(var i=0;i<list.length;i++)
	{
		if(null==list[i]) continue;
		func(list[i],i);
	}
}
//我觉得有必要把非主要控件的全局变量整合到一个全局变量里面
var maxz = 0;//预置的zindex控制
var mydis;//百度地图测距插件
var mymap;//百度地图调用变量
var myMapMana;//地图管理变量
var myecharts;//echarts调用变量
var echartsoption;//echarts的option json
var myseries = new Array();//echartseries管理变量
var bmapoverlay;//bmap的覆盖物管理变量
var myinit;//初始化函数
var mySearchMarker;
var basemapid;
//***//////////---程序入口---//////////***//
function yukiInit() {
	maxz = 0;
	myMapMana = new Ykmap(mapdata);
	basemapid = mapdata.basemapid;//记录当前的底图id
	initLayertree(myMapMana.mapid,myMapMana.mapname);//修改其代码在layertree.js
	display();
}

function redraw() {
	myseries = [];
	for (var i = 0; i < myMapMana.maplayerlist.length; i++) {
		var layerjson = myMapMana.maplayerlist[i];
		if(layerjson==null) continue;
		if (has(layerjson.mapv))//这里也需要重新整合
		{
			//layerjson.mapv.unbindEvent();
		}
		if (layerjson.state) {
			switch (layerjson.type) {
				case 0:
					var bool = drawL0(layerjson, i);
					break;
				case 1:
					var levelscatter = drawL1(layerjson, i);
					myseries.push(levelscatter);
					break;
				case 2:
					var points = drawL2(layerjson, i);
					myseries.push(points);
					break;
				case 3:
					var trail = drawL3(layerjson, i);
					myseries.push(trail);
					break;
			}
		}
		else
			if (has(layerjson.mapv)) {
				//layerjson.mapv.destroy();
				layerjson.mapv.hide();
			}
	}
	refresh();
}
function refresh() {
	function showmapv(item,i){
		if((item.state) && (has(item.mapv))) {
			//myMapMana.maplayerlist[i].mapv.bindEvent();
			item.mapv.show();
		}
	}
	var center3857 = mymap.getView().getCenter();
	var centerPoint = ol.proj.toLonLat(center3857);
	myMapMana.centerx = centerPoint[0];
	myMapMana.centery = centerPoint[1];
	myMapMana.zoomlevel = mymap.getView().getZoom();
	echartsoption.series = myseries;
	myecharts.setOption(echartsoption);
	//写到这里感觉可以单独给myMapMana的maplayerlist写一个遍历函数了 = = 
	travelList(myMapMana.maplayerlist,showmapv);
	if(has(autoComplete)){
	autoComplete.setArr(getLayerStringDataArr());
	}
	redrawLegend();
}

function drawL0(layer, layerindex) {//分层设色图 使用mapv绘制
	var dataSet;
	var appendsrc;
	//缺省设定
	var splitList;
	var maxC, minC;
	var splitNum = 10;
	var splitType = "linear";
	var highlight = "#edacbe";
	if (has(myMapMana.maplayerlist[layerindex].mapv)) {
		//TODO update zIndex
		return true;}
	if (has(myMapMana.maplayerlist[layerindex].style)) {
		//这部分是根据储存的信息重构图层组件的代码...
		dataSet = new mapv.DataSet(myMapMana.maplayerlist[layerindex].style.dataSet._data);
		//gradient = myMapMana.maplayerlist[layerindex].style.options.gradient || gradient;
		maxC = myMapMana.maplayerlist[layerindex].style.options.max;
		minC = myMapMana.maplayerlist[layerindex].style.options.min;
		splitNum = myMapMana.maplayerlist[layerindex].style.options.splitNum;
		splitList = myMapMana.maplayerlist[layerindex].style.options.splitList;
		highlight =  myMapMana.maplayerlist[layerindex].style.options.highlight;
		splitType = myMapMana.maplayerlist[layerindex].style.options.splitType;
		appendsrc = myMapMana.maplayerlist[layerindex].style.options.appendsrc;
	}
	else {
		appendsrc = layer.appendsrc;
		$.ajaxSettings.async = false;
		$.getJSON(layer.appendsrc, function (geojson) {
			var gdata = layer.data;
			dataSet = mapv.geojson.getDataSet(geojson);
			maxC = Number(gdata[0].value);
			minC = Number(gdata[0].value);
			var data = dataSet.get({
				filter: function (item) {//数据字段和geojson的name匹配 这里特殊化了一下 因为清代省份图用了两个字段 分别表示拼音和中文的省份名
					for (var i = 0; i < gdata.length; i++) {
						if (gdata[i].name == item.name) {
							item.count = Number(gdata[i].value);
							item.bound = getBoundBox(item.geometry.coordinates);
							if (item.count > maxC) {
								maxC = item.count;
							}
							if (item.count < minC) {
								minC = item.count;
							}
							return true;
						}
					}

					return false;
				}
			});

			splitList = yukiColorMapper(minC, maxC, '#ffddee', '#aa4466', splitNum, splitType);
			dataSet = new mapv.DataSet(data);
		});
		$.ajaxSettings.async = true;
	}/*
			dataSet = layer.data;
			minC = maxC = Number(dataSet[0].value);
			
			for (var i = 0; i < dataSet.length; i++) {
							var count = Number(dataSet[i].value);
							//item.bound = getBoundBox(item.geometry.coordinates);
							if (count > maxC) {
								maxC = count;
								continue;
							}
							if (count < minC) {
								minC = count;
							}
						}
					
			maxC = maxC;
			minC = minC;
			splitList = yukiColorMapper(minC, maxC, '#ffddee', '#aa4466', splitNum, splitType);
*/
	{
		var options = {
			draw: 'choropleth',
			max: maxC,
			min: minC,
			zIndex:myMapMana.maplayerlist[layerindex].zIndex,
			highlight:highlight,
			splitNum: splitNum,
			splitType: splitType,
			splitList: splitList,
			shadowColor: 'rgba(0, 0, 0, 0.5)', // 投影颜色
			shadowBlur: 10,  // 投影模糊级数
			/*methods: {
				click: function (item) {
					if (tooltipPub.flag == 0) {
					$('#QueryBoard').window('open');
					$('#QueryBoard').window('expand');
					$('#layerL0').text(layer.layername);
					$('#nameL0').text(item.name);
					$('#countL0').text(item.count);
					$('#typeL0').text('面');
					}
				},
				mousemove: function (item) {
					item = item || {};
					var flag = 0;
					var data = dataSet.get();
					for (var i = 0; i < data.length; i++) {
						var a,b;
						if(has(item.id)) {a=item.id;b=data[i].id;}
						else if(has(item.gid)) {a=item.gid;b=data[i].gid;}
						
						if (has(a)&&a==b) {//这里也是 geojson里面是gid 总之item的下面的东西的类型都要注意和geojson里面得对应字段的匹配问题
							data[i].fillStyle = layer.style.options.highlight;
							flag = 1;
							if (tooltipPub.flag == 0) {
								$("#mytooltip").html(layer.layername+':'+item.name+':'+item.count);
								$("#mytooltip").css("top", (mousePos.y - 40) + "px");
								$("#mytooltip").css("left", (mousePos.x + 10) + "px");
								$("#mytooltip").css("display", "inline");
							}
						} else {
							data[i].fillStyle = null;
						}
					}
					if (flag == 0) { $("#mytooltip").css("display", "none") };
					dataSet.set(data);
				}
			},*/
			globalAlpha: 0.9,
			draw: 'choropleth',
			appendsrc:appendsrc
		}
		//完成设定 进行绘图
		myMapMana.maplayerlist[layerindex].style = { "options": options, "dataSet": dataSet };
		myMapMana.maplayerlist[layerindex].mapv = new OlvLayer(mymap, options.appendsrc,dataSet, options,layerindex);
		//myMapMana.maplayerlist[layerindex].mapv.destroy();
	}
	return true;
}
function drawL1(layer, layerindex) {//等级符号图 （打算后面全用mapv重构
	if (has(myMapMana.maplayerlist[layerindex].style)) {
		//同步zIndex值之后重绘
		//对已有style做修改后没反应就在此重设
		//回调函数必须在此重设...这里就有个问题 如何在字符串和回调函数之间转换
		myMapMana.maplayerlist[layerindex].style.series.symbolSize
			= function (val, param) {
				var temp = myMapMana.maplayerlist[layerindex].style.append;
				//需要用类似模板的函数重构，就是把计算函数作为参数传入的那种...
				if (temp.mapperType == "linear")
					return (val[2] - temp.min) / (temp.max - temp.min) * (temp.maxSize - temp.minSize) + temp.minSize;
				else if (temp.mapperType == "log") {
					//确保取对数之前不出现负数
					var offset = 1;
					if (temp.min < 0) offset = -temp.min + 1;
					return (Math.log(val[2] + offset) - Math.log(temp.min + offset)) / (Math.log(temp.max + offset) - Math.log(temp.min + offset)) * (temp.maxSize - temp.minSize) + temp.minSize;
				}
				else if (temp.mapperType == "square") {
					var offset = 0;
					if (temp.min < 0) offset = -temp.min;
					return ((val[2] + offset) + (temp.min + offset)) * ((val[2] + offset) - (temp.min + offset)) / ((temp.max + offset) - (temp.min + offset)) / ((temp.max + offset) + (temp.min + offset)) * (temp.maxSize - temp.minSize) + temp.minSize;
				}
				else return val[2];
			}
		myMapMana.maplayerlist[layerindex].style.series.itemStyle.normal.color
			= function (param) {
				var temp = myMapMana.maplayerlist[layerindex].style.append;
				var maxrgb = HexToColorArray(temp.maxColor);
				var minrgb = HexToColorArray(temp.minColor);
				var dvalue;
				if (temp.mapperType == "log") {
					//确保取对数之前不出现负数
					var offset = 1;
					if (temp.min < 0) offset = -temp.min + 1;
					dvalue = (Math.log(param.value[2] + offset) - Math.log(temp.min + offset)) / (Math.log(temp.max + offset) - Math.log(temp.min + offset));
				}
				else if (temp.mapperType == "square") {
					var offset = 0;
					if (temp.min < 0) offset = -temp.min;
					dvalue = (param.value[2] - temp.min) * (param.value[2] + temp.min) / (temp.max - temp.min) / (temp.max + temp.min)
				}
				else
				{ dvalue = (param.value[2] - temp.min) / (temp.max - temp.min); }
				var dr = parseInt(dvalue * (maxrgb.r - minrgb.r));
				var dg = parseInt(dvalue * (maxrgb.g - minrgb.g));
				var db = parseInt(dvalue * (maxrgb.b - minrgb.b));
				var dycolor = {
					r: minrgb.r + dr,
					g: minrgb.g + dg,
					b: minrgb.b + db
				};
				return ColorArrayToHex(dycolor);
			}
		myMapMana.maplayerlist[layerindex].style.series.z = myMapMana.maplayerlist[layerindex].zIndex;
		return myMapMana.maplayerlist[layerindex].style.series;
	}
	var data = layer.data;
	var maxvalue = Number(data[0].value);
	var minvalue = Number(data[0].value);
	var maxsize = 20;
	var minsize = 5;
	var maxcolor = "#5784ef";
	var mincolor = "#aad3ff";
	var mappertype = "linear";
	var res = [];
	for (var i = 0; i < data.length; i++) {
		res.push({
			name: data[i].name,
			lonlat:[Number(data[i].x), Number(data[i].y)],
			value: [0, 0, Number(data[i].value),data[i].featureid,data[i].layerid]
			});
		if (res[i].value[2] > maxvalue) maxvalue = res[i].value[2];
		if (res[i].value[2] < minvalue) minvalue = res[i].value[2];
	}
	var item = {
		name: layer.layername,
		type: 'scatter',
		coordinateSystem: 'geo',
		data: res,
		z: layer.zIndex,
		symbol: 'circle',
		symbolSize: function (val, param) {
			return (val[2] - minvalue) / (maxvalue - minvalue) * (maxsize - minsize) + minsize;
		},
		label: {
			normal: {
				formatter: '{b}',
				position: 'right',
				show: false
			},
			emphasis: {
				textStyle: {
					fontStyle: 'normal',
					fontWeight: 'bold	',
					fontFamily: 'sans-serif',
					fontSize: 15,
				},
				show: true
			}
		},
		itemStyle: {
			normal: {
				color: function (param) {
					var maxrgb = HexToColorArray(maxcolor);
					var minrgb = HexToColorArray(mincolor);
					var dvalue = (param.value[2] - minvalue) / (maxvalue - minvalue);
					var dr = parseInt(dvalue * (maxrgb.r - minrgb.r));
					var dg = parseInt(dvalue * (maxrgb.g - minrgb.g));
					var db = parseInt(dvalue * (maxrgb.b - minrgb.b));
					var dycolor = {
						r: minrgb.r + dr,
						g: minrgb.g + dg,
						b: minrgb.b + db
					};
					return ColorArrayToHex(dycolor);
				}
			},
			emphasis: {
				color: '#333399'
			}
		}
	}
	var avgDis = getAverageDistance(res);
	myMapMana.maplayerlist[layerindex].style = {
		series: item, append: {
			max: maxvalue,
			min: minvalue,
			maxSize: maxsize,
			minSize: minsize,
			maxColor: maxcolor,
			minColor: mincolor,
			mapperType: mappertype,
			avgDis: avgDis
		}
	};
	return item;
}
function drawL2(layer, layerindex) {//点图 （打算后面全用mapv重构
	if (has(myMapMana.maplayerlist[layerindex].style)) {
		//同步zIndex值之后重绘
		//对已有style做修改后没反应就在此重设
		//回调函数必须在此重设
		myMapMana.maplayerlist[layerindex].style.series.z = myMapMana.maplayerlist[layerindex].zIndex;
		return myMapMana.maplayerlist[layerindex].style.series;
	}
	var data = layer.data;
	var res = [];
	for (var i = 0; i < data.length; i++) {
		res.push({
			name: data[i].name,
			lonlat:[Number(data[i].x), Number(data[i].y)],
			value: [0, 0, data[i].value,data[i].featureid,data[i].layerid]
		});
	}
	var item = {
		name: layer.layername,
		type: 'scatter',
		coordinateSystem: 'geo',
		data: res,
		z: layer.zIndex,
		symbol: 'circle',
		symbolSize: 5,
		label: {
			normal: {
				formatter: '{b}',
				position: 'right',
				show: false
			},
			emphasis: {
				formatter: '{b}',
				textStyle: {
					fontStyle: 'normal',
					fontWeight: 'bold	',
					fontFamily: 'sans-serif',
					fontSize: 15,
				},
				show: true
			}
		},
		itemStyle: {
			normal: {
				color: '#5376EE'
			},
			emphasis: {
				color: '#333399'
			}
		}
	}
	var avgDis = getAverageDistance(res);
	myMapMana.maplayerlist[layerindex].style = 
	{series: item, append: {
		avgDis: avgDis
	}
};
	return item;
}
function drawL3(layer, layerindex) {//轨迹图 （打算后面全用mapv重构
	if (has(myMapMana.maplayerlist[layerindex].style)) {
		//同步zIndex值之后重绘
		//对已有style做修改后没反应就在此重设
		//回调函数必须在此重设
		myMapMana.maplayerlist[layerindex].style.z = myMapMana.maplayerlist[layerindex].zIndex;
		return myMapMana.maplayerlist[layerindex].style;
	}
	var data = layer.data;
	var res = [];
	//TODO 完善线图层的多字段处理
	for (var i = 0; i < data.length; i++) {
		res.push({
			ID: data[i].name,
			lonlat:$.parseJSON(data[i].linegeom),
			coords: [[0,0],[0,0]],
			value:[data[i].value,data[i].featureid,data[i].layerid]
		});
	}
	var item =
		{
			name: layer.layername,
			type: 'lines',
			coordinateSystem: 'geo',
			z: layer.zIndex,
			large: true,
			effect: {
				show: false,
				constantSpeed: 10,
				symbol: 'pin',//ECharts 提供的标记类型包括 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
				symbolSize: 6,
				trailLength: 0,
				color: '#eee955'
			},
			lineStyle: {
				normal: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#eee955' }, { offset: 1, color: '#f6082d' }], false),   //轨迹线颜色
					width: 1.5,
					opacity: 1,
					curveness: 0  //轨迹线弯曲度
				}
			},
			data: res
		}
	myMapMana.maplayerlist[layerindex].style = item;
	return item;
}
function redrawLegend()
{
	var legendContent="<strong>图例</strong></br>";
	for(var i=0;i<myMapMana.maplayerlist.length;i++)
	{
		if(myMapMana.maplayerlist[i]==null) continue;
		var layer = myMapMana.maplayerlist[i];
		if(!layer.state) continue;
		var layerType = layer.type;
		switch(layerType)
		{
		case 0://分层设色图
			legendContent+=layer.layername+'</br>';
			var styleInfo = layer.style.options;
			var colorlen = styleInfo.splitList.length;
			var maxcolor = styleInfo.splitList[colorlen-1].value;
			var mincolor = styleInfo.splitList[0].value;
			var maxval = styleInfo.max;
			var minval = styleInfo.min;
			legendContent+='<div class="block"></div><div class="rectangle" style="background-color:'+maxcolor+'"></div>';
			legendContent+='&emsp;'+maxval+'</br>';
			legendContent+='<div class="block"></div><div class="rectangle" style="background-color:'+mincolor+'"></div>';
			legendContent+='&emsp;'+minval+'</br>';
			break;
		case 1://等级符号图
			legendContent+=layer.layername+'</br>';
			var styleInfo = layer.style.append;
			var maxcolor = styleInfo.maxColor;
			var mincolor = styleInfo.minColor;
			var maxval = styleInfo.max;
			var minval = styleInfo.min;
			var symbol = layer.style.series.symbol;
			if(symbol=="arrow" || symbol=="triangle"){
				legendContent+='<div class="block"></div><div class="'+layer.style.series.symbol+'" style="border-bottom:10px solid '+maxcolor+'"></div>';
				legendContent+='&emsp;'+maxval+'</br>';
				legendContent+='<div class="block"></div><div class="'+layer.style.series.symbol+'" style="border-bottom:10px solid '+mincolor+'"></div>';
				legendContent+='&emsp;'+minval+'</br>';
			}
			else{
				legendContent+='<div class="block"></div><div class="'+layer.style.series.symbol+'" style="background-color:'+maxcolor+'"></div>';
				legendContent+='&emsp;'+maxval+'</br>';
				legendContent+='<div class="block"></div><div class="'+layer.style.series.symbol+'" style="background-color:'+mincolor+'"></div>';
				legendContent+='&emsp;'+minval+'</br>';
			}
			break;
		case 2://点图
			var pointcolor = layer.style.series.itemStyle.normal.color;
			var symbol = layer.style.series.symbol;
			if(symbol=="arrow" || symbol=="triangle")
				legendContent+='<div class="'+layer.style.series.symbol+'" style="border-bottom:10px solid '+pointcolor+'"></div>';
			else
				legendContent+='<div class="'+layer.style.series.symbol+'" style="background-color:'+pointcolor+'"></div>';
			legendContent+='&emsp;'+layer.layername+'</br>';
			break;
		case 3://轨迹图
			var colors = layer.style.lineStyle.normal.color.colorStops;
			var begincolor = colors[0].color;
			var endcolor = colors[1].color;
			legendContent+='<div class="line" style="background: linear-gradient(to right, '+begincolor+' , '+endcolor+')"></div>';
			legendContent+='&emsp;'+layer.layername+'</br>';
			break;
		}
	}
	$('#mylegend').html(legendContent);
	$('#mylegend').css("display","inline");
}


var tooltipPub = {
	flag: 0,
	nowIndex:0
}
function display() {
	echartsoption = {
		tooltip: {
			trigger: 'none'
		},
		geo:{}
		,
		//		    visualMap:{type: 'continuous',
		//	            min: 0,
		//	            max: 40,
		//	            bottom: 50,
		//	            calculable: true,
		//	            inRange: {
		//	                color: ['#50a3ba', '#eac736', '#d94e5d'],
		//	                symbolSize: [1, 30]
		//	            },
		//	            textStyle: {
		//	                color: '#44e'
		//	            }},
		series: []
	};
	
	mymap =  new ol.Map({
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
              collapsible: false
            })
          }).extend([
        	  new ol.control.ScaleLine({units:'metric'})
          ]),view: new ol.View({
            center: ol.proj.fromLonLat([myMapMana.centerx, myMapMana.centery]),
            zoom:myMapMana.zoomlevel
            }),
            target: 'map',
        	logo : false
        });
	// 天地图
	tianditu_road_layer = new ol.layer.Tile({
        title: "天地图路网",
        source: new ol.source.XYZ({
            url: "http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}"
        })
    });
    tianditu_annotation = new ol.layer.Tile({
        title: "天地图文字标注",
        source: new ol.source.XYZ({
        url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}'
        })
    });
    // 天地图影像
    tianditu_image_layer = new ol.layer.Tile({
        title: "天地图影像",
        source: new ol.source.XYZ({
            url: "http://t4.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}"
        })
    });
    tianditu_image_annotation = new ol.layer.Tile({
        title: "天地图影像文字标注",
        source: new ol.source.XYZ({
            url: "http://t4.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}"
        })
    });
    // 清代
    qing_layer = new ol.layer.Vector({
    	source: new ol.source.Vector({
    		url: "./geoJson/new_qing_prov.json",
    		format: new ol.format.GeoJSON()
    	})
    });
    // 元代
    yuan_layer = new ol.layer.Vector({
    	source: new ol.source.Vector({
    		url: "./geoJson/yuan_t.json",
    		format: new ol.format.GeoJSON()
    	})
    });
    
    //local google
/*	var google_source = new ol.source.XYZ({
		url : 'http://202.121.180.132/TerrainWithLabel/{z}/{x}/{y}.jpg'
	});
	var google_layer = new ol.layer.Tile({
		name : "google_layer",
		chName : "谷歌地图",
		source : google_source
	});
	mymap.addLayer(google_layer);*/

    mymap.once('postrender', function (e) {
        if (myecharts !== undefined)
            return;
        myecharts = new OpenLayer3Ext(mymap, echarts);
        var container = myecharts.getEchartsContainer();
        var mec = myecharts.initECharts(container);
        window.onresize = myecharts.resize;
        myecharts.setOption(echartsoption,true);
		myecharts.bindEvent();
		mec.on('mouseover', function (params) {
			tooltipPub.flag = 1;
			var tooltipHtml="";
			var data = params.value;
			var len = params.value.length;
			switch(params.seriesType){
				case "lines":
					tooltipHtml = params.seriesName+':'+data[len-3];
					break;
				case "scatter":
					tooltipHtml = params.seriesName+':'+params.name+','+data[len-3];
			}
			$("#mytooltip").html(tooltipHtml);
			$("#mytooltip").css("top", (mousePos.y - 40) + "px");
			$("#mytooltip").css("left", (mousePos.x + 10) + "px");
			$("#mytooltip").css("display", "inline");
		});
		mec.on('mouseout', function (params) {
			tooltipPub.flag = 0;
			$("#mytooltip").css("display", "none");
		});
		mec.on('click', function (params) {
			$('#QueryBoard').window({
			    shadow:false
			});
			$('#QueryBoard').window('open');
			var html="<thead><tr><th>ID</th><th>图层</th><th>地名</th><th>基本数值</th></tr></thead>";
			var count=0;
			html+="<tbody>";
			for(var i = 0 ; i< params.length;i++)
			{
				html+="<tr class='rows'>";
				var len = params[i].value.length;
				html+="<td class='ID'>"+params[i].value[len-1]+","+params[i].value[len-2]+"</td>";
				html+="<td>"+params[i].seriesName+"</td>";
				html+="<td>"+params[i].name+"</td>";
				html+="<td>"+params[i].value[len-3]+"</td>";
				html+="</tr>";				
			}
			html=html+'</tbody>'
			html=html+'<strong>记录数：</strong>'+count+'条';
			$('#QueryBoard').find('#res').html(html);
			$('#QueryBoard').window('center');
			$('.rows').click(function(){
				var id = $(this).find('.ID').html();
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
		});
		var featureOverlay = new ol.layer.Vector({
	        source: new ol.source.Vector(),
	        map: mymap,
	        style: new ol.style.Style({
	          stroke: new ol.style.Stroke({
	            color: '#f00',
	            width: 1
	          }),
	          fill: new ol.style.Fill({
	            color: 'rgba(255,0,0,0.1)'
	          })
	        })
	      });

	      var highlight;
	      var displayFeatureInfo = function(pixel) {

	        var feature = mymap.forEachFeatureAtPixel(pixel, function(feature) {
	          return feature;
	        });
	        var flag = 0;
	        if(feature){
	        	flag = 1;
	        	if (tooltipPub.flag == 0) {
	        		$("#mytooltip").html(feature.values_.name);
	        		$("#mytooltip").css("top", (mousePos.y - 40) + "px");
	        		$("#mytooltip").css("left", (mousePos.x + 10) + "px");
	        		$("#mytooltip").css("display", "inline");
	        	}
	        }
	        if (flag == 0) { $("#mytooltip").css("display", "none"); return;}
	        
	        if (feature !== highlight) {
	          if (highlight) {
	            featureOverlay.getSource().removeFeature(highlight);
	          }
	          if (feature) {
	            featureOverlay.getSource().addFeature(feature);
	          }
	          highlight = feature;
	        }

	      };

	      mymap.on('pointermove', function(evt) {
	        if (evt.dragging) {
	          return;
	        }
	        var pixel = mymap.getEventPixel(evt.originalEvent);
	        displayFeatureInfo(pixel);
	      });

	      mymap.on('click', function(evt) {
	        displayFeatureInfo(evt.pixel);
	      });
		redraw();
    });
    
}
//保存数据的结构 
function Icelayer(YKlayer) {
	this.mlid = YKlayer.mlid;
	this.layerid = YKlayer.layerid;
	this.state = YKlayer.state;
	//TODO 拆分style为具体设定
	this.style = JSON.stringify(YKlayer.style);
	this.zIndex = YKlayer.zIndex;
}
function Icemap(YKmap) {
	var mapstyle = {
		centerx: YKmap.centerx,
		centery: YKmap.centery,
		zoomlevel: YKmap.zoomlevel,
		mapmode: YKmap.mapmode
	}
	this.id = YKmap.mapid;
	this.userid = YKmap.mapuserid;
	this.mapname = YKmap.mapname;
	this.accessibility = YKmap.mapaccess;
	this.mapstyle = JSON.stringify(mapstyle);
	this.maptype = YKmap.maptype;
	this.basemapid = YKmap.basemapid;
}

function savemap() {
	var userid;
	$.ajax({
		url: "./getActiveUser.action",
		async: false,
		type: "POST",
		dataType: "text",
		data: {
		},success: function (result) {
			userid = $.parseJSON(result).userid;
		}});
	if(userid==0) {
		$('#alertModalLabel').html('<strong>错误提示</strong>');
		$('#alertMessage').html('请先登录或注册再保存地图');
		$('#alertModal').modal('show');
		return;
	}
	if(userid!=myMapMana.mapuserid) 
		{
		myMapMana.mapid=0;
		myMapMana.mapuserid=userid;
		for(var i=0;i<myMapMana.maplayerlist.length;i++)
			{
			myMapMana.maplayerlist[i].mlid=0;
			}
		}
	var center3857 = mymap.getView().getCenter();
	var centerPoint = ol.proj.toLonLat(center3857);
	myMapMana.centerx = centerPoint[0];
	myMapMana.centery = centerPoint[1];
	myMapMana.zoomlevel = mymap.getView().getZoom();
	//var mapmodeString = mymap.getMapType().getName();
	//if (mapmodeString == "地图")
		myMapMana.mapmode = 0;
	//else
		//myMapMana.mapmode = 1;
	myMapMana.basemapid = parseInt($("#baseMapTree").tree('getSelected').id);
	var layerForSave = new Array();
	layerForSave = [];
	var newindex = 0;
	var layerTreeForSave = layerTreeJson;
	for (var i = 0; i < myMapMana.maplayerlist.length; i++) {
		if(null==myMapMana.maplayerlist[i]) continue;
		var temp = new Icelayer(myMapMana.maplayerlist[i]);
		layerForSave.push(temp);
		
		function update(node){
			if(node.index==i) node.index=newindex;
		}
		travelTree(layerTreeForSave,update);
		newindex++;
	}
	var mapForSave = new Icemap(myMapMana);
	mapForSave.layertree = JSON.stringify(layerTreeForSave);
	$.ajax({
		url: "./savemap.action",
		async: false,
		type: "POST",
		dataType: "text",
		data: {
			map: JSON.stringify(mapForSave),
			maplayer: JSON.stringify(layerForSave)
		},
		success: function (result) {
			$('#alertModalLabel').html('<strong>提示</strong>');
			if(parseInt(result)>0){
				myMapMana.mapid=parseInt(result);//更新新建的地图的ID
				$('#alertMessage').html('保存成功！');
				$('#alertModal').modal('show');
			}
			else
			{
				myMapMana.mapid=parseInt(result);//更新新建的地图的ID
				$('#alertMessage').html('保存失败！');
				$('#alertModal').modal('show');
			}
		}
	})
	
}
