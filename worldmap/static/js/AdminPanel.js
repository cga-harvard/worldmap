$(function () {

    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();

    //2.初始化Button的点击事件
    var oButtonInit = new ButtonInit();
    oButtonInit.Init();
});



var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#tb_users').bootstrapTable({
            url: './getUserList.action',         //请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            //toolbar: '#toolbar',                //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: false,                     //是否启用排序
            sortOrder: "asc",                   //排序方式
            queryParams: oTableInit.userQueryParams,//传递参数（*）
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
            search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: true,
            showColumns: true,                  //是否显示所有的列
            showRefresh: true,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: false,                //是否启用点击选中行
            height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
            showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表
            columns: [{
                checkbox: true
            }, {
                field: 'id',
                title: 'ID'
            }, {
                field: 'username',
                title: '用户名'
            }, {
                field: 'email',
                title: '邮箱'
            }, {
                field: 'realname',
                title: '姓名'
            }, {
                field: 'comp',
                title: '单位'
            }, {
                field: 'cretificate',
                title: '证件号码'
            }, {
                field: 'cretifitype',
                title: '证件类型'
            },
            {
                field: 'authority',
                title: '权限'
            }]
        });
        
        $('#tb_maps').bootstrapTable({
            url: './getMapList2.action',         //请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            //toolbar: '#toolbar',                //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: false,                     //是否启用排序
            sortOrder: "asc",                   //排序方式
            queryParams: oTableInit.mapQueryParams,//传递参数（*）
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
            search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: true,
            showColumns: true,                  //是否显示所有的列
            showRefresh: true,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: false,                //是否启用点击选中行
            height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
            showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表
            columns: [{
                checkbox: true
            }, {
                field: 'id',
                title: 'ID'
            }, {
                field: 'mapname',
                title: '地图名'
            }, {
                field: 'userid',
                title: '建立地图用户id'
            }, {
                field: 'accessibility',
                title: '地图公开性'
            }, {
                field: 'addable',
                title: '审核状态'
            }],
            onClickRow: function (item, $element) {
            	window.open("./main.action?mapid="+item.id);
                return false;
            }
        });
    };
    
  //得到查询的参数
    oTableInit.userQueryParams = function (params) {
        var temp = {   
            limit: params.limit,   //页面大小
            offset: params.offset,  //页码
            username: $("#user_txt_username").val().trim()
        };
        return temp;
    };
    
    oTableInit.mapQueryParams = function (params) {
        var temp = {   
            limit: params.limit,   //页面大小
            offset: params.offset,  //页码
            mapname: $("#map_txt_mapname").val().trim()
        };
        return temp;
    };
    
    return oTableInit;
};

var ButtonInit = function () {
    var oInit = new Object();
    var postdata = {};

    oInit.Init = function () {
        $('#user_btn_query').click(
        		function(){
        			$('#tb_users').bootstrapTable('refresh');
        		});
        $('#map_btn_query').click(
        		function(){
        			$('#tb_maps').bootstrapTable('refresh');
        		});
        $('#map_btn_pass').click(
        		function(){
        			var mapList = getSelectMapIdList();
        			$.ajax({
        				url: "./passMap.action",
        				async: true,
        				type: "POST",
        				dataType: "text",
        				data: {
        					mapList: JSON.stringify(mapList)
        				},
        				success: function (result) {
        					$('#tb_maps').bootstrapTable('refresh');
        				}
        			})
        			
        		});
        $('#map_btn_ban').click(
        		function(){
        			var mapList = getSelectMapIdList();
        			$.ajax({
        				url: "./banMap.action",
        				async: true,
        				type: "POST",
        				dataType: "text",
        				data: {
        					mapList: JSON.stringify(mapList)
        				},
        				success: function (result) {
        					$('#tb_maps').bootstrapTable('refresh');
        				}
        			})
        			
        		});
        $('#user_btn_pass').click(
        		function(){
        			var userList = getSelectUserIdList();
        			$.ajax({
        				url: "./passUser.action",
        				async: true,
        				type: "POST",
        				dataType: "text",
        				data: {
        					userList: JSON.stringify(userList)
        				},
        				success: function (result) {
        					$('#tb_users').bootstrapTable('refresh');
        				}
        			})
        			
        		});
        $('#user_btn_ban').click(
        		function(){
        			var userList = getSelectUserIdList();
        			$.ajax({
        				url: "./banUser.action",
        				async: true,
        				type: "POST",
        				dataType: "text",
        				data: {
        					userList: JSON.stringify(userList)
        				},
        				success: function (result) {
        					$('#tb_users').bootstrapTable('refresh');
        				}
        			})
        			
        		});
    };

    return oInit;
};

function getSelectMapIdList()
{
	var selections = $('#tb_maps').bootstrapTable('getSelections');
	var mapList = new Array();
	for (var i=0;i<selections.length;i++)
	{
		mapList.push(selections[i].id);
	}
	return mapList;
}

function getSelectUserIdList()
{
	var selections = $('#tb_users').bootstrapTable('getSelections');
	var userList = new Array();
	for (var i=0;i<selections.length;i++)
	{
		userList.push(selections[i].id);
	}
	return userList;
}