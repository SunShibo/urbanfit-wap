var courseId = 1;
$(function (){
    $("#mainPage").load("main.html");
    $("#footerPage").load("footer.html");
    $("a[name='course_1']").addClass("active");
    $("#waitingCourseName").text("成人课程");
    // 根据课程类型查询
    $("a[name^='course_']").click(queryCourseInfo);
})

function queryCourseInfo(){
    var courseName = $(this).data("coursename");
    courseId = $(this).data("courseid");
    $("a[name^='course_']").removeClass("active");
    $("a[name='course_" + courseId + "']").addClass("active");
    $.ajax({
        url : "http://client.urbanfit.cn/course/courseDetail",
        type : "post",
        data : {"courseId" : courseId},
        dataType : "json",
        success : function (result, status){
            if(result.code == 1){
                var isHaveCourse = result.data.isHave;
                if(isHaveCourse === 0){
                    $("#courseWaitingDiv").show();
                    $("#courseUping").hide();
                    $("#waitingCourseName").text(courseName);
                }else if(isHaveCourse == 1){
                    $("#courseWaitingDiv").hide();
                    $("#courseUping").show();
                    var course = JSON.parse(result.data.course);
                    $("#courseName").text(courseName);
                    $("#coursePrice").text(course.coursePrice);
                }
            }else{
                alert(result.msg);
                return ;
            }
        }
    })
}