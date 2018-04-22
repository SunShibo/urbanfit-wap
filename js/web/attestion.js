$(function(){
    $("#mainPage").load("main.html");
    $("#footerPage").load("footer.html");
    $("#A_query_auth").click(queryCoachAuth);
})

function queryCoachAuth(){
    var coachName = $("input[name='coachName']").val();
    if(coachName == ""){
        alert("请输入教练名称");
        return ;
    }
    var coachCardNum = $("input[name='coachCardNum']").val();
    if(coachCardNum == ""){
        alert("请输入教练认证号码");
        return ;
    }
    $.ajax({
        type : "post",
        url : "http://client.urbanfit.cn/auth/query",
        data : {"coachName": coachName, "coachCardNum" : coachCardNum},
        dataType : "json",
        success : function(result, status){
            if(result.code != 1){
                alert(result.msg);
                return ;
            }else{
                alert("教练认证信息存在");
            }
        }
    });
}