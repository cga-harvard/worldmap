//这份是配合openlayers的版本
function bgsearch() {
    autoComplete.deleteDIV();
    if(has(autoComplete.select))
    match(autoComplete.select);
    else 
    match({name:autoComplete.obj.value,type:'all'});
}
function match(info) {//查询所需要的信息匹配 并且返回结果选框
    var infoType = info.type;
    var infoKey = info.name;
    var resultSet = new Array();
    try { var reg = new RegExp("(" + infoKey + ")", "i"); }
            catch (e) { return; }
    //————————————————————switchBegin
    switch (infoType) {
        case "图层":
            {
                var index = info.index;
                var type = myMapMana.maplayerlist[index].type;
                switch (type) {
                    case 0:
                        var data = myMapMana.maplayerlist[index].style.dataSet.get();
                        for (var i = 0; i < data.length; i++) {
                            var temp = {
                                layername: infoKey,
                                name: data[i].name,
                                count: data[i].count,
                                type: '面',
                                index: { layer: index, feature: i }
                            }
                            resultSet.push(temp);
                        }
                        break;
                    case 1:
                        var data = myMapMana.maplayerlist[index].style.series.data;
                        for (var i = 0; i < data.length; i++) {
                            var temp = {
                                layername: infoKey,
                                name: data[i].name,
                                count: data[i].value[2],
                                type: '点',
                                index: { layer: index, feature: i }
                            }
                            resultSet.push(temp);
                        }
                        break;
                    case 2:

                            var data = myMapMana.maplayerlist[index].style.series.data;
                   
                        for (var i = 0; i < data.length; i++) {
                            var temp = {
                                layername: infoKey,
                                name: data[i].name,
                                count: data[i].value[2],
                                type: '点',
                                index: { layer: index, feature: i }
                            }
                            resultSet.push(temp);
                        }
                        break;
                    case 3:
                        var data = myMapMana.maplayerlist[index].style.data;
                        for (var i = 0; i < data.length; i++) {
                            var temp = {
                                layername: infoKey,
                                name: data.ID,
                                count: data.coords,
                                type: '线',
                                index: { layer: index, feature: i }
                            }
                            resultSet.push(temp);
                        }
                        break;
                }
                break;
            }
        case "all":
        case "地名":
            {
                for (var j = 0; j < myMapMana.maplayerlist.length; j++) {
                    if(null==myMapMana.maplayerlist[j]) continue;
                	var type = myMapMana.maplayerlist[j].type;
                    var layername = myMapMana.maplayerlist[j].layername;
                    switch (type) {
                        case 0:
                            var data = myMapMana.maplayerlist[j].style.dataSet.get();
                            for (var i = 0; i < data.length; i++) {
                                if (reg.test(data[i].name)) {
                                    var temp = {
                                        layername: layername,
                                        name: data[i].name,
                                        count: data[i].count,
                                        type: '面',
                                        index: { layer: j, feature: i }
                                    }
                                    resultSet.push(temp);
                                }
                            }
                            break;
                        case 1:
                        	var data = myMapMana.maplayerlist[j].style.series.data;
                            for (var i = 0; i < data.length; i++) {
                            	if (reg.test(data[i].name)) {
                            		var temp = {
                                		layername: layername,
                                    	name: data[i].name,
                                    	count: data[i].value[2],
                                    	type: '点',
                                    	index: { layer: j, feature: i }
                                	}
                                	resultSet.push(temp);
                            	}
                            }
                            break;
                        case 2:

                                var data = myMapMana.maplayerlist[j].style.series.data;
                    
                            for (var i = 0; i < data.length; i++) {
                                if (reg.test(data[i].name)) {
                                    var temp = {
                                        layername: layername,
                                        name: data[i].name,
                                        count:data[i].value[2],
                                        type: '点',
                                        index: { layer: j, feature: i }
                                    }
                                    resultSet.push(temp);
                                }
                            }
                            break;
                        case 3:
                            var data = myMapMana.maplayerlist[j].style.data;
                            for (var i = 0; i < data.length; i++) {
                                if (reg.test(data[i].ID)) {
                                    var temp = {
                                        layername: layername,
                                        name: data[i].ID,
                                        count: data[i].coords,
                                        type: '线',
                                        index: { layer: j, feature: i }
                                    }
                                    resultSet.push(temp);
                                }
                            }
                            break;
                    }
                }
                if(!infoType=="all") break;
            }
        case "数据":
            {

                for (var j = 0; j < myMapMana.maplayerlist.length; j++) {
                	if(null==myMapMana.maplayerlist[j]) continue;
                    var type = myMapMana.maplayerlist[j].type;
                    var layername = myMapMana.maplayerlist[j].layername;
                    switch (type) {
                        case 2:
                            var data = myMapMana.maplayerlist[j].style.series.data;
                            for (var i = 0; i < data.length; i++) {
                                if (reg.test(data[i].value[2])) {
                                    var temp = {
                                        layername: layername,
                                        name: data[i].name,
                                        count: data[i].value[2],
                                        type: '点',
                                        index: { layer: j, feature: i }
                                    }
                                    resultSet.push(temp);
                                }
                            }
                            break;
                        case 3:
                            if(infoType=="all") break;
                            var data = myMapMana.maplayerlist[j].style.data;
                            for (var i = 0; i < data.length; i++) {
                                if (reg.test(data[i].ID)) {
                                    var temp = {
                                        layername: layername,
                                        name: data[i].ID,
                                        count: data[i].coords,
                                        type: '线',
                                        index: { layer: j, feature: i }
                                    }
                                    resultSet.push(temp);
                                }
                            }
                            break;
                    }
                }
                break;
            }
    }
    //————————————————————switchEnd
    showResultPanel(resultSet);
}

