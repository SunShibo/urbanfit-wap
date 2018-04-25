var env = "development";
var baseUrl = "http://client.urbanfit.cn/";

var clientId;
var clientName;
var clientMobile;
function clientIsLogin(){
    var isLogin = false;
    var webuser = $.cookie('webuser');
    if(webuser != ""){
        isLogin = true;
        alert(JSON.parse(webuser).name + JSON.parse(webuser).mobile);
        clientId = JSON.parse(webuser).clientId;
        clientName = JSON.parse(webuser).name;
        clientMobile = JSON.parse(webuser).mobile;
    }
    return isLogin;
}