var courseId;
$(function (){
    //加载头部底部
    $("#mainPage").load("main.html");
    $("#footerPage").load("footer.html");
    courseId = getParamValue("courseId");
    $("#courseStore").change(chooseCourseStore);
    initCourseDetail();
    $("#B_join_course").click(redirectJoinCourse);
})

function initCourseDetail(){
    $.ajax({
        type : "post",
        url : baseUrl + "apiCourse/detail",
        data : {"courseId" : courseId},
        dataType : "json",
        async : false,
        success : function (data){
            if(data.code != 1){
                alert(data.msg);
                return ;
            }else{
                // 初始化课程信息
                initCourseInfo(data);
                // 初始化课程规格信息
                initCourseSizeDetail(data);
            }
        }
    });
}

function initCourseSizeDetail(data){
    var lstCourseSize = data.data.lstCourseSize;
    var lstSizeType = [];
    $.each(lstCourseSize, function (i, n){
        if(n.parentId == 0){
            var sizeType = {};
            sizeType.sizeId = n.sizeId;
            sizeType.sizeName = n.sizeName;
            lstSizeType.push(sizeType);
        }
    });
    var courseSizeArr = [];
    var chooseSizeIdArr = [];
    $.each(lstSizeType, function(i, n){
        courseSizeArr.push('<li><img src="img/gui.jpg" width="15" height="16">');
        courseSizeArr.push('<p><label class="biaoqian">' + n.sizeName + '：</label><em>');
        $.each(lstCourseSize, function (j, s){
            if(s.parentId == n.sizeId){
                if(j == 1){
                    chooseSizeIdArr.push(s.sizeId);
                    courseSizeArr.push('<a class="on" data-parentid="' + s.parentId + '" data-sizeid="' + s.sizeId
                        + '" id="A_choose_size_' + s.parentId + '_' + n.sizeId + '" href="javascript:void(0);">'
                        + s.sizeName + '</a>');
                }else{
                    courseSizeArr.push('<a data-parentid="' + s.parentId + '" data-sizeid="' + s.sizeId
                        + '" id="A_choose_size_' + s.parentId + '_' + n.sizeId + '" href="javascript:void(0);">'
                        + s.sizeName + '</a>');
                }
            }
        });
        courseSizeArr.push('</em></p>');
        courseSizeArr.push('</li>');
    })
    $("#courseSizeDetail").html(courseSizeArr.join(""));
    $("input[name='courseSizePrice']").val(JSON.stringify(data.data.lstSizeDetail));
    $("input[name='sizeTypeIndex']").val(lstSizeType.length);
    $("a[id^='A_choose_size_']").click(chooseCourseSize);

    // 计算选择课程价格
    var courseSizePrice = $("input[name='courseSizePrice']").val();
    $.each(JSON.parse(courseSizePrice), function(i, n){
        if(n.sizeDetail == chooseSizeIdArr.join(",")){
            $("#coursePrice").text(n.sizePrice);
            $("input[name='detailId']").val(n.detailId);
        }
    });
}

function chooseCourseSize(){
    var sizeId = $(this).data("sizeid");
    var parentId = $(this).data("parentid");
    $("a[id^='A_choose_size_" + parentId + "']").removeClass("on");
    $(this).addClass("on");
    var chooseSizeAmount = 0;
    var chooseSizeIdArr = [];
    $("a[id^='A_choose_size_']").each(function (i, n){
        if($(this).hasClass("on")){
            chooseSizeAmount += 1;
            chooseSizeIdArr.push($(this).data("sizeid"));
        }
    });
    var sizeTypeIndex = $("input[name='sizeTypeIndex']").val();
    if(sizeTypeIndex == chooseSizeAmount){
        // 计算选择课程价格
        var courseSizePrice = $("input[name='courseSizePrice']").val();
        $.each(JSON.parse(courseSizePrice), function(i, n){
            if(n.sizeDetail == chooseSizeIdArr.join(",")){
                $("#coursePrice").text(n.sizePrice);
                $("input[name='detailId']").val(n.detailId);
            }
        });
    }
}

function initCourseInfo(data){
    var baseUrl = data.data.baseUrl;
    var course = data.data.course;
    $("#courseNameH1").text(course.courseName);
    $("#courseName").text(course.courseName);
    if(course.courseImageUrl != ""){
        $("img[name='courseImageUrl']").attr("src", baseUrl + course.courseImageUrl);
    }
    $("#coursePrice").text(course.coursePrice);
    var courseType = "成人课程";
    if(course.courseType == 2){
        courseType = "青少年课程";
    }else if(course.courseType == 3){
        courseType = "私教课程";
    }else if(course.courseType == 4){
        courseType = "特色课程";
    }
    $("#courseType").text(courseType);

    var lstCourseStore = data.data.lstCourseStore;
    var courseStoreArr = [];
    var storeDistrict = "";
    $.each(lstCourseStore, function (i, n){
        if(i == 0){
            storeDistrict = n.storeDistrict;
            $("input[name='storeId']").val(n.storeId);
        }
        courseStoreArr.push('<option data-district="' + n.storeDistrict +'" value="' + n.storeId +'">' + n.storeName + '</option>');
    });
    $("#storeDistrict").text(storeDistrict);
    $("#courseStore").html(courseStoreArr.join(""));
    $("#courseDetailDiv").html(course.introduce);
}

function chooseCourseStore(){
    var storeId = $(this).val();
    var storeDistrict = $("option[value='" + storeId +"']").data("district");
    $("#storeDistrict").text(storeDistrict);
    $("input[name='storeId']").val(storeId);
}

function redirectJoinCourse() {
    var detailId = $("input[name='detailId']").val();
    if(detailId == ""){
        alert("请选择课程规格信息");
        return ;
    }
    var storeId = $("input[name='storeId']").val();
    $.ajax({
        type : "post",
        url : baseUrl + "apiCourse/queryDetail",
        data : {"courseId" : courseId, "storeId" : storeId, "detailId" : detailId},
        dataType : "json",
        async : false,
        success : function (data){
            if(data.code != 1){
                alert(data.msg);
                return ;
            }else{
                window.location.href = "course_join.html?courseId=" + courseId + "&storeId=" + storeId
                    + "&detailId=" + detailId;
            }
        }
    })
}

function getParamValue(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}