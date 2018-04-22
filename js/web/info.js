//banner图
$.ajax({
    type: "post",
    url: "http://client.urbanfit.cn/module/list",
    data:{"type": 2},
    dataType: "json",
    success:function(res){
        var html = '';
        var html0 = '';
        if(res.code == 1){
            var module = res.data.module;
            var banner = res.data.lstBanner;
            var baseUrl = res.data.baseUrl;  // 图片地址前缀
            // banner部分遍历
            if(banner != ""){
                $.each(banner, function (i, n){
                    //alert(n.linkUrl);    // 链接地址
                    //alert(baseUrl+n.imageUrl);   // 图片地址
                    if(i == 0){
                        html += '<div class="swiper-slide swiper-slide-active">';
                        html += '<a href="'+n.linkUrl+'"><img src="'+baseUrl+n.imageUrl+'" alt="'+n.title+'"></a>';
                        html += '</div>';
                    }                 
                    if(i == banner.length - 1){
                        html += '<div class="swiper-slide swiper-slide-prev">';
                        html += '<a href="'+n.linkUrl+'"><img src="'+baseUrl+n.imageUrl+'" alt="'+n.title+'"></a>';
                        html += '</div>';
                    }
                    if(i != 0 && i != banner.length - 1){
                        html += '<div class="swiper-slide-next">';
                        html += '<a href="'+n.linkUrl+'"><img src="'+baseUrl+n.imageUrl+'" alt="'+n.title+'"></a>';
                        html += '</div>';
                    }
                })
            }
            if(module != "" && module.content != ""){
                $.each(module.content, function (k, v){
                    html0 += '<li>';
                    html0 += '<a href="'+v.linkUrl+'">'+v.title+'</a>';
                    html0 += '</li>';
                })
            }

            $(".swiper-wrapper").html(html);
            $(".module").html(html0);
        }else{
            alert("接口请求错误");
        }

    }
});

var pageNo = 1;
$(document).ready(function(){
    $('.previous').click(function(){
        pageNo -= 1;
        reladPage();
    })
    $('.next').click(function(){
        pageNo += 1;
        reladPage();
    })
})
function reladPage(){
    $.ajax({
        type: "post",
        url: "http://client.urbanfit.cn/message/list",
        data:{"pageNo": pageNo,"pageSize":10},
        dataType: "json",
        success:function(res){
            var listbox = '';
            var Page = '';
        }
    });
}