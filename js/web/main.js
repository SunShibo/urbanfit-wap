var clientId;
var clientName;
var clientMobile;
$(function(){
    // 退出
    $("#A_login_out").click(function(){
        $.cookie('webuser', "");
        window.location.href = "index.html";
    })

    var webuser = $.cookie('webuser');
    if(webuser != "" && webuser != null){        // 已登录
        $("#noLoginDiv").hide();
        $("#loginedDiv").show();
        var nameLabel = JSON.parse(webuser).name;
        if(nameLabel == ""){
            nameLabel = JSON.parse(webuser).mobile;
        }
        $("#clientName_label").text(nameLabel);
        clientId = JSON.parse(webuser).clientId;
        clientName = JSON.parse(webuser).name;
        clientMobile = JSON.parse(webuser).mobile;
    }else{
        $("#noLoginDiv").show();
        $("#loginedDiv").hide();
    }
})

function clientIsLogin(){
    var isLogin = false;
    var webuser = $.cookie('webuser');
    if(webuser != "" && webuser != null){
        isLogin = true;
        clientId = JSON.parse(webuser).clientId;
        clientName = JSON.parse(webuser).name;
        clientMobile = JSON.parse(webuser).mobile;
    }else{
        clientId = "";
        clientName = "";
        clientMobile = "";
    }
    return isLogin;
}