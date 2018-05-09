// 当前页数
var pageNo = 1;

$(function(){
    //加载头部底部
    $("#mainPage").load("main.html");
    $("#footerPage").load("footer.html");


    // 初始化门店信息
    queryStoreList();
    $("#proviceId").change(queryStoreList);
    $("#cityId").change(queryStoreList);
    $("#districtId").change(queryStoreList);

    // 查询上一页
    $('.previous').click(function(){
        if(pageNo == 1){
            $(this).next('i').show();
            alert('这已经是第一页了');
        }else{
            pageNo -= 1;
            queryStoreList();
        }
    })

    // 查询下一页
    $('.next').click(function(){
        if(pageNo == total){
            $(this).next('i').show();
            alert('这已经是最后一页了');
        }else{
            pageNo += 1;
            queryStoreList();
        }
    })
});

function queryStoreList(){
    var provice = $("#proviceId").val();
    var city = $("#cityId").val();
    var district = $("#districtId").val();
    $.ajax({
        url : baseUrl + "apiStore/list",
        type : "post",
        data : {"provice" : provice, "city" : city, "district" : district , "pageNo" : pageNo, "pageSize" : 10},
        dataType : "json",
        success : function (result) {
            var html1 = '';
            if (result.code == 1 && totalRecord != 0) {
                var lstStore = result.data.lstStore;
                var totalRecord = result.data.totalRecord;
                if (lstStore != "") {
                    total = Math.ceil(totalRecord / 10);
                    var Page = '';
                    if (total == 1) {
                        Page += '<span>' + pageNo + '</span>';
                    } else {
                        Page += '<span>' + pageNo + '-' + total + '</span>';
                    }
                    $.each(lstStore, function (k, v) {
                        html1 += '<li>';
                        html1 += '<h3><img src="img/ling.png">' + v.storeName + '</h3>';
                        html1 += '    <p>' + v.storeDistrict + v.storeAddress + '</p>';
                        /*html1 += '<p>电话:' + v.mobile + '</p>';
                         html1 += '<p>联系:' + v.contactName + '</p>';*/
                        html1 += '</li>';
                    });
                    $("#page").html(Page);
                }
                $(".page").show();
                $(".matchul").html(html1);
            } else {
                $(".page").hide();
            }
        }
    })
}
