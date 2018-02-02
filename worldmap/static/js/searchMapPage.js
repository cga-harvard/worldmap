$(document).ready(function() {

	// 1.初始化Table
	var oTable = new TableInit();
	oTable.Init();

	// 2.初始化Button的点击事件
	var oButtonInit = new ButtonInit();
	oButtonInit.Init();

	checkAuthority();
});

var TableInit = function() {
	var oTableInit = new Object();
	// 初始化Table
	oTableInit.Init = function() {
		$('#tb_maps').bootstrapTable({
			url : './getMapListForSearch.action', // 请求后台的URL（*）
			method : 'get', // 请求方式（*）
			// toolbar: '#toolbar', //工具按钮用哪个容器
			striped : true, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination : true, // 是否显示分页（*）
			sortable : false, // 是否启用排序
			sortOrder : "asc", // 排序方式
			queryParams : oTableInit.mapQueryParams,// 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pageNumber : 1, // 初始化加载第一页，默认第一页
			pageSize : 10, // 每页的记录行数（*）
			pageList : [ 10, 25, 50, 100 ], // 可供选择的每页的行数（*）
			search : false, // 是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
			strictSearch : true,
			showColumns : true, // 是否显示所有的列
			showRefresh : true, // 是否显示刷新按钮
			minimumCountColumns : 2, // 最少允许的列数
			clickToSelect : false, // 是否启用点击选中行
			height : 500, // 行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "ID", // 每一行的唯一标识，一般为主键列
			showToggle : true, // 是否显示详细视图和列表视图的切换按钮
			cardView : false, // 是否显示详细视图
			detailView : false, // 是否显示父子表
			columns : [ {
				field : 'id',
				title : 'ID',
				align : 'center'
			}, {
				field : 'mapname',
				title : '地图名',
				align : 'center'
			}, {
				field : 'maptype',
				title : '地图类型',
				align : 'center',
				formatter : function(value, row, index) {
					switch (value) {
					case 0:
						return "综合";
					case 1:
						return "人文";
					case 2:
						return "历史";
					case 3:
						return "经济";
					case 4:
						return "政治";
					}
				}
			}, {
				field : 'realname',
				title : '建立地图用户',
				align : 'center'
			} ],
			onClickRow : function(item, $element) {
				window.open("./main.action?mapid=" + item.id);
				return false;
			}
		});
	};

	// 得到查询的参数

	oTableInit.mapQueryParams = function(params) {
		var temp = {
			limit : params.limit, // 页面大小
			offset : params.offset, // 页码
			mapnameBS : $("#map_txt_mapname").val().trim()
		};
		return temp;
	};

	return oTableInit;
};

var ButtonInit = function() {
	var oInit = new Object();
	var postdata = {};

	oInit.Init = function() {
		$('#map_btn_query').click(function() {
			$('#tb_maps').bootstrapTable('refresh');
		});
	};

	return oInit;
};

function getSelectMapIdList() {
	var selections = $('#tb_maps').bootstrapTable('getSelections');
	var mapList = new Array();
	for (var i = 0; i < selections.length; i++) {
		mapList.push(selections[i].id);
	}
	return mapList;
}