var autoComplete;
function getLayerStringDataArr() { //这里有好多可以增加的内容 比如说多字段查询 不过其实我觉得前端实现还是太勉强 而且后面还涉及数据保密的事情
    var resultArr = new Array();
    for (var i = 0; i < myMapMana.maplayerlist.length; i++) {//获取地图的所有文字信息
        var layer = myMapMana.maplayerlist[i];
        if(null==layer) continue;
        if (!layer.state) continue;
        resultArr.push({ name: layer.layername, type: "图层", index: i });
        switch (layer.type) {
            case 0:
                {
                    var data = layer.style.dataSet;
                    for (var j = 0; j < data.length; j++) {
                        resultArr.push({ name: data[j].name, type: "地名" });
                    }
                    break;
                }
            case 1:
                {
                    var data = layer.style.series.data;
                    for (var j = 0; j < data.length; j++) {
                        resultArr.push({ name: data[j].name, type: "地名" });
                        
                    }
                    break;
                }
            case 2:
                {
                    var data = layer.style.series.data;
                    for (var j = 0; j < data.length; j++) {
                        resultArr.push({ name: data[j].name, type: "地名" });
                      
                        	resultArr.push({ name: data[j].value[2], type: "数据" });
                      
                    }
                    break;
                }
            case 3:
                {
                    var data = layer.style.data;
                    for (var j = 0; j < data.length; j++) {
                        resultArr.push({ name: data[j].ID, type: "路径名" });
                    }
                    break;
                }
        }
    }
    return resultArr;
}
Array.prototype.has = function (obj, equalFunc) {
    var myEqual = function (a, b) { if (a == b) return true; else return false; }
    if (has(equalFunc)) myEqual = equalFunc;
    for (var i = 0; i < this.length; i++) {
        if (myEqual(this[i], obj)) return true;
    }
    return false;
}
function resultEqual(a, b) {
    if (a.name == b.name && a.type == b.type) return true;
    else return false;
}
function createAutoComplete() {
    var inputValue = getLayerStringDataArr();
    if (!autoComplete) {
        autoComplete = new AutoComplete('p_apiName', 'auto', inputValue);//第一个参数是输入框id，第二个是下拉显示的id，第三个是获取的全部数据。  
    }
}
function AutoComplete(obj, autoObj, arr) {
    this.obj = document.getElementById(obj);        //输入框  
    this.autoObj = document.getElementById(autoObj);//DIV的根节点  
    this.value_arr = arr;        //不要包含重复值  
    this.index = -1;          //当前选中的DIV的索引  
    this.search_value = "";   //保存当前搜索的字符 
    this.select = null;
    this.count = 0;
}
AutoComplete.prototype = {
    setArr: function (newArr) {
        this.value_arr = newArr;
    },
    init: function () {
        this.autoObj.style.left = this.obj.offsetLeft + "px";
        this.autoObj.style.top = this.obj.offsetTop + this.obj.offsetHeight + "px";
        this.autoObj.style.width = this.obj.offsetWidth - 2 + "px";//减去边框的长度2px     
    },
    //删除自动完成需要的所有DIV  
    deleteDIV: function () {
        while (this.autoObj.hasChildNodes()) {
            this.autoObj.removeChild(this.autoObj.firstChild);
        }
        this.autoObj.className = "auto_hidden";
    },
    //设置值  
    setValue: function (_this, result) {
        return function () {
            _this.select = result;
            _this.obj.value = this.seq;
            _this.autoObj.className = "auto_hidden";
        }
    },
    //模拟鼠标移动至DIV时，DIV高亮  
    autoOnmouseover: function (_this, _div_index) {
        return function () {
            _this.index = _div_index;
            var length = _this.autoObj.children.length;
            for (var j = 0; j < length; j++) {
                if (j != _this.index) {
                    _this.autoObj.childNodes[j].className = 'auto_onmouseout';
                } else {
                    _this.autoObj.childNodes[j].className = 'auto_onmouseover';
                    _this.obj.value=this.seq;  
                }
            }
        }
    },
    //更改classname  
    changeClassname: function (length) {
        for (var i = 0; i < length; i++) {
            if (i != this.index) {
                this.autoObj.childNodes[i].className = 'auto_onmouseout';
            } else {
                this.autoObj.childNodes[i].className = 'auto_onmouseover';
                this.obj.value = this.autoObj.childNodes[i].seq;
            }
        }
    }
    ,
    //响应键盘  
    pressKey: function (event) {
        var length = this.autoObj.children.length;
        if(length>20) length=20;
        //光标键"↓"  
        if (event.keyCode == 40) {
            ++this.index;
            if (this.index > length) {
                this.index = 0;
            } else if (this.index == length) {
                this.obj.value = this.search_value;
            }
            this.changeClassname(length);
        }
        //光标键"↑"  
        else if (event.keyCode == 38) {
            this.index--;
            if (this.index < -1) {
                this.index = length - 1;
            } else if (this.index == -1) {
                this.obj.value = this.search_value;
            }
            this.changeClassname(length);
        }
        //回车键  
        else if (event.keyCode == 13) {
            this.autoObj.children[this.index].onclick();
            this.autoObj.className = "auto_hidden";
            
            this.index = -1;
        } else {
            this.index = -1;
        }
    },
    //程序入口  
    start: function (event) {
        if (event.keyCode != 13 && event.keyCode != 38 && event.keyCode != 40) {
            this.init();
            this.deleteDIV();
            this.select = null;
            this.count = 0;
            this.search_value = this.obj.value;
            var valueArr = this.value_arr;
            valueArr.sort(
                function (a, b) {
                    if (a.name > b.name) return 1;
                    else if (a.name < b.name) return -1;
                    else return 0;
                }
            );
            if (this.obj.value.replace(/(^\s*)|(\s*$)/g, '') == "") { return; }//值为空，退出
            try { var reg1 = new RegExp("^" + this.obj.value, "i"); }
            catch (e) { return; }
            try { var reg2 = new RegExp("(" + this.obj.value + ")", "i"); }
            catch (e) { return; }
            var div_index = 0;//记录创建的DIV的索引
            var tempArr = new Array();
            var deleteIndex = new Array();
            var terminateFlag = true;
            //这段需要函数化重构
            for (var i = 0; i < valueArr.length; i++) {
                if (reg1.test(valueArr[i].name)) {
                    if (tempArr.has(valueArr[i], resultEqual)) {
                        deleteIndex.push(i);
                        continue;
                    }
                    tempArr.push(valueArr[i]);
                    var div = document.createElement("div");
                    div.className = "auto_onmouseout";
                    div.seq = valueArr[i].name;
                    var tempobj = valueArr[i];
                    div.onclick = this.setValue(this, tempobj);
                    div.onmouseover = this.autoOnmouseover(this, div_index);
                    div.innerHTML = valueArr[i].name.replace(reg2, "<strong>$1</strong>") + '&emsp;<span style="font-size:8px;font-style:italic">' + valueArr[i].type + '</span>';//搜索到的字符粗体显示  
                    this.autoObj.appendChild(div);
                    this.autoObj.className = "auto_show";
                    div_index++;
                    this.count++;
                    if (this.count > 19) { terminateFlag = false; break; }
                }
            }
            for (var i = 0; i < deleteIndex.length; i++) {
                valueArr.splice(i, 1);
            }
            for (var i = 0; i < valueArr.length; i++) {
                if (terminateFlag && !reg2.test(valueArr[i].name) && reg2.test(valueArr[i].name)) {
                    tempArr.push(valueArr[i]);
                    var div = document.createElement("div");
                    div.className = "auto_onmouseout";
                    div.seq = valueArr[i].name;
                    div.onclick = this.setValue(this, i);
                    div.onmouseover = this.autoOnmouseover(this, div_index);
                    div.innerHTML = valueArr[i].name.replace(reg2, "<strong>$1</strong>") + '&emsp;<span style="font-size:8px;font-style:italic">' + valueArr[i].type + '</span>';//搜索到的字符粗体显示  
                    this.autoObj.appendChild(div);
                    this.autoObj.className = "auto_show";
                    div_index++;
                    this.count++;
                    if (this.count > 19) { terminateFlag = false; break; }
                }
            }
            if(!terminateFlag){
            	var div = document.createElement("div");
                div.className = "auto_onmouseout";
                div.seq = "";
                div.onclick = null;
                div.onmouseover = null;
                div.innerHTML = "仅显示前20条记录..."  
                this.autoObj.appendChild(div);
                this.autoObj.className = "auto_show";
                div_index++;
            }

        }
        this.pressKey(event);
    }
}  