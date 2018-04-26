//加载头部底部
$(function(){
    $("#mainPage").load("main.html");
    $("#footerPage").load("footer.html");

    alert("r465");

    $("#city_info").citySelect({
        prov : "",
        city : "",
        dist : "",
        nodata: "none",
        required: false
    });
})