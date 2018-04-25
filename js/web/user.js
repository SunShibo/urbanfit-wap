$(function (){
    $("#mainPage").load("main.html");
    $("#footerPage").load("footer.html");
    $("#A_save").click(updateClientName);
    $("input[name='name']").val(clientName);
})

function updateClientName(){
    if(clientIsLogin() == false){
        alert("请您先登录账号");
        return ;
    }
    var clientName = $("input[name='name']").val();
    if(clientName == ""){
        alert("真是姓名不能为空");
        return ;
    }
    // 修改信息
    $.ajax({
        type : "post",
        url : baseUrl + "apiClient/update",
        data : {"clientId" : clientId, "name" : clientName},
        dataType : "json",
        success : function (result, status){
            if(result.code != 1){
                alert(result.msg);
                return;
            }else{
                alert("修改真实姓名成功");
            }
        }
    })
}