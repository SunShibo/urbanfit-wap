
$(function () {
    //加载头部底部
    $("#mainPage").load("main.html");
    $("#footerPage").load("footer.html");


    $('.ccourse ul li').click(function(){
        $('.ccourse ul li').removeClass('on');
        $(this).addClass('on');

        var courseType = $(this).attr('data');
        //alert(courseType);
        $("input[name=courseType]").val(courseType);

        reladPage();
    })

    // 初始化门店信息
    queryStoreList();
    $("#proviceId").change(queryStoreList);
    $("#cityId").change(queryStoreList);
    $("#districtId").change(queryStoreList);
});


function queryStoreList(){
    var provice = $("#proviceId").val();
    var city = $("#cityId").val();
    var district = $("#districtId").val();
    reladPage();
}


var pageNo=1;
var pageSize=3;

var parameter = {
    'pageNo':pageNo,
    'pageSize':pageSize
}
$(document).ready(function(){
    $('.previous').click(function(){
        if(pageNo == 1){
            alert('这已经是第一页了');
        }else{
            pageNo -= 1;
            reladPage();
        }
    });
    $('.next').click(function(){
        if(pageNo == total){
            alert('这已经是最后一页了');
        }else{
            pageNo += 1;
            reladPage();
        }
    })
});
function reladPage(){

    var courseType = $("input[name=courseType]").val();

    parameter.courseType = courseType;

    $.ajax({
        type: "post",
        url: baseUrl + "apiCourse/list",
        data: parameter,
        dataType: "json",
        success: function (res) {
            var listbox = '';
            var Page = '';
            if (res.code == 1) {
                var lstCourse = res.data.lstCourse;
                var totalRecord = res.data.totalRecord;
                total = Math.ceil(totalRecord/pageSize);
                if(total == 1){
                    Page += '<span>'+pageNo+'</span>';
                }else{
                    Page += '<span>'+pageNo+'-'+total+'</span>';
                }
                $.each(lstCourse, function (k, v) {
                    //alert(v.content);
                    listbox += "<li>";
                    listbox += '<a href="course_detail.html?courseId='+ v.courseId + '">';
                    listbox += '<div class="clistcourse">';
                    listbox += '<img src="'+v.courseImageUrl+'" width="150" height="95">';
                    listbox += '<ul>';
                    listbox += '<li>';
                    listbox += '<h1>'+v.courseName+'</h1>';
                    listbox += '</li>';
                    listbox += '<li>';

                    if(v.courseType == 1){
                        listbox += '<p>成人课程</p>';
                    }else if(v.courseType == 2){
                        listbox += '<p>青少年课程</p>';
                    }else if(v.courseType == 3){
                        listbox += '<p>私教课程</p>';
                    }else if(v.courseType == 4){
                        listbox += '<p>特色课程</p>';
                    }

                    listbox += '</li>';
                    listbox += '<li>';
                    listbox += '<p>'+v.storeName+'</p>';
                    listbox += '</li>';
                    listbox += '<li>';
                    listbox += '<p>'+v.storeDistrict+'<span>'+v.coursePrice+'元</span></p>';
                    listbox += '</li>';
                    listbox += '</ul>';
                    listbox += '</div>';
                    listbox += '</a>';
                    listbox += '</li>';
                });
                $("#clistbox").html(listbox);
                $("#page").html(Page);
            } else {
                alert("接口请求错误");
            }
        }
    });
};
reladPage();



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
                if(city == "") {
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
            if (districDetailtArr[1] == city && districtCountyArr.indexOf(districDetailtArr[2]) < 0) {
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
