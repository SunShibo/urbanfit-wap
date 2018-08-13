$(function(){
    //加载头部底部
    $("#mainPage").load("main.html");
    $("#footerPage").load("footer.html");

    initStoreInfo();
})

function getParamValue(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function initStoreInfo(){
    var storeId = getParamValue("storeId");
    if(storeId == ""){
        alert("门店id为空");
        return ;
    }
    $.ajax({
        url : baseUrl + "apiStore/detail",
        type : "post",
        data : {"storeId" : storeId},
        dataType : "json",
        success : function (result) {
            if(result.code == 1){
                var store = result.data.store;
                var baseUrl = result.data.baseUrl;
                $("#storeName").text(store.storeName);
                $("#storeIntroduce").html(store.introduce);
                $("#storeAddress").text(store.storeDistrict + store.storeAddress);
                if(store.storeImageUrl != ""){
                    $("#storeImageUrl").attr("src", baseUrl + store.storeImageUrl);
                }
                var lstCourse = result.data.lstCourse;
                if(lstCourse != ""){
                    var baseUrl = result.data.baseUrl;
                    var courseArr = [];
                    $.each(lstCourse, function (k, v) {
                        var courseType = "成人课程";
                        if(v.courseType == 2){
                            courseType = "青少年课程";
                        }else if(v.courseType == 3){
                            courseType = "私教课程";
                        }else if(v.courseType == 4){
                            courseType = "特色课程";
                        }
                        courseArr.push('<li>');
                            courseArr.push('<a href="course_detail.html?courseId='+ v.courseId + '&storeId=' + storeId +'">');
                                courseArr.push('<div class="clistcourse">');
                                    courseArr.push('<img src="' + baseUrl + v.courseImageUrl + '" width="150" height="95">');
                                    courseArr.push('<ul>');
                                        courseArr.push('<li><h1>' + v.courseName +'</h1><li>');
                                        courseArr.push('<li><p>' + courseType +'</p><li>');
                                        courseArr.push('<li><p>' + v.coursePrice +'</p><li>');
                                    courseArr.push('</ul>');
                                courseArr.push('</div>');
                            courseArr.push('</a>');
                        courseArr.push('</li>');
                    });
                    $("#clistbox").html(courseArr.join(""));
                }
            }else{
                alert(result.msg);
            }
        }
    });



/*<li>
    <a href="#">
        <div class="clistcourse">
        <img src="img/tu5.jpg" width="150" height="95">
        <ul>
        <li>
        <h1>赛法斗-少儿课程10次包</h1>
        </li>
        <li>
        <p>少儿课程</p>
        </li>
        <li>
        <p>浩沙健身（金隅店）</p>
    </li>
    <li>
    <p>山东  济南  历下区<span>9999元</span></p>
    </li>
    </ul>
    </div>
    </a>
    </li>*/
}