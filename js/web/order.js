$(function() {
    initCourseDistrict();
    $("#submitorder").click(submitorder);

    //加载头部底部
    $("#mainPage").load("main.html");
    $("#footerPage").load("footer.html");

    $('.input').focus(function () {
        $('.input').css("border-color", "#ebebeb");
        $(this).css("border-color", "#f6d332");
    })

    $("#s_province").change(changeProvince);
    $("#s_city").change(changeCity);

    $(".radio").click(function () {
        $(".radio").each(function (i, v) {
            $(this).find('.radioimg').attr('src', '../img/radio.png');
            $(this).removeClass("seleted");
        });
        $(this).find('.radioimg').attr('src', '../img/radio1.png');
        $(this).addClass('seleted');
    });

    $("#changebtn").click(queryCouponInfo);
    $('#change').click(queryCouponInfo);
})

function queryCouponInfo(){
    var couponNum = $.trim($("#ma").val());
    if(couponNum == ''){
        alert('优惠码不能为空');
        $("#ma").focus();
        return;
    }

    $.ajax({
        type:"post",
        url:"http://client.urbanfit.cn/coupon/detail ",
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

    var proviceInfo = $("#s_province").val();
    var cityInfo = $("#s_city").val();
    var districtInfo = $("#s_county").val();
    var courseDistrict = proviceInfo + "," + cityInfo;
    if(districtInfo != ""){
        courseDistrict += "," + districtInfo;
    }

    var params = {
        "childrenName" : name,
        "clientMobile" : mobile,
        "couponNum" : $("#ma").val(),
        "courseId" : $('#courseId').val(),
        "payment" : payWay,
        "courseDistrict" : courseDistrict
    }
    $.ajax({
        type:"post",
        url:"http://client.urbanfit.cn/order/add",
        dataType: "json",
        data: {"params" : JSON.stringify(params)},
        success: function(result){
            if(result.code == 1){
                if(payWay == 0){   // 支付宝支付
                    $('body').append(result.data);
                    $("form").attr("target", "_blank");
                }else if(payWay == 1){  // 微信支付
                    var orderNum = result.data.orderNum;
                    var wechatPayQr = result.data.wechatPayQr;
                    window.location.href = "/order/wechatPay?orderNum=" + orderNum
                        + "&wechatPayQr=" + wechatPayQr;
                }
            }else{
                alert('参数有误');
            }
        }
    });
    //粗略验证手机号
    function isMobile(mobile){
        var re = /^1[0-9]{10}$/;
        var validCode=true;
        if(re.test(mobile))
            return true;
        else
            return false;
    }
}


function initCourseDistrict(){
    var courseDistrict = $("input[name='courseDistrict']").val();
    if(courseDistrict != ""){
        var districtProvinceArr = [];
        var districtProvinceHtml = [];
        var districtArr = courseDistrict.split("#");
        // 初始化省信息
        var province = "";
        var city = "";
        $.each(districtArr, function (i, n){
            var districDetailtArr = n.split(",");
            if(i == 0){
                province = districDetailtArr[0];
                city = districDetailtArr[1];
            }
            if(districtProvinceArr.indexOf(districDetailtArr[0]) < 0){
                districtProvinceArr.push(districDetailtArr[0]);
                districtProvinceHtml.push('<option value="' + districDetailtArr[0] + '">' + districDetailtArr[0] + '</option>');
            }
        });
        $("#s_province").html(districtProvinceHtml.join(""));
        // 初始化市信息
        var districtCityArr = [];
        var districtCityHtml = [];
        $.each(districtArr, function (i, n){
            var districDetailtArr = n.split(",");
            if(districDetailtArr[0] == province && districtCityArr.indexOf(districDetailtArr[1]) < 0){
                districtCityArr.push(districDetailtArr[1]);
                districtCityHtml.push('<option value="' + districDetailtArr[1] + '">' + districDetailtArr[1] + '</option>');
            }
        });
        $("#s_city").html(districtCityHtml.join(""));
        // 初始化区信息
        var districtCountyArr = [];
        var districtCountyHtml = [];
        $.each(districtArr, function (i, n){
            var districDetailtArr = n.split(",");
            if (districDetailtArr.length == 3 && districDetailtArr[1] == city && districtCountyArr.indexOf(districDetailtArr[2]) < 0) {
                districtCountyArr.push(districDetailtArr[2]);
                districtCountyHtml.push('<option value="' + districDetailtArr[2] + '">' + districDetailtArr[2] + '</option>');
            }
        });
        $("#s_county").html(districtCountyHtml.join(""));
    }
}

function changeProvince(){
    var province = $(this).val();
    var courseDistrict = $("input[name='courseDistrict']").val();
    if(courseDistrict != ""){
        var districtCityArr = [];
        var districtCityHtml = [];
        var city = "";
        // 初始化市信息
        var districtArr = courseDistrict.split("#");
        $.each(districtArr, function (i, n){
            var districDetailtArr = n.split(",");
            if(districDetailtArr[0] == province && districtCityArr.indexOf(districDetailtArr[1]) < 0){
                if(i == 0){
                    city = districDetailtArr[1];
                }
                districtCityArr.push(districDetailtArr[1]);
                districtCityHtml.push('<option value="' + districDetailtArr[1] + '">' + districDetailtArr[1] + '</option>');
            }
        });
        $("#s_city").html(districtCityHtml.join(""));
        // 初始化区信息
        var districtCountyArr = [];
        var districtCountyHtml = [];
        $.each(districtArr, function (i, n){
            var districDetailtArr = n.split(",");
            if (districDetailtArr.length == 3 && districDetailtArr[1] == city && districtCountyArr.indexOf(districDetailtArr[2]) < 0) {
                districtCountyArr.push(districDetailtArr[2]);
                districtCountyHtml.push('<option value="' + districDetailtArr[2] + '">' + districDetailtArr[2] + '</option>');
            }
        });
        $("#s_county").html(districtCountyHtml.join(""));
    }
}

function changeCity() {
    var city = $(this).val();
    var courseDistrict = $("input[name='courseDistrict']").val();
    if (courseDistrict != "") {
        var districtCountyArr = [];
        var districtCountyHtml = [];
        var districtArr = courseDistrict.split("#");
        $.each(districtArr, function (i, n) {
            var districDetailtArr = n.split(",");
            if (districDetailtArr.length == 3 && districDetailtArr[1] == city && districtCountyArr.indexOf(districDetailtArr[2]) < 0) {
                districtCountyArr.push(districDetailtArr[2]);
                districtCountyHtml.push('<option value="' + districDetailtArr[2] + '">' + districDetailtArr[2] + '</option>');
            }
        });
        $("#s_county").html(districtCountyHtml.join(""));
    }
}
