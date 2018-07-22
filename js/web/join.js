$(function (){
    $("#footerPage").load("footer.html");
    $("#A_register").click(checkForm);
    $('#sendcode').click(sendVcode);
});

//获取短信验证
function sendVcode(){
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
            type:0,
        },
        callback : function(d){
            if(d.code==0){
                $('#phonemsg').text('手机号码已经存在');
                $("#phone").focus();
                return;
            }else if(d.code==1){
                var messageCode = d.data.messageCode;
                $.cookie("register_" + phone + "", messageCode, {path:'/'});
                var time=60;
                var t=setInterval(function(){
                    $(_this).html('('+time+'s)后重发');
                    time--;
                    if(time==0){
                        clearInterval(t);
                        $(_this).html("重新获取");
                        isWaiting=true;
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

function checkForm(){
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
    var messageCode = $.cookie("register_" + mobile + "");
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
        url : baseUrl + "apiClient/register",
        params : {
            mobile : mobile,
            password : pwd,
            confirmPassword :$('#cpwd').val()
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
                // 成功跳转下一步
                $('#cpwdmsg').text('');
                $('#yzmmsg').text('');
                $.cookie("register_" + mobile + "", "");
                var user_str = JSON.stringify(d.data);
                $.cookie('webuser', user_str, {path:'/'});
                var type = getParamValue("type");
                if(type == "loginPage"){
                    window.location.href = wechatPayUrl;
                }else if(type == "orderPage"){
                    var courseId = getParamValue("courseId");
                    var storeId = getParamValue("storeId");
                    var detailId = getParamValue("detailId");
                    window.location.href = wechatPayUrl + "course_join.html?courseId=" + courseId
                        + "&storeId=" + storeId + "&detailId=" + detailId;
                }
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

function getParamValue(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}