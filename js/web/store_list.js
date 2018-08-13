// 当前页数
var pageNo = 1;
$(function (){
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
})

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
                var baseUrl = result.data.baseUrl;
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
                        html1 += '<a href="store_detail.html?storeId=' + v.storeId + '">';
                        var imageUrl = "img/tupian.jpg";
                        if(v.storeImageUrl != ""){
                            imageUrl = baseUrl + v.storeImageUrl;
                        }
                        html1 += '<img src="' + imageUrl + '">';
                        html1 += '<h1>' + v.storeName + '</h1>';
                        html1 += '<p><img src="img/zhi.jpg"><span>' + v.storeDistrict + "      " + v.storeAddress + '</span></p>';
                        html1 += "</a>";
                        html1 += '</li>';
                    });
                    $("#page").html(Page);
                    $(".page").show();
                }else{
                    $(".page").hide();
                }
                $("#storeDiv").html(html1);
            } else {
                $(".page").hide();
            }
        }
    })
}
