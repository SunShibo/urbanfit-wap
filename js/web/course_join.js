var courseId;
var storeId;
var detailId;
$(function() {
    if(isWeixinBrowser()){     // 如果是在微信浏览器内部打开，不支持支付宝支付
        $("#alipayDiv").hide();
        $("#alipayDiv").removeClass("seleted");
        $("#wechatDiv").addClass("seleted");
        $("#alipayDivImg").attr("src", "img/radio.png");
        $("#wechatDivImg").attr("src", "img/radio1.png");
    }

    $("#submitorder").click(function () {
        if(clientIsLogin() == true){
            submitorder();  //cookie值不为空的时候  调用下单接口
        }else{
            window.location.href = "client_login.html?courseId=" + courseId + "&storeId=" + storeId
                + "&detailId=" + detailId;
        }
    })

    //加载头部底部
    $("#mainPage").load("main.html");
    $("#footerPage").load("footer.html");

    courseId = getParamValue("courseId");
    storeId = getParamValue("storeId");
    detailId = getParamValue("detailId");
    initCourseDetail();

    $('.input').focus(function () {
        $('.input').css("border-color", "#ebebeb");
        $(this).css("border-color", "#f6d332");
    });

    $(".radio").click(function () {
        $(".radio").each(function (i, v) {
            $(this).find('.radioimg').attr('src', './img/radio.png');
            $(this).removeClass("seleted");
        });
        $(this).find('.radioimg').attr('src', './img/radio1.png');
        $(this).addClass('seleted');
    });

    $("#changebtn").click(queryCouponInfo);
    $('#change').click(queryCouponInfo);
});

function openClientLoginLayer(){
    layer.open({
        title : '登录',
        type: 2,
        content : "login_layer.html?courseId=" + courseId + "&storeId=" + storeId + "&detailId=" + detailId,
        area: ['100%', '100%'],
        full: true,
        end : function (){
            var loginStatus = $("body").data("LOGIN_STATUS");
            if(loginStatus == "success"){
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
            }
        }
    });
}

function initCourseDetail(){
    $.ajax({
        type : "post",
        url : baseUrl + "apiCourse/queryDetail",
        data : {"courseId" : courseId, "storeId" : storeId, "detailId" : detailId},
        dataType : "json",
        async : false,
        success : function (data){
            if(data.code != 1){
                alert(data.msg);
                return ;
            }else{
                var store = data.data.store;
                $("#storeName").val(store.storeName);
                $("#storeAddress").val(store.storeAddress);
                var course = data.data.course;
                $("#courseName").val(course.courseName);
                var courseSizeDetail = data.data.courseSizeDetail;
                $("#coursePrice").val("￥" + courseSizeDetail.sizePrice);
                $("input[name='payPrice']").val(courseSizeDetail.sizePrice);
                $("#courseSize").val(data.data.sizeName);
                $("input[name='coursePrice']").val(courseSizeDetail.sizePrice);
            }
        }
    })
}

function queryCouponInfo(){
    var couponNum = $.trim($("#ma").val());
    if(couponNum == ''){
        alert('优惠码不能为空');
        $("#ma").focus();
        return;
    }

    $.ajax({
        type:"post",
        url: baseUrl + "apiCoupon/detail ",
        dataType: "json",
        data: {"couponNum" : couponNum, "courseId" : courseId},
        success: function(result){
            if(result.code == 1){
                $('#change').hide();
                $('#changebtn').show();
                $('#couponName').text(result.data.couponName).show();
                $("#price").text($("input[name='coursePrice']").val());
                var type = result.data.type;
                $("#price").text($("input[name='coursePrice']").val());
                var coursePrice = $("input[name='coursePrice']").val();
                if(type == 0){      // 折扣券
                    $("#couponprice").text(coursePrice * result.data.percent / 100);
                    var payPrice = coursePrice - (coursePrice * result.data.percent / 100);
                    $("#payPrice").text(payPrice >= 0 ? payPrice : 0);
                    $("#couponDiv").show();
                    $("input[name='payPrice']").val(payPrice);
                }else if(type == 1){         // 抵扣券
                    $("#couponprice").text(result.data.minusMoney);
                    var payPrice = coursePrice - result.data.minusMoney;
                    $("#payPrice").text(payPrice >= 0 ? payPrice : 0);
                    $("#couponDiv").show();
                    $("input[name='payPrice']").val(payPrice);
                }
            }else{
                alert(result.msg);
                $('#couponName').text("").hide();
                $("#couponDiv").hide();
            }
        }
    });
}

