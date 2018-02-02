$(document).ready(function () {
	//背景动画
	//glInitialize();
	//用户名验证
	var state1 = false;
	$("#username").textbox('textbox').blur(function () {
		if ($(this).val() == '') {
			$("#uinfo").text("用户名不能为空");
			state1 = false;    
		} else {
			$.ajax({
				url: "./userExists.action",
				async: true,
				type: "POST",
				dataType: "text",
				data: {
					username: $('#username').val().trim()
				},
				success: function (flag) {
					if (flag == "true") {
						$("#uinfo").text("该用户名已存在，请重新填写");
						state1 = false;
					} else if (flag == "false") {
						$("#uinfo").text('');
						$("#uinfo").append("<img src='./img/3_ok.png' />");
						state1 = true;
					}
				}
			})
		}
	});

	//密码验证
	var state2 = false;
	$("#password").textbox('textbox').blur(function () {
		if ($(this).val() == '') {
			$("#pinfo").text("密码不能为空");
			state2 = false;    
		} else {
			if ($(this).val().length < 6) {
				$("#pinfo").text("密码必须大于等于6位，请重新填写");
				state2 = false;        
			} else if ($(this).val().length > 20) {
				$("#pinfo").text("密码必须小于等于20位，请重新填写");
				state2 = false;        
			} else {
	            $("#pinfo").text('');
	            $("#pinfo").append("<img src='./img/3_ok.png' />");
	            state2 = true;
			}
		}
	});
	//确认密码
	var state3 = false;
	$("#passwordagain").textbox('textbox').blur(function () {
		if ($(this).val() == '') {
			$("#painfo").text("密码不能为空");	    
			state3 = false;
		} else {
			if ($("#passwordagain").textbox('getValue') != $("#password").val()) {
				$("#painfo").text("两次输入的密码不一致，请重新填写");     
				state3 = false;
			} else {
	            $("#painfo").text('');
	            $("#painfo").append("<img src='./img/3_ok.png' />");
	            state3 = true;		        
			}
		}
	});
	//邮箱验证
	var state4 = false;
	$("#email").textbox('textbox').blur(function () {
		if ($(this).val() == '') {
			$("#einfo").text("邮箱不能为空");			    
			state4 = false;
		} else {
			if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test($(this).val()) == false) {
				$("#einfo").text("邮箱格式不正确，请重新填写");
				state4 = false;        
			} else {
				$.ajax({
					url: "./emailExists.action",
					async: true,
					type: "POST",
					dataType: "text",
					data: {
						email: $('#email').val().trim()
					},
					success: function (flag) {
						if (flag == "true") {
							$("#einfo").text("该邮箱已被占用，请重新填写");
							state4 = false;
						} else if (flag == "false") {
							$("#einfo").text('');
							$("#einfo").append("<img src='./img/3_ok.png' />");
							state4 = true;
						}
					}
				})
				       
			}
		}
	});
	
	var state5 = false;
	$("#realname").textbox('textbox').blur(function () {
		if ($(this).val() == '') {
			$("#rninfo").text("姓名不能为空");			    
			state5 = false;
		} 			 
		else{
			$("#rninfo").text('');
			$("#rninfo").append("<img src='./img/3_ok.png' />");
			state5 = true;
		}
	});			       
			
	
	var state6 = false;
	$("#comp").textbox('textbox').blur(function () {
		if ($(this).val() == '') {
			$("#cpinfo").text("所在单位不能为空");
			state6 = false;			    
		} 			 
		else{
			$("#cpinfo").text('');
			$("#cpinfo").append("<img src='./img/3_ok.png' />");
			state6 = true;
		}
	});	
	
	var state7 = false;
	$("#cretificate").textbox('textbox').blur(function () {
		if ($(this).val() == '') {
			$("#creinfo").text("证件号码不能为空");			    
			state7 = false;
		} 			 
		else{
			$("#creinfo").text('');
			$("#creinfo").append("<img src='./img/3_ok.png' />");
			state7 = true;
		}
	});
	
	var state8 = false;
	//初始化没有阅读相关政策时的状态——不能注册
	$("#mustagree").css("display","block");
	$("#registerbtn").addClass("disabled");
	$("#registerbtn").css("background","#aaaaaa");
	$("#registerbtn").hover(function(){
		$("#registerbt").css("background","#aaaaaa");
	})
	
	$("#agree").click(function(){
		if($("#agree").is(':checked')){
			$("#mustagree").css("display","none");
			$("#registerbtn").removeClass("disabled");
			$("#registerbtn").css("background","#2573f0");
			$("#registerbtn").hover(
				function(){
				$("#registerbtn").css("backgroun","#0000ff");
				$("#registerbtn").css("cursor","pointer");
				},function(){
				$("#registerbtn").css("background","#2573f0");
			})
			state8 = true;
		}else{
			$("#mustagree").css("display","block");
			$("#registerbtn").addClass("disabled");
			$("#registerbtn").css("background","#aaaaaa");
			$("#registerbtn").hover(function(){
				$("#registerbt").css("background","#aaaaaa");
			})
		}	
	});

	$("#cretifitype").combobox(
		{
    		valueField:'id',
    		textField:'text',
			data:[
				{
					id:0,
					text:"身份证"
				},
				{
					id:1,
					text:"护照"
				},
				{
					id:2,
					text:"学生证"
				}
				]
			
		}
	);
	$("#cretifitype").combobox('select',0);
	//发邮件	
	$("#sendcode2email").click(function () {
		if(state4){
			$.ajax({
				url: "./sendcode2email.action",
				async: true,
				type: "POST",
				dataType: "text",
				data: {
					email: $('#email').val().trim()
				},
				//contentType:"application/json",
				success: function (data) {
					alert(data);
				},
				error: function () {
					alert("未知错误");
				}
			});
		}else{
			alert("邮箱信息错误！")
		}
	});

	//注册
	$("#registerbtn").click(function () {
		if(!state8){}
		if (state1 && state2 && state3 && state4
				   && state5 && state6 && state7) {
			$.ajax({
				url: "./register.action",
				type: "POST",
				dataType: "text",
				data: {
					username: $('#username').val().trim(),
					password: hex_md5($('#password').val().trim()),
					email: $('#email').val().trim(),
					checkcode: $('#email_code').val().trim(),
					cretificate:$('#cretificate').val().trim(),
					realname:$('#realname').val().trim(),
					comp:$('#comp').val().trim(),
					cretifitype:$('#cretifitype').combobox('getValue').trim(),
				},
				success: function (row) {
					if (row == 1) {
						//alert("注册成功");
						$.messager.show({
							title: '恭喜您',
							msg: '注册成功！',
							showType: 'show',
							timeout: 1000,
							style: {
								right: '',
								bottom: '',
							}
						});
						setTimeout(function () {
							window.location.href = "./index.action"
						}, 1000);
					} else {
						alert(row);
					}
				},
				error: function () {
					alert("未知错误！");
				}
			})
		} else {
			$.messager.alert('注册失败', '注册信息不正确！');
		}

	});
	
	$("#cancelbtn").click(function (){
		location.href = "http://localhost:8080/AncientMap/index.action";
	});

})
