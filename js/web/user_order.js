$(function(){
    queryOrderMaster();
})

function queryOrderMaster(){
    $.ajax({
        url : baseUrl + "order/orderList",
        type : "post",
        data : {},
        dataType : "json",
        success : function(result){
            var lstOrder = result.data.lstOrder
            if(lstOrder != ""){
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
                    orderArr.push('         <a href="javascript:;" class="see">查  看</a>');
                    orderArr.push('     </li>')
                    orderArr.push('  </ul>');
                    orderArr.push('</li>');
                })
                $("#orderListInfo").html(orderArr.join(""));
            }
        }
    });
}