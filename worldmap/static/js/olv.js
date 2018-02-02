/**
     * 构造函数
     *
     * @param {String|HTMLElement|ol.Map} obj
     * @param {String} geoJsonUrl
     * @param {Array} dataset
     * @param {options} setting
     * @constructor
     */
function OlvLayer(map,geoJson,data,options,layerid){
        this._map = map;
        this.dataSet = data.get(); 
        this._geoJson = geoJson;
        this.options = options;
        this.layerid = String(layerid);
        this._init(); 
    }
OlvLayer.prototype._map = null;
OlvLayer.prototype._layer = null;
OlvLayer.prototype._geoJson = null;
OlvLayer.prototype.layerid = null;
/* dataset */
OlvLayer.prototype.dataSet = null;
OlvLayer.prototype.options = null;
OlvLayer.prototype.style =  function(features){
        var name = features.values_.name;
        var color = null;
        var id = parseInt(this.getAttributions()[0].getHTML());
        var colorSet = myMapMana.maplayerlist[id].style.options;
        var dataSet = myMapMana.maplayerlist[id].style.dataSet.get();
        var highlight = colorSet.highlight;
        var splitList = colorSet.splitList;
        for(var i=0;i<dataSet.length;i++)
        	{
        		var item = dataSet[i];
        		if(name === item.name)
        		{
        			color = splitList[0].value;
        			var count = item.count;
        			for(var j=1;j<splitList.length-1;j++)
        			{
        				if (count<splitList[j].end) 
        					{color = splitList[j].value;break;}
        			}        				
        			if(count>=splitList[splitList.length-1].start) color = splitList[splitList.length-1].value;
        			break;
        		}
        	}
        return new ol.style.Style({
                fill: new ol.style.Fill({
                  color: color
                	}),
                stroke: new ol.style.Stroke({
                  color: highlight,
                  width: 1
                	})/*, 效果不是很理想 也找不到通过这个的函数回调的文本设置方案 
                text: new ol.style.Text({
                	text:name
                    })*/
        		});
    return stylefuntion;
};
/* clone array a To b */
OlvLayer.prototype.clone = function(a){
    b = new Array();
    for(var i=0;i<a.length;i++)
        {
            b.push(a[i]);
        }
    return b;
}
OlvLayer.prototype._init = function(){
    this._layer = new ol.layer.Image({
            source: new ol.source.ImageVector({
            	attributions:this.layerid, 
            	source: new ol.source.Vector({
                
            	url: this._geoJson,
                format: new ol.format.GeoJSON()
              }),
              style: this.style
            }
            )
    });
    
    this._map.addLayer(this._layer);

}
OlvLayer.prototype.refresh = function(){
	
	this._layer.getSource().setStyle(this.style);
	
};
OlvLayer.prototype.hide = function(){
	this._layer.setVisible(false);
}
OlvLayer.prototype.show = function(){
	this._layer.setVisible(true);
}


