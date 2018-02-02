        $(function(){
            //鼠标移入
            $(".bubble_map").mouseover(function(){
                //简介淡入
                $(this).children(".introduce").stop().fadeIn(500);
                $(this).addClass("shadow");
            });
            //鼠标移出
            $(".bubble_map").mouseout(function(){
                //简介淡出
                $(this).children(".introduce").stop().fadeOut(500);
                $(this).removeClass("shadow");
            });
            //鼠标点击选中
            $(".bubble_map").click(function(){
                $(this).addClass("border");
                $(".bubble_map").not(this).removeClass("border");
            });
        })
        function showDynastyChoose(){
            document.getElementById("dynastyChoose").style.display='block';
            $("#dataDiv").css("height","320px");
        }
        function showDynastyChoose0(){
            document.getElementById("dynastyChoose0").style.display='block';
            $("#dataDiv").css("height","320px");
        }
        
        function hideDynastyChoose(){
            document.getElementById("dynastyChoose").style.display='none';

            $("#dataDiv").css("height","280px");
        }
        function closeData() {
            $("#dataDiv").css("display","none");
        }
        function closeData0() {
            $("#dataDiv0").css("display","none");
        }
        function showData0() {
            $("#dataDiv0").css("display","block");
        }
        function showData() {
            $("#dataDiv").css("display","block");
        }
        
        function submitData(){
        	closeData();
        	$('#warnModalLabel').html("重要提示");
			$('#warnMessage').html("正在上传数据，请稍等...");
			$('#warnModal').modal({backdrop: 'static', keyboard: false});//鼠标点击空白处，以及键盘esc将无法关闭modal
			$('#warnModal').modal('show');
            var formData = new FormData();
            formData.append('file',$("#file1")[0].files[0]);
            formData.append('layername',$("#layername1").val());
            formData.append('appendDataSrc','null');
            formData.append('course',$("#discipline").val());
            $.ajax({
                url:"./addLayers2.action",
                async:true,
                type:"POST",
                contentType: false,
                processData: false, 
                dataType:"text",
                data:formData,
                success:function(result){
                	$('#warnModal').modal('hide');
                	var uploadInfo = $(".uploadInfo1");
                    if(result == "success"){	
                    	if(uploadInfo.hasClass("fail")){
                    		uploadInfo.removeClass("fail");                    		
                    	}
                    	uploadInfo.addClass("ok");                   	
                		uploadInfo.parent("div").css("height","140px"); 
                		uploadInfo.html("上传成功");
                    }
                    else{
                    	if(uploadInfo.hasClass("ok")){
                    		uploadInfo.removeClass("ok");                    		
                    	}
                    	uploadInfo.addClass("fail");                   	
                		uploadInfo.parent("div").css("height","140px");   
                		uploadInfo.text(result);
                    }
                }
            })
        }

        function submitData0(){
        	closeData0();
        	$('#warnModalLabel').html("重要提示");
			$('#warnMessage').html("正在上传数据，请稍等...");
			$('#warnModal').modal({backdrop: 'static', keyboard: false});//鼠标点击空白处，以及键盘esc将无法关闭modal
			$('#warnModal').modal('show');
            var formData = new FormData();
            formData.append('file',$("#file")[0].files[0]);
            formData.append('layername',$("#layername").val());
            formData.append('appendDataSrc',$(".appendDataSrc:selected").attr('name'));
            formData.append('course',$("#discipline").val());
            
            $.ajax({
                url:"./addLayers2.action",
                async:true,
                type:"POST",
                contentType: false,
                processData: false, 
                dataType:"text",
                data:formData,
                success:function(result){
                	$('#warnModal').modal('hide');
                	var uploadInfo = $(".uploadInfo");
                    if(result == "success"){	
                    	if(uploadInfo.hasClass("fail")){
                    		uploadInfo.removeClass("fail");                    		
                    	}
                    	uploadInfo.addClass("ok");                   	
                		uploadInfo.parent("div").css("height","140px"); 
                		uploadInfo.html("上传成功");
                    }
                    else{
                    	if(uploadInfo.hasClass("ok")){
                    		uploadInfo.removeClass("ok");                    		
                    	}
                    	uploadInfo.addClass("fail");                   	
                		uploadInfo.parent("div").css("height","140px");   
                		uploadInfo.text(result);
                    }
                }
            })
        }