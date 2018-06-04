
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
});
var pageNo=1;
var pageSize=3;


var parameter = {
    'pageNo':pageNo,
    'pageSize':pageSize
}

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