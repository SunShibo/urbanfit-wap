var courseId = 1;
$(function (){
    $("#mainPage").load("main.html");
    $("#footerPage").load("footer.html");
    $("a[name='course_1']").addClass("active");
    // 根据课程类型查询
    $("a[name^='course_']").click(queryCourseInfo);
})

function queryCourseInfo(){
    courseId = $(this).data("courseid");
    $("a[name^='course_']").removeClass("active");
    $("a[name='course_" + courseId + "']").addClass("active");
    $.ajax({

    })
}