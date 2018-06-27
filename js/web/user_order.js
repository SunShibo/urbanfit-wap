$(function(){
    if(isWeixinBrowser()){     // 如果是在微信浏览器内部打开，不支持支付宝支付
        $("#alipayDiv").hide();
        $("#alipayDiv").removeClass("seleted");
        $("#wechatDiv").addClass("seleted");
        $("#alipayDivImg").attr("src", "img/radio.png");
        $("#wechatDivImg").attr("src", "img/radio1.png");
    }

    $("#mainPage").load("main.html");
    $("#footerPage").load("footer.html");
    queryOrderMasterList();
    $("#A_payOrder").click(payOrderMasterAgain);
    $('.close').click(function(){
        $('.tan').css({'display':'none'});
        $('.tanbox').hide();
        $('.tanbox1').hide();
    })

    $(".radio").click(function () {
        $(".radio").each(function (i, v) {
            $(this).find('.radioimg').attr('src', './img/radio.png');
            $(this).removeClass("seleted");
        });
        $(this).find('.radioimg').attr('src', './img/radio1.png');
        $(this).addClass("seleted");
    });

    // 查询上一页
    $('.previous').click(function(){
        if(pageNo == 1){
            $(this).next('i').show();
            alert('这已经是第一页了');
        }else{
            pageNo -= 1;
            queryOrderMasterList();
        }
    })

    // 查询下一页
    $('.next').click(function(){
        if(pageNo == total){
            $(this).next('i').show();
            alert('这已经是最后一页了');
        }else{
            pageNo += 1;
            queryOrderMasterList();
        }
    })
})

var pageNo = 1;
function queryOrderMasterList(){
    if(clientIsLogin() == false){
        alert("请您先登录账号");
        return ;
    }
    var wechatType = isWeixinBrowser() ? 2 : 1;
    $.ajax({
        url : baseUrl + "wapOrder/list",
        type : "post",
        data : {"clientId" : clientId, "pageNo" : pageNo, "pageSize" : 10, "wechatType" : wechatType},
        dataType : "json",
        success : function(result){
            var lstOrder = result.data.lstOrder
            if(lstOrder != ""){
                var totalRecord = result.data.totalRecord;
                total = Math.ceil(totalRecord/10);
                var Page = '';
                if(total == 1){
                    Page += '<span>' + pageNo + '</span>';
                }else{
                    Page += '<span>' + pageNo + '-' + total + '</span>';
                }
                var orderArr = [];
                $.each(lstOrder, function(i, n){
                    var orderStatus = "待支付"
                    if(n.status == 1){
                        orderStatus = "已支付";
                    }else if(n.status == 2){
                        orderStatus = "已退款";
                    }else if(n.status == 3){
                        orderStatus = "系统自动取消";
                    }
                    orderArr.push('<li>');
                    orderArr.push('  <p>订单号：' + n.orderNum + ' <span class="span">' + orderStatus +'</span></p>');
                    orderArr.push('  <ul>');
                    orderArr.push('     <li class="dian1"><i></i>课程名称：' + n.courseName + '</li>');
                    orderArr.push('     <li class="dian2"><i></i>学生姓名：' + n.childrenName + '</li>');
                    orderArr.push('     <li class="dian3"><i></i>' + n.createTime + '</li>');
                    orderArr.push('     <li class="dian4"><i></i>价格：￥' + n.price);
                    orderArr.push('         <a href="javascript:void(0);" data-ordernum="' + n.orderNum + '" class="see">查  看</a>');
                    if(n.status == 0){  // 待支付
                        orderArr.push('     <a href="javascript:void(0);" data-ordernum="' + n.orderNum + '" class="pay1">支  付</a>');
                    }
                    orderArr.push('     </li>');
                    orderArr.push('  </ul>');
                    orderArr.push('</li>');
                })

                $("#orderListInfo").html(orderArr.join(""));
                $("#page").html(Page);

                // 查询订单详情
                $('.see').click(function(){
                    var orderNum = $(this).data("ordernum");
                    queryOrderMasterDetail(orderNum);
                });
                // 订单支付
                $('.pay1').click(function(){
                    var orderNum = $(this).data("ordernum");
                    choosePayment(orderNum);
                })
            }else{
                $(".page").html("");
            }
        }
    });
}

