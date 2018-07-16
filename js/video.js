$(document).ready(function(){
     $("#media").bind('ended', function(){
          /*location.href="index.jsp";*/
          $('.modal0').hide();
     });
     $("#close").click(function(){
          //alert(111);
          $('.modal0').hide();
     });
});