$(function(){
    $("#mainPage").load("main.html");
    $("#footerPage").load("footer.html");
})

//banner图
$.ajax({
    type: "post",
    url: "http://client.urbanfit.cn/module/list",
    data:{"type": 2},
    dataType: "json",
    success:function(res){
        var html0 = '';
        if(res.code == 1){
            var module = res.data.module;
            if(module != "" && module.content != ""){
                $.each(module.content, function (k, v){
                    html0 += '<li>';
                    html0 += '<a href="'+v.linkUrl+'">'+v.title+'</a>';
                    html0 += '</li>';
                })
            }
            $(".module").html(html0);
        }else{
            alert("接口请求错误");
        }

    }
});

//获取url中的参数
function GetRequest(){
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
//接收get参数
var canshu = GetRequest();

$.ajax({
    type: "post",
    url: "http://client.urbanfit.cn/message/detail",
    data:{"messageId": canshu['messageId']},
    dataType: "json",
    success:function(res){
        var html = '';
        if(res.code == 1){

            var baseUrl0 = res.data.baseUrl;  // 图片地址前缀
            //console.log(baseUrl0);
            var activityMessage = res.data.activityMessage;
            console.log(baseUrl0+activityMessage.detailImage);
            if(activityMessage != ""){
                html += '<h1>'+activityMessage.title+'</h1>';
                html += '<p>'+activityMessage.createTime+'</p>';
                html += '<div class="infotext">';
                html += '<img src="'+baseUrl0+activityMessage.detailImage+'">';
                html += '<p>'+activityMessage.content+'</p>';
                html += '</div>';
            }
            //console.log(html);
            $(".infodetail").html(html);
        }else if(res.code == 0){
            alert("查询不到数据");
        }else{
            alert("接口请求错误")
        }

    }
});

