//加载头部底部
$(function(){
    $("#mainPage").load("main.html");
    $("#footerPage").load("footer.html");

    $("#city_info").citySelect({
        prov : "",
        city : "",
        dist : "",
        nodata: "none",
        required: false
    });

    /*swiper选项卡切换*/
    //navbox 是你导航的className,active是你当前状态的className
    var $tabList =  $('#navbox .swiper-slide'),
        lens= $tabList.length; /*获取选项卡长度*/
    var index = 0; /*设置初始索引为0  即 没有哈希值的时候显示第一个选项卡内容*/
    var hash = window.location.hash;
    /* *
     * 获取哈希值（你也可以获取整个url剪切出你要的字段）。根据哈希值中设置的数字显示对应的选项卡内容；
     * 例如：SwiperPC.html#slide1对应显示第索引值为1的选项卡内容即第二个选项卡
     * */
    if(hash){
        value = hash.match(/\d/g).join('');
        index = Number(value);/*字符串转换为数字*/
        index = parseInt(index)%lens;
    }
    $tabList.eq(index).addClass('active');
    tabs('#navbox .swiper-slide','#tabs-container','active',index);
    // 初始化门店信息
    queryStore();
    // 根据关于我们类型查询
    var url = document.location.href;
    var urlList = url.split('#');
    var a = urlList[1];

    $("#proviceId").change(function(){
        queryStore();
    });
    $("#cityId").change(function(){
        queryStore();
    });
    $("#districtId").change(function(){
        queryStore();
    });
});


var pageNo = 1;
function queryStore(){
    var provice = $("#proviceId").val();
    var city = $("#cityId").val();
    var district = $("#districtId").val();
    $.ajax({
         url : "http://client.urbanfit.cn/apiStore/list",
         type : "post",
         data : {"provice" : provice, "city" : city, "district" : district , "pageNo" : pageNo, "pageSize" : 10},
         dataType : "json",
         success : function (result){
            var html1 = '';
            if(result.code == 1){
                var lstStore = result.data.lstStore;
                if(lstStore != ""){
                    $.each(lstStore, function (k, v) {
                        html1 += '<li>';
                        html1 += '<h3><img src="img/ling.png">'+ v.storeName+'</h3>';
                        html1 += '    <p>'+ v.storeDistrict+ v.storeAddress+'</p>';
                        html1 += '<p>电话:'+ v.mobile+'</p>';
                        html1 += '<p>联系:'+ v.contactName+'</p>';
                        html1 += '</li>';

                    });
                    $(".matchul").html(html1);
                }
             }else{
                 alert(result.msg);
                 return ;
             }
        }
    })
 }
