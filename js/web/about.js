//加载头部底部
$(function(){
    $("#mainPage").load("main.html");
    $("#footerPage").load("footer.html");

    $("#city_info").citySelect({
        prov : store.provice,
        city : store.city,
        dist : store.district,
        nodata: "none",
        required: false
    });
})