// 查询订单详情
function queryOrderMasterDetail(orderNum){
    $.ajax({
        url : baseUrl + "wapOrder/detail",
        type : "post",
        data : {"orderNum" : orderNum},
        dataType : "json",
        success : function(result){
            if(result.code == 1){
                $("#childrenNameLabel").text(result.data.childrenName);
                $("#mobileLabel").text(result.data.clientMobile);
                $("#courseDistrictLabel").text(result.data.courseDistrict);
                var payment = "支付宝";
                if(result.data.payment == 1){
                    payment = "微信";
                }
                $("#paymentLabel").text(payment);
                $("#payPriceLabel").text(result.data.payPrice);
                var orderStatus = "待支付"
                if(result.data.status == 1){
                    orderStatus = "已支付";
                }else if(result.data.status == 2){
                    orderStatus = "已退款";
                }else if(result.data.status == 3){
                    orderStatus = "系统自动取消";
                }
                $("#statusLabel").text(orderStatus);
                $("#courseNameLabel").text(result.data.courseName);
                $("#coursePriceLabel").text(result.data.price);
                $("#createTimeLabel").text(result.data.createTime);
                $("#storeNameLabel").text(result.data.storeName);
                $("#storeAddressLabel").text(result.data.storeAddress);
                $("#courseSizeLabel").text(result.data.courseSize);
                if(result.data.isUseCoupon == 1){
                    $("li[name^='couponInfo']").show();
                    $("#couponPriceLabel").text(result.data.couponPrice);
                    $("#couponNameLabel").text(result.data.couponName);
                }
                if(result.data.remarks != ""){
                    $("#remarksLabel").text(result.data.remarks);
                    $("#remarksInfo").show();
                }
                // 打开弹窗
                $('.tan').css({'display':'flex'});
                $('.tanbox1').show();
            }else{
                alert(result.msg);
                return ;
            }
        }
    })
}


function choosePayment(orderNum){
    $("input[name='payOrderNum']").val(orderNum);
    $('.tan').css({'display':'flex'});
    $('.tanbox').show();
}

function payOrderMasterAgain(){
    $('.tan').css({'display':'none'});
    $('.tanbox').hide();
    $('.tanbox1').hide();

    var orderNum = $("input[name='payOrderNum']").val();
    var payWay = "";
    $(".radio").each(function(i, v){
        if($(this).hasClass("seleted")){
            if ($(this).attr("seleted-value") == "alipay"){
                payWay = 0 ;
            }
            if ($(this).attr("seleted-value") == "wechatpay"){
                payWay = 1 ;
            }
        };
    });

    // 订单再支付
    var params = {
        "payment" : payWay,
        "orderNum" : orderNum
    };

    if(isWeixinBrowser()){   // 微信内部浏览器支付信息
        var redirectUrl = encodeURIComponent(wechatPayUrl + "wechat_code.html?params="
            + JSON.stringify(params) + "&type=payAgain");

        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfceafb8ea3eae188" +
            "&redirect_uri=" + redirectUrl + "&response_type=code&scope=snsapi_base#wechat_redirect";
    }else {       // 微信外部浏览器支付信息
        $.ajax({
            url: baseUrl + "wapOrder/payOrderAgain",
            type: "post",
            data: {"params": JSON.stringify(params)},
            dataType: "json",
            success: function (result) {
                if (result.code == 1) {
                    if (payWay == 0) {   // 支付宝支付
                        $('body').append(result.data);
                        $("form").attr("target", "_blank");
                    } else if (payWay == 1) {
                        window.location.href = result.data.wechatPayUrl;
                    }
                }
            }
        });
    }
}

function isWeixinBrowser() {
    var agent = navigator.userAgent.toLowerCase();
    if (agent.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}