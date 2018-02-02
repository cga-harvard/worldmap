
	var userid = 0;
	var username = "";
	var page = 0;     //似乎这些都是和分页有关的代码
	var curPage = 0;   //不过后面肯定是要改成每次请求一页的地图的写法的
	var mes = new Array();     
	var data = null;
	$(document).ready(function(){
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
		//获取地图列表json
		$.ajax({
		url: "./getMapList.action",
		async: false,
		type: "POST",
		dataType: "text",
		data: {
			userid: userid
		},
		success: function (result) {

			data = $.parseJSON(result);
		}
	})
			var list = $("#resultList");
			var strHtml = ""; //å­å¨æ°æ®çåé
			var count = 0;
			list.empty();
			page = 0;
			$.each(data,function(infoIndex,info){
				//TODO 这个筛选需要改到后台
				if(info["accessibility"]=="0"&&(info["userid"]!=userid)){}
				else{
					count = count + 1;
					if(count==4){//这里好像是4张图分一页的意思。。。emmm
						mes.push(strHtml);   
						strHtml="";
						page=page+1;
						count=1;
					}					
					strHtml += '<button type="button" class="list-group-item" onclick="openMap('
							+ info["id"] 
							+ ')">'
							+ '<div class="row"><div class="col-md-3"><h4><strong>' 
							+ info["mapname"]
							+ '</strong></h4></div>'	
							+ '<div class="col-md-3  col-md-offset-3 col-xs-12"><h5>'
							+ info["userid"]
							+ '</h5></div></div></button>';										
				}
			});
			
			if(strHtml!=""){
				mes.push(strHtml);
			}
			list.html(mes[curPage]);  
			var pager = $("#pager");
    		pager.html("当前"+(curPage+1)+"//"+(page+1)+"页");
	        });//ready
    
    
    function search(){
    	var key = $("#searchInput").val();
    	var data;
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
    		//åä¸ä¸ªåæ­¥è¯·æ±ï¼å¾å°å°å¾json
    		$.ajax({
    		url: "./getMapList.action",
    		async: false,
    		type: "POST",
    		dataType: "text",
    		data: {
    			userid: userid
    		},
    		success: function (result) {

    			data = $.parseJSON(result);
    		}
    	});
			var list = $("#resultList");
			var strHtml = ""; //å­å¨æ°æ®çåé
			var count = 0;
			page = 0;
			list.empty();
			mes.splice(0,mes.length);   //æ¸ç©ºæ°ç»
			$.each(data,function(infoIndex,info){			
				var mapname = info["mapname"];
				if(mapname.indexOf(key)>=0){		//å¤æ­å°å¾åä¸­æ¯å¦åå«å³é®è¯		
					if(info["accessibility"]=="0"&&(info["userid"]!=userid)){}   //å¤æ­å°å¾å¯¹äºç¨æ·æ¯å¦å¯è§
					else{
						count = count + 1;
						if(count==4){            //æ¯é¡µæ¾ç¤º3æ¡è®°å½
							mes.push(strHtml);   
							strHtml="";
							page=page+1;
							count=1;
						}					
						strHtml += '<button type="button" class="list-group-item" onclick="openMap('
								+ info["id"] 
								+ ')">'
								+ '<div class="row"><div class="col-md-3"><h4><strong>' 
								+ info["mapname"]
								+ '</strong></h4></div>'	
								+ '<div class="col-md-3  col-md-offset-3 col-xs-12"><h5>'
								+ info["userid"]
								+ '</h5></div></div></button>';	
						}
					}				
				else{}
			});
			if(strHtml!=""){
				mes.push(strHtml);
			}
			list.html(mes[0]);   
			var pager = $("#pager");
    		pager.html("当前"+(curPage+1)+"//"+(page+1)+"页");
    }
    
    //ç¹å»å°å¾ä¿¡æ¯æ¡ç®åæ§è¡çå½æ°
    function openMap(mapid){
    	//TODO æ¹æajaxçéå®å
    	location.href = "http://localhost:8080/AncientMap/main.action?mapid=" + mapid;
    }
    
    //ååç¿»é¡µ
    function prevPage(){
    	if(curPage>0){
    		curPage-=1;
    		var list = $("#resultList");
    		list.empty();
    		list.html(mes[curPage]);
    		var pager = $("#pager");
    		pager.html("当前"+(curPage+1)+"//"+(page+1)+"页");
    	}   	
    }
    //ååç¿»é¡µ
    function nextPage(){
    	if(curPage<page){
    		curPage+=1;
    		var list = $("#resultList");  		
    		list.empty();
    		list.html(mes[curPage]);
    		var pager = $("#pager");
    		pager.html("当前"+(curPage+1)+"//"+(page+1)+"页");
    	}   	
    }