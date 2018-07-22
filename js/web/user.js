$(function (){
    $("#mainPage").load("main.html");
    $("#footerPage").load("footer.html");
    $("#A_save").click(updateClientName);
    // 初始化用户信息
    initClientInfo();
    $("#A_wechat_login").click(wechatClientLogin);
})

function wechatClientLogin(){
    var redirectUrl = encodeURIComponent(wechatPayUrl + "wechat_login.html?type=clientPage");
    window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfceafb8ea3eae188" +
        "&redirect_uri=" + redirectUrl + "&response_type=code&scope=snsapi_userinfo#wechat_redirect";
}

function initClientInfo(){
    $.ajax({
        type : "post",
        url : baseUrl + "apiClient/queryByClientId",
        data : {"clientId" : clientId},
        dataType : "json",
        success : function (result){
            if(result.code != 1){
                alert(result.msg);
            }else{
                if(result.data.openId == ""){
                    $("#wechatLoginDiv").show();
                }else{
                    $("#wechatLoginDiv").hide();
                }
                $("input[name='name']").val(result.data.name);
                $("input[name='nickname']").val(result.data.nickname);
                $("input[name='gender'][value='" + result.data.gender + "']").attr("checked", true);
                $("input[name='email']").val(result.data.email);
            }
        }
    });
}

function updateClientName(){
    if(clientIsLogin() == false){
        alert("请您先登录账号");
        return ;
    }
    var clientName = $("input[name='name']").val();
    if(clientName == ""){
        alert("真是姓名不能为空");
        return ;
    }
    var nickname = $("input[name='nickname']").val();
    if(nickname == ""){
        alert("昵称不能为空");
        return ;
    }
    var gender = $("input[name='gender']:checked").val();
    if(gender == ""){
        alert("请选择性别");
        return ;
    }
    var email = $("input[name='email']").val();
    if(email != ""){
        var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if(!emailReg.test(email)){
            alert("邮箱输入格式有误");
            return;
        }
    }
    // 修改信息
    $.ajax({
        type : "post",
        url : baseUrl + "apiClient/update",
        data : {"clientId" : clientId, "name" : clientName, "nickname":  nickname, "gender": gender,
            "email" : email},
        dataType : "json",
        success : function (result, status){
            if(result.code != 1){
                alert(result.msg);
                return;
            }else{
                alert("修改个人信息成功");
                $("#clientName_label").text(clientName);
                var user_str = JSON.stringify(result.data);
                $.cookie('webuser', user_str, {path:'/'});
            }
        }
    })
}