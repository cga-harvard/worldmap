function initLogWindow() {
    $("#account").val("");
    $("#pwd").val("");
}
function checkAuthority()
{
	$.ajax({
			url: "./getActiveAuthority.action",
			async: false,
			type: "POST",
			dataType: "text",
			data: {},
			success: function (flag) {
				if(flag==="true"){
				//TODO 弹窗提示管理员权限开启
				var oldhtml = $('#usermenu').html();
				var newhtml = '<li><a href="./admin.action">审核管理</a></li>';
				$('#usermenu').html(oldhtml+newhtml);
				}
			}
		});
}
function setCookie(c_name,value,expiredays)
{
	var exdate=new Date()
	exdate.setDate(exdate.getDate()+expiredays)
	document.cookie=c_name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}

function getCookie(c_name)
{
	if (document.cookie.length>0)
	{
		c_start=document.cookie.indexOf(c_name + "=")
		if (c_start!=-1)
		{ 
			c_start=c_start + c_name.length+1 
			c_end=document.cookie.indexOf(";",c_start)
			if (c_end==-1) c_end=document.cookie.length
			return unescape(document.cookie.substring(c_start,c_end))
		} 
	}
	return ""
}

function clearCookie(name) {    
    setCookie(name, "", -1);    
}

function do_autologin(){
	var cookie_username = getCookie("username");
    var cookie_password = getCookie("password");
    var cookie_bremember = getCookie("bremember");
    var cookie_bautologin = getCookie("bautologin");
    alert(cookie_bautologin);
	if(cookie_bautologin!="t"){
		
		return;
	}
	
	$.ajax({
		url:"./login.action",
		async:true,
		type:"POST",
		dataType:"text",
		data:{
    		username:cookie_username,
    		password:hex_md5(cookie_password),
    	},
		//contentType:"application/json",
		success: function(result){
			if(result=="success"){
				$('#userwin').window('close');
				window.location.reload();
			}
			else if(result=="fail"){
				alert("用户名或密码错误！");
			}
		}
	})
}



$(document).ready(function() {
    $("#loginwinbtn").click(function() {
    	initLogWindow();
        $("#userwin").modal('show');
      //获取cookie，如果有，则填充textbox
        var cookie_username = getCookie("username");
        var cookie_password = getCookie("password");
        var cookie_bremember = getCookie("bremember");
        var cookie_bautologin = getCookie("bautologin");
        if(cookie_bremember=="t"){
        	$("#account").val(cookie_username);
        	$("#pwd").val(cookie_password);
        	$("#checkpwd").attr("checked",true);     
        }
        else{
        	//"f"或者""
        	$("#account").val(cookie_username);
        	$("#checkpwd").attr("checked",false);     
        }
        
        if(cookie_bautologin=="t"){
        	$("#checklogin").attr("checked",true);
        }
        else{
        	//"f"或者""
        	$("#checklogin").attr("checked",false);
        }
        
    });

    $("#loginbtn").bind('click',function(){    	
    	var	rememberMe = $("#checkpwd").is(':checked');    
    	var	bautologin = $("#checklogin").is(':checked');
    	var expiredays = 7; 
    	//alert(hex_md5($('#pwd').textbox('getValue')));
    	$.ajax({
    		url:"./login.action",
    		async:true,
    		type:"POST",
    		dataType:"text",
    		data:{
        		username:$('#account').val().trim(),	
        		password:hex_md5($('#pwd').val().trim()),
        	},
    		//contentType:"application/json",
    		success: function(result){
    			if(result=="success"){
    				
    				//如果登录成功且勾选了记住我，则设置cookie
    				if(rememberMe){    					
    					
    					setCookie("bremember","t",expiredays);
    					setCookie("username",$('#account').val(),expiredays);
    					setCookie("password",$('#pwd').val(),expiredays);
    					if(bautologin){
    						setCookie("bautologin","t",expiredays);
        				}
        				else{
        					setCookie("bautologin","f",expiredays);
        				}
    				}
    				else{
    					
    					setCookie("bremember","f",expiredays);
    					if(bautologin){
    						setCookie("username",$('#account').val(),expiredays);
        					setCookie("password",$('#pwd').val(),expiredays);//也是要set不然可能之前的状态并不是记住密码所以没保存用户名密码
        					
    						setCookie("bautologin","t",expiredays);//不记住密码但自动登录
        				}
        				else{
        					setCookie("bautologin","f",expiredays);
        					
        					clearCookie("username");
        					clearCookie("password");//不记住密码不自动登录则clear俩
        				}
    				}
    				
    				$('#userwin').modal('hide');
    				window.location.reload();
    			}
    			else if(result=="fail"){
    				alert("用户名或密码错误！");
    			}
    			else{
    				alert("其他原因登录失败");
    				
    			}
    		}
    	})
    });
    
    $("#logoutbtn").bind('click',function(){
    	$.ajax({
    		url:"./logout.action",
    		async:true,
    		type:"POST",
    		success: function(result){
    			if(result=="success"){
    				window.location.reload();
    				var expiredays = 7; 
    				setCookie("bautologin","f",expiredays);//退出登录当然就是取消下次打开页面会自动登录
    				   				
    			}
    			else{
    				window.location.reload();
    			}
    		},
    		error:function(){
    			alert("注销服务器返回错误");
    		}    			
    	})    	
    	var cookie_bautologin=getCookie("bautologin");
		   	
    });
});
