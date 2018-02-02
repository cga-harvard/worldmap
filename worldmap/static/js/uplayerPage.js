//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate

$(".next1").click(function(){
	current_fs = $(this).parent();
	next_fs = $(this).parent().next();
	var index;
	for(var i=0;i<4;i++)
	{
		 if($(this).siblings("div").eq(i).hasClass("border")){
			 index = i;
			 $("#content").css("height","1200px");
			 $("#msform fieldset").css("height","1000px");
		 }
	}
	if(index == undefined){
		$('#warnModalLabel').html("错误提示");
		$('#warnMessage').html("请先选择模板");
		$('#warnModal').modal('show');	
	}
	else {
		//先以index为标记向session里面设定图层类型……以便前端整合上传界面
		$.ajax({
			url: "./setLayerType.action",
			async: false,
			type: "POST",
			dataType: "text",
			data: {
				LayerType:index
			},success: function (result) {
				console.log(result);
			}});
		//
		next_fs = $(this).parent().siblings("fieldset").eq(index);
		console.log(next_fs);
		//activate next step on progressbar using the index of next_fs
		$("#progressbar li").eq(1).addClass("active");

		//show the next fieldset
		next_fs.show();
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function (now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale current_fs down to 80%
				scale = 1 - (1 - now) * 0.2;
				//2. bring next_fs from the right(50%)
				left = (now * 50) + "%";
				//3. increase opacity of next_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({'transform': 'scale(' + scale + ')'});
				next_fs.css({'left': left, 'opacity': opacity});
			},
			duration: 800,
			complete: function () {
				current_fs.hide();
				animating = false;
			},
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});
	}
});
$(".next2").click(function(){
	if($(".uploadInfo")[0].innerHTML=="上传成功"){
			$("#content").css("height","650px");
			$("#msform fieldset").css("height","450px");
			//current fieldset
			current_fs = $(this).parent();
			//next fieldset 下一个要打开的fieldset——图层制作成功
			next_fs = $(this).parent().siblings("fieldset").eq(4);
			//activate next step on progressbar using the index of next_fs
			$("#progressbar li").eq(2).addClass("active");
		
			//show the next fieldset
			next_fs.show();
			//hide the current fieldset with style
			current_fs.animate({opacity: 0}, {
				step: function (now, mx) {
					//as the opacity of current_fs reduces to 0 - stored in "now"
					//1. scale current_fs down to 80%
					scale = 1 - (1 - now) * 0.2;
					//2. bring next_fs from the right(50%)
					left = (now * 50) + "%";
					//3. increase opacity of next_fs to 1 as it moves in
					opacity = 1 - now;
					current_fs.css({'transform': 'scale(' + scale + ')'});
					next_fs.css({'left': left, 'opacity': opacity});
				},
				duration: 800,
				complete: function () {
					current_fs.hide();
					animating = false;
				},
				//this comes from the custom easing plugin
				easing: 'easeInOutBack'
			});
		}
		else{
			$('#warnModalLabel').html("错误提示");
			$('#warnMessage').html("请先正确上传数据");
			$('#warnModal').modal('show');	
		}
});
$(".previous1").click(function(){
	if(animating) return false;
	animating = true;
	$("#content").css("height","650px");
	$("#msform fieldset").css("height","450px");

	current_fs = $(this).parent();
	// previous_fs = $(this).parent().prev();
	previous_fs = $(this).parent().siblings("fieldset").eq(0);
	//de-activate current step on progressbar
	$("#progressbar li").eq(1).removeClass("active");
	
	//show the previous fieldset
	previous_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			left = ((1-now) * 50)+"%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});
$(".submit").click(function(){
	return false;
})