function submitorder(){
    var payWay = "";
    $(".radio").each(function(i,v){
        if($(this).hasClass("seleted")){
            if ($(this).attr("seleted-value") == "alipay"){
                payWay = 0 ;
            }
            if ($(this).attr("seleted-value") == "wechatpay"){
                payWay = 1 ;
            }
        };
    });

    var name = $.trim($("#name").val());
    if(name == ''){
        alert('姓名不能为空');
        $("#name").focus();
        return;
    }
    var mobile = $.trim($("#phone").val());
    if(!isMobile(mobile)){
        alert('请输入正确的手机号');
        $("#phone").focus();
        return;
    }
    var remarks = $("#remarks").val();
    var wechatType = isWeixinBrowser() ? 2 : 1;  // 微信内部为微信公众号
    var params = {
        "childrenName" : name,
        "clientMobile" : mobile,
        "couponNum" : $("#ma").val(),
        "courseId" : courseId,
        "payment" : payWay,
        "storeId" : storeId,
        "detailId" : detailId,
        "remarks" : remarks,
        "wechatType" : wechatType
    };

    var payPrice = $("input[name='payPrice']").val();
    if(payPrice == 0){
        if(isWeixinBrowser()){   // 微信内部浏览器支付信息
            var redirectUrl = encodeURIComponent(wechatPayUrl + "wechat_code.html?params="
                + JSON.stringify(params) + "&clientId=" + clientId + "&type=add");

            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfceafb8ea3eae188" +
                "&redirect_uri=" + redirectUrl + "&response_type=code&scope=snsapi_base#wechat_redirect";
        }else{       // 微信外部浏览器支付信息
            payOrderMaster(params, payWay);
        }
    }else{
        payOrderMaster(params, payWay);
    }
}

function payOrderMaster(params, payWay){
    $.ajax({
        type:"post",
        url: baseUrl + "wapOrder/addOrder",
        dataType: "json",
        data: {"params" : JSON.stringify(params), "clientId": clientId},
        success: function(result){
            if(result.code == 1){
                if(payWay == 0){   // 支付宝支付
                    $('body').append(result.data);
                    $("form").attr("target", "_blank");
                }else if(payWay == 1){       // 微信支付
                    window.location.href = result.data.wechatPayUrl;
                }
            }else if(result.code == 2){
                window.location.href = "user_order.html";
            } else{
                alert(result.msg);
                return ;
            }
        }
    });
}

function addOrderMaster(params, clientId){
    $.ajax({
        type:"post",
        url: baseUrl + "wapOrder/addOrder",
        dataType: "json",
        data: {"params" : JSON.stringify(params), "clientId": clientId},
        success: function(result){
            if(result.code == 1){
                if(payWay == 0){   // 支付宝支付
                    $('body').append(result.data);
                    $("form").attr("target", "_blank");
                }else if(payWay == 1){       // 微信支付
                    window.location.href = result.data.wechatPayUrl;
                }
            }else{
                alert(result.msg);
                return ;
            }
        }
    });
}

//粗略验证手机号
function isMobile(mobile){
    var re = /^1[0-9]{10}$/;
    var validCode=true;
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

function isWeixinBrowser() {
    var agent = navigator.userAgent.toLowerCase();
    if (agent.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}