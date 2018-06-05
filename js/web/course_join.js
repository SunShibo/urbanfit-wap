var courseId;
var storeId;
var detailId;
$(function() {
    if(clientIsLogin() == true){
        $("#submitorder").click(submitorder);  //cookie值不为空的时候  调用下单接口
    }else(
        $("#submitorder").click(function(){
            window.location.href = "login.html";//否则跳转登录页
        })
    );

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
                $("#courseSize").val(data.data.sizeName);
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
        data: {"couponNum" : couponNum},
        success: function(result){
            if(result.code == 1){
                $('#change').hide();
                $('#changebtn').show();
                $('#couponName').text(result.data.couponName).show();
                var coursePrice = $("input[name='coursePrice']").val();
                $("#couponprice").text(coursePrice * result.data.percent / 100);
                $("#payPrice").text(coursePrice - (coursePrice * result.data.percent / 100));
                $("#couponDiv").show();
            }else{
                alert('优惠码不存在');
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
    var params = {
        "childrenName" : name,
        "clientMobile" : mobile,
        "couponNum" : $("#ma").val(),
        "courseId" : courseId,
        "payment" : payWay,
        "storeId" : storeId,
        "detailId" : detailId,
        "remarks" : remarks
    };
    $.ajax({
        type:"post",
        url: baseUrl + "wapOrder/addOrder",
        dataType: "json",
        data: {"params" : JSON.stringify(params), "clientId": clientId},
        success: function(result){
            if(result.code == 1){
                if(result.code == 1){
                    if(payWay == 0){   // 支付宝支付
                        $('body').append(result.data);
                        $("form").attr("target", "_blank");
                    }else if(payWay == 1){       // 微信支付
                        window.location.href = result.data.wechatPayUrl;
                    }
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