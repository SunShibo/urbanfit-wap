$(function (){
    $("#footerPage").load("footer.html");
    $("#A_login").click(clientLogin);
});

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
                window.location.href = "login_success.html";
                var user_str = JSON.stringify(result.data);
                $.cookie('webuser', user_str, {path:'/'});
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