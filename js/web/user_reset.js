$(function (){
    $("#mainPage").load("main.html");
    $("#footerPage").load("footer.html");
    $("#A_save_password").click(updatePassword);
    $('#sendcode').click(sendVcode);
    $('#phone').val(clientMobile);
})

//获取短信验证
function sendVcode(){
    if(clientIsLogin() == false){
        alert("请您先登录账号");
        return ;
    }
    var isWaiting = false;
    var _this  = $(this);
    var phone = $('#phone').val();
    if(isWaiting == true) return;
    if(!isMobile(phone)){
        $('#phonemsg').text('请输入正确的手机号');
        $("#phone").focus();
        return;
    }else{
        $('#phonemsg').text('');
    }

    isWaiting = true;
    var param = {
        url : baseUrl + "apiClient/codeSignIn",
        params : {
            mobile : phone,
            type : 1,
        },
        callback : function(d){
            if(d.code==0){
                $('#phonemsg').text('手机号码不存在');
                $("#phone").focus();
                return;
            }else if(d.code==1){
                var messageCode = d.data.messageCode;
                $.cookie("userResetPwd_" + phone + "", messageCode, {path:'/'});
                var time=60;
                var t=setInterval(function(){
                    $(_this).html('('+time+'s)后重发');
                    $(_this).addClass("msg");
                    time--;
                    if(time==0){
                        clearInterval(t);
                        $(_this).html("重新获取");
                        isWaiting=true;
                        $(_this).removeClass("msg");
                    }
                },1000)
            }else{
                isWaiting = false;
                $('#yzmmsg').text('');
            }
        }
    }
    ajax(param);
}

function updatePassword(){
    if(clientIsLogin() == false){
        alert("请您先登录账号");
        return ;
    }

    var mobile = $.trim($("#phone").val());
    if(!isMobile(mobile)){
        $('#phonemsg').text('请输入正确的手机号');
        $("#phone").focus();
        return;
    }else{
        $('#phonemsg').text('');
    }
    var vcode = $.trim($("#vcode").val());
    if(vcode.length != 6){
        $('#yzmmsg').text("请输入验证码");
        $("#vcode").focus();
        return;
    }else {
        $('#yzmmsg').text('');
    }
    // 判断验证码是否正确
    var messageCode = $.cookie("userResetPwd_" + mobile + "");
    if(messageCode != vcode){
        $('#yzmmsg').text("验证码输入有误");
        $("#vcode").focus();
        return ;
    }
    var pwd = $.trim($("#pwd").val());
    if(pwd == ''){
        $('#pwdmsg').text("请输入您的密码");
        $("#pwd").focus();
        return;
    }else{
        $('#pwdmsg').text('');
    }
    if(pwd.length < 6){
        $('#pwdmsg').text("登陆密码不能小于6位");
        $("#pwd").focus();
        return;
    }else{
        $('#pwdmsg').text('');
    }

    if(pwd != $.trim($("#cpwd").val())) {
        $('#cpwdmsg').text("两次密码不一致");
        $("#cpwd").focus();
        return;
    }else{
        $('#cpwdmsg').text('');
    }

    var param = {
        url : baseUrl + "apiClient/password",
        params : {
            mobile : mobile,
            newPassword : pwd,
            confirmPassword :$('#cpwd').val(),
            type : 2,
        },
        callback : function(d){
            if(d.code == 2){
                $('#cpwdmsg').text('两次密码不一致');
                $("#cpwd").focus();
                return;
            }else if(d.code == -3){
                alert('参数有误');
                return;
            }else if(d.code == 3){
                $("#yzmmsg").text('验证码输入有误');
                $("#vcode").focus();
                return ;
            }else if(d.code == 1){
                $("#phonemsg").text("");
                $("#vcode").val("");
                $('#yzmmsg').text('');
                $("#pwd").val("");
                $("#pwdmsg").text("");
                $("#cpwd").val("");
                $('#cpwdmsg').text('');
                $.cookie("userResetPwd_" + mobile + "", "");
                alert("重置密码成功");
            }
        }
    }
    ajax(param);
}

function ajax(p){
    $.post(p.url,p.params,function(data){
        if(typeof(p.callback) == 'function'){
            p.callback(data);
        }
    },'json');
}

//粗略验证手机号
function isMobile(mobile){
    var re = /^1[0-9]{10}$/;
    if(re.test(mobile))
        return true;
    else
        return false;
}