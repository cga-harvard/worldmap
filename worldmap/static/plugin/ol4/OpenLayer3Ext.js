/**
 * echarts 百度地图扩展，必须在echarts初始化前使用
 *
 * @desc echarts基于Canvas，纯Javascript图表库，提供直观，生动，可交互，可个性化定制的数据统计图表。
 * @author Neil (杨骥, 511415343@qq.com)
 */
//define(function (require) {

    /**
     * 构造函数
     *
     * @param {String|HTMLElement|ol.Map} obj
     * @param {echarts} ec
     * @constructor
     */
    function OpenLayer3Ext(map,ec) {
        this._map=map;
        var size = map.getSize();
        var div = this._echartsContainer = document.createElement('div');
        div.style.position = 'absolute';
        div.style.height = size[1] + 'px';
        div.style.width = size[0] + 'px';
        div.style.top = 0;
        div.style.left = 0;
        map.getViewport().appendChild(div);
        this._init(map,ec);
    };

    /**
     * echarts 容器元素
     *
     * @type {HTMLElement}
     * @private
     */
    OpenLayer3Ext.prototype._echartsContainer = null;

    /**
     * ol地图实例
     *
     * @type {BMap.Map}
     * @private
     */
    OpenLayer3Ext.prototype._map = null;

    /**
     * 使用的echarts实例
     *
     * @type {ECharts}
     * @private
     */
    OpenLayer3Ext.prototype._ec = null;

    /**
     * geoCoord
     *
     * @type {Object}
     * @private
     */
    OpenLayer3Ext.prototype._geoCoord = [];

    /**
     * 记录地图的偏移
     *
     * @type {Array.<number>}
     * @private
     */
    OpenLayer3Ext.prototype._mapOffset = [0, 0];


    /**
     * 初始化方法
     *
     * @param {String|HTMLElement|ol.Map} obj
     * @param {BMap} BMap
     * @param {echarts} ec
     * @private
     */
    OpenLayer3Ext.prototype._init = function (map,ec) {
        var self = this;
        self._map = map;

        /**
         * 获取echarts容器
         *
         * @return {HTMLElement}
         * @public
         */
        self.getEchartsContainer = function () {
            return self._echartsContainer;
        };

        /**
         * 获取map实例
         *
         * @return {BMap.Map}
         * @public
         */
        self.getMap = function () {
            return self._map;
        }



        /**
         * 经纬度转换为屏幕像素
         *
         * @param {Array.<number>} geoCoord  经纬度
         * @return {Array.<number>}
         * @public
         */
        self.geoCoord2Pixel = function (geoCoord) {
            return self._map.getPixelFromCoordinate(ol.proj.fromLonLat(geoCoord));
        };

        /**
         * 屏幕像素转换为经纬度
         *
         * @param {Array.<number>} pixel  像素坐标
         * @return {Array.<number>}
         * @public
         */
        self.pixel2GeoCoord = function (pixel) {
            return self._map.getCoordinateFromPixel(pixel);

        };

        /**
         * 初始化echarts实例
         *
         * @return {ECharts}
         * @public
         */
        self.initECharts = function () {
            self._ec = ec.init.apply(self, arguments);
            
            return self._ec;
        };

		self.bindEvent = function () {
            self._bindEvent();
        };
        
        /**
         * 获取ECharts实例
         *
         * @return {ECharts}
         * @public
         */
        self.getECharts = function () {
            return self._ec;
        };

        /**
         * 获取地图的偏移量
         *
         * @return {Array.<number>}
         * @public
         */
        self.getMapOffset = function () {
            return self._mapOffset;
        };

        /**
         * 对echarts的setOption加一次处理
         * 用来为markPoint、markLine中添加x、y坐标，需要name与geoCoord对应
         *
         * @param {Object}
         * @public
         */
        self.setOption = function (option, notMerge) {
            var series = option.series || {};
			for(var i=0;i<series.length;i++){
            var data=series[i].data;
            var heatData=[];
            for (var k = 0, len = data.length; k < len; k++){
                var d=data[k];
            if(d.coords)
            	{
            	var scrPt0 = self._map.getPixelFromCoordinate(ol.proj.fromLonLat([d.lonlat[0][0], d.lonlat[0][1]])); 
            	var scrPt1 = self._map.getPixelFromCoordinate(ol.proj.fromLonLat([d.lonlat[1][0], d.lonlat[1][1]])); 
                
            	var x0 = scrPt0[0],  
                    y0 = scrPt0[1],
                    x1 = scrPt1[0],  
                    y1 = scrPt1[1];
					d.coords = [[x0,y0],[x1,y1]];
                heatData.push(d);  
            }
            else if(d.value){
			var scrPt = self._map.getPixelFromCoordinate(ol.proj.fromLonLat([d.lonlat[0], d.lonlat[1]])); 
                var x = scrPt[0],  
                    y = scrPt[1];
					d.value[0] = x;
					d.value[1] = y;
                heatData.push(d);  
            }
            	
            } 
            series[i].data=heatData;
			}
			var newoption = option;
			newoption.series = series;
            self._ec.setOption(newoption, notMerge);
        }

        /**
         * 绑定地图事件的处理方法
         *
         * @private
         */
        self._bindEvent = function () {
            //self._map.getView().on('change:resolution', _zoomChangeHandler('zoom'));
            self._map.getView().on('change:center', _moveHandler('moving'));
            self._map.on('moveend', _moveHandler('moveend'));
            self._ec.getZr().on('dragstart', _dragZrenderHandler(true));
            self._ec.getZr().on('dragend', _dragZrenderHandler(false));
        }

        /**
         * 地图缩放触发事件
         *
         * @private
         */
        function _zoomChangeHandler(type) {
            _fireEvent(type);
        }

        /**
         * 地图移动、如拖拽触发事件
         *
         * @param {string} type moving | moveend  移动中|移动结束
         * @return {Function}
         * @private
         */
        
        function _moveHandler(type) {
            return function (e) {

                _fireEvent(type);
            }
        }

        /**
         * Zrender拖拽触发事件
         *
         * @param {boolean} isStart
         * @return {Function}
         * @private
         */
        function _dragZrenderHandler(isStart) {
            return function () {
                self._map.dragging = isStart;
            }
        }

        /**
         * 触发事件
         *
         * @param {stirng}  type 事件类型
         * @private
         */
        function _fireEvent(type) {
            var func = self['on' + type];
            if (func) {
                func();
            } else {
                self.refresh();
            }
        }
		
		self.onmoving = function () {
           self.refreshLazy();
		 //这里可以做一些优化 搞几种刷新模式
		 //要像bmap那样平滑的话 果然还是要实现上面的_moveHandler 这个里面完全取不到偏移量嘛…… 感觉可以用其提供的坐标来反算屏上像素偏移
        };
		self.onmoveend = function () {
            self.refresh();
        };
        /**
         * 刷新页面
         *
         * @public
         */
        self.oldoption=null;
        
        self.refresh = function () {
            if (self._ec) {
            	var option;
            	if(self.oldoption!=null){
                option = self.oldoption;
                self.oldoption=null;}
            	else
            		{
            			option=self._ec.getOption();
            		}
                var component = self._ec.component || {};

                var dataRange = component.dataRange;

                if (dataRange) {
                    option.dataRange.range = dataRange._range;
                }
                self.setOption(option);
            }
        };
        self.refreshLazy = function () {
            if (self._ec) {
            	if(self.oldoption!=null) return;
            	if(self.oldoption==null){self.oldoption=self._ec.getOption();
                
                var component = self._ec.component || {};

                var dataRange = component.dataRange;

                if (dataRange) {
                    option.dataRange.range = dataRange._range;
                }
                self._ec.clear();
                //self.setOption(option);
                }
            }
        };
        return OpenLayer3Ext;
    }
//});