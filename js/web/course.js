var courseId = 1;
/*swiper选项卡切换*/
$(function () {
    //navbox 是你导航的className,active是你当前状态的className
    var $tabList =  $('#navbox .swiper-slide'),
        lens= $tabList.length; /*获取选项卡长度*/
    var index = 1; /*设置初始索引为0  即 没有哈希值的时候显示第一个选项卡内容*/
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

    //加载头部底部
    $("#mainPage").load("main.html");
    $("#footerPage").load("footer.html");

    // 根据课程类型查询
    var url = document.location.href;
    var urlList = url.split('#');
    var a = urlList[1];
    //alert(a);
    if (a == 'slider1') {
        //alert(index);
        courseId = index + 1;
        //alert(courseId);
        queryCourseInfo();
        //console.log('123courseDistrict: ' + $("input[name='courseDistrict']").val());
    }
});

function queryCourseInfo(){
    //alert(courseId);
    $.ajax({
        url : "http://client.urbanfit.cn/course/courseDetail",
        type : "post",
        data : {"courseId" : courseId},
        dataType : "json",
        success : function (result, status){
            var html1 = '';
            var html2 = '';
            if(result.code == 1){
                var baseUrl = result.data.baseUrl;  // 图片地址前缀
                var course = JSON.parse(result.data.course);
                if(course != ""){
                    html1 += '    <div class="sellimg">';
                    html1 += '        <img src="'+baseUrl+course.courseImageUrl+'">';
                    html1 += '   </div>';
                    html1 += '   <h2>赛法斗-青少年课程</h2>';
                    html1 += '   <ul class="sellbox">';
                    html1 += '       <li>';
                    html1 += '            <p><img src="img/yang.jpg" width="16" height="16">';
                    html1 += '               价&emsp;&emsp;格：</p>';
                    html1 += '            <span>'+course.coursePrice+'元</span>';
                    html1 += '        </li>';
                    html1 += '        <li>';
                    html1 += '            <p><img src="img/zhi.jpg" width="15" height="20">';
                    html1 += '               上课地域：</p>';
                    html1 += '           <div class="select">';
                    html1 += '<input type="hidden" name="courseDistrict" id="district" value="'+course.courseDistrict+'">';
                    html1 += '              <div id="city_info">';
                    html1 += '                  <select id="s_province" name="s_province"></select>';
                    html1 += '                 <select id="s_city" name="s_city" ></select>';
                    html1 += '                 <select id="s_county" name="s_county"></select>';
                    html1 += '             </div>';
                    html1 += '          </div>';
                    html1 += '      </li>';
                    html1 += '      <li>';
                    html1 += ' <input type="hidden" name="courseId" value="'+course.courseId+'">';
                    html1 += '          <a href="javascript:;" id="A_join_course">我要报名</a>';
                    html1 += '      </li>';
                    html1 += '   </ul>';
                    html2 += '    <div class="coursebox">';
                    html2 += course.introduce;
                    html2 += '   </div>';
                }
                //console.log(html);
                $(".sell").html(html1);
                $(".course").html(html2);

                //调用地址管理
                initCourseDistrict();
                $("#s_province").change(changeProvince);
                $("#s_city").change(changeCity);
                $("#A_join_course").click(joinCourse);

            }else{
                alert(result.msg);
                return ;
            }
        }
    })
}

//地址管理
function initCourseDistrict(){
    var courseDistrict = $("input[name='courseDistrict']").val();
    if(courseDistrict != "" && courseDistrict != undefined){
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


function joinCourse(){
    var courseId = $("input[name='courseId']").val();
    window.location.href = "order.html?courseId=" + courseId;
}