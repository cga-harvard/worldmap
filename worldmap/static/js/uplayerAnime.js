/**
 * Created by asus1 on 2017/7/16.
 */
$(function() {
    $("span").click(function () {
        $("body").animate({scrollTop: 670}, 1500);
    });
    var beforescroll = 0;
    var y = 0;
    var heig = $("#index").height();
    var t = true;//用来判断是否执行滑动函数
    function roll() {//滑动函数，包括判断鼠标滑轮上下滑动
        if (t) {
            var afterscroll = $(window).scrollTop();
            if (afterscroll < heig) {
                var delta = afterscroll - beforescroll;//delta用作判断前后两次的scrolltop值来确定上滑还是下滑
                if (delta == 0) {
                    return false;
                }
                else if (delta > 0) {
                    t = false;//每次执行滑动前将t设置为false，以免在执行window.scroll函数时不断调用滑动函数
                    y = y + heig;
                    $("body").animate({scrollTop: y}, 1000, function () {
                        beforescroll = y;
                        t = true;//在animate的回调函数中将t设置为true，即在每次动画完成后才能够再次调用roll函数
                    });
                    return false;
                }
                else if (delta < 0) {
                    t = false;
                    y = y - heig;
                    $("body").animate({scrollTop: y}, 1000, function () {
                        beforescroll = y;
                        t = true;
                    });
                    return false;
                }
            }
        }
    }
    $(window).scroll(roll);
})
