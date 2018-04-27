/*swiper选项卡切换*/
$(function () {
    $("#mainPage").load("main.html");
    $("#footerPage").load("footer.html");

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

});
var pageNo = 1;
$(document).ready(function(){
    $('.previous').click(function(){
        if(pageNo == total){
            $(this).next('i').show();
            alert('这已经是第一页了');
        }else{
            pageNo -= 1;
            reladPage();
        }
    });
    $('.next').click(function(){
        //alert(total);
        if(pageNo == total){
            $(this).next('i').show();
            alert('这已经是最后一页了');
        }else{
            pageNo += 1;
            reladPage();
        }
    })
});
function reladPage(){
    $.ajax({
        type: "post",
        url: "http://client.urbanfit.cn/apiCoach/list",
        data: {"pageNo": pageNo, "pageSize": 10},
        dataType: "json",
        success: function (res) {
            var listbox = '';
            var Page = '';
            if (res.code == 1) {
                var baseUel0 = res.data.baseUrl; //图片地址上前缀
                var lstCoach = res.data.lstCoach;
                var totalRecord = res.data.totalRecord;
                total = Math.ceil(totalRecord/10);
                if(total == 1){
                    Page += '<span>'+pageNo+'</span>';
                    $('.page').hide();
                }else{
                    $('.page').show();
                    Page += '<span>'+pageNo+'-'+total+'</span>';
                }
                $.each(lstCoach, function (k, v) {
                    //alert(v.content);
                    listbox += '<li>';
                    listbox += '<div>';
                    listbox += '<span><img src="'+baseUel0+v.headPortrait+'"></span>';
                    listbox += '    <h2>'+v.coachName+'<span>'+v.coachTitle+'</span></h2>';
                    listbox += '</div>';
                    listbox += '<p>'+v.introduce+'</p>';
                    listbox += '</li>';

                });
                $("#coachlist").html(listbox);
                $("#page").html(Page);
            } else {
                alert("接口请求错误");
            }
        }
    });
};
reladPage();