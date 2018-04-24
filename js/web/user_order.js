$(function(){
    $("#mainPage").load("main.html");
    $("#footerPage").load("footer.html");
    queryOrderMasterList();

    $('.close,.yes').click(function(){
        $('.tan').css({'display':'none'});
        $('.tanbox').hide();
        $('.tanbox1').hide();
    })

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
    $.ajax({
        url : baseUrl + "order/orderList",
        type : "post",
        data : {"clientId" : 1, "pageNo" : pageNo, "pageSize" : 10},
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
                    payOrderMaster(orderNum);
                })
            }
        }
    });
}

// 查询订单详情
function queryOrderMasterDetail(orderNum){
    $.ajax({
        url : baseUrl + "order/queryOrderDetail",
        type : "post",
        data : {"orderNum" : orderNum, "clientId" : 1},
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
                if(result.data.isUseCoupon == 1){
                    $("li[name^='couponInfo']").show();
                    $("#couponPriceLabel").text(result.data.couponPrice);
                    $("#couponNameLabel").text(result.data.couponName);
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

function payOrderMaster(orderNum){
    var url = baseUrl + "order/payWechatCommonAgain";
    var appid = "wxfceafb8ea3eae188";
    var weixinUrl="https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri="
        + encodeURI(url) + "&response_type=code&scope=snsapi_userinfo&state=" + orderNum + "#wechat_redirect";
    window.location.href = encodeURI(weixinUrl);

    /*var params = {
        "payment" : 1,
        "orderNum" : orderNum
    };
    $.ajax({
        url : baseUrl + "order/payWechatCommonAgain",
        type : "post",
        data : {"clientId" : 1, "params" : JSON.stringify(params)},
        dataType : "json",
        success : function (result){
            alert("微信支付！！！");
        }
    });*/
}