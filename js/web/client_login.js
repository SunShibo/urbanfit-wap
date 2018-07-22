$(function (){
    $("#A_login").click(clientLogin);
    $("#A_wechat_login").click(wechatClientLogin);
    $("#A_register").click(clientRegister);
});

function clientRegister(){
    var courseId = getParamValue("courseId");
    var storeId = getParamValue("storeId");
    var detailId = getParamValue("detailId");
    window.location.href = "join.html?type=orderPage&courseId=" + courseId + "&storeId=" + storeId
        + "&detailId=" + detailId;
}

function wechatClientLogin(){
    var courseId = getParamValue("courseId");
    var storeId = getParamValue("storeId");
    var detailId = getParamValue("detailId");

    var redirectUrl = encodeURIComponent(wechatPayUrl + "wechat_login.html?type=orderPage&courseId=" + courseId
        + "&storeId=" + storeId + "&detailId=" + detailId);
    window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfceafb8ea3eae188" +
        "&redirect_uri=" + redirectUrl + "&response_type=code&scope=snsapi_userinfo#wechat_redirect";
}

function clientLogin(){
    var mobile = $.trim($("#phone").val());
    if(!isMobile(mobile)){
        $('#phonemsg').text('请输入正确的手机号');
        $("#phone").focus();
        return;
    }else{
        $('#phonemsg').text('');
    }
    var pwd = $.trim($("#pwd").val());
    if(pwd == ''){
        $('#pwdmsg').text("请输入您的密码");
        $("#pwd").focus();
        return;
    }else{
        $('#pwdmsg').text('');
    }
    // 调用登录接口
    $.ajax({
        type : "post",
        url : baseUrl + "apiClient/login",
        data : {"mobile" : mobile, "password" : pwd},
        dataType : "json",
        success : function (result, status){
            if(result.code == 0){
                $('#phonemsg').text('手机号码不存在');
                $("#phone").focus();
                return;
            }else if(result.code == 2){
                $('#pwdmsg').text('密码输入不正确');
                $("#pwd").focus();
                return;
            }else{
                // 登录成功跳转页面
                $('#phonemsg').text('');
                $('#pwdmsg').text('');
                var user_str = JSON.stringify(result.data);
                $.cookie('webuser', user_str, {path:'/'});
                window.location.href = wechatPayUrl + "course_join.html?courseId=" + courseId
                    + "&storeId=" + storeId + "&detailId=" + detailId;
            }
        }
    });
};

//粗略验证手机号
function isMobile(mobile){
    var re = /^1[0-9]{10}$/;
    //var validCode=true;
    if(re.test(mobile))
        return true;
    else
        return false;
}

function getParamValue(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}