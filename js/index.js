//nav下拉效果
$(function(){
    $('.menu .menuimg').click(function(){
        $('.menubox').slideDown(100);
        $(this).hide();
        $('.close').show();
    })
    $('.menu .close').click(function(){
        $('.menubox').slideUp("fast");
        $(this).hide();
        $('.menuimg').show();
    })
    $('.menuul li').hover(function(){
        $(this).children('.menuulbox').slideDown(100);
    },function(){
        $(this).children('.menuulbox').slideUp("fast");
    })  
})
/*  swiper 选项卡函数 参数说明
*   obj  必选，导航列表
*   swiperObj: 必选，HTML元素或者string类型，Swiper容器的css选择器
*   className: 必选，当前样式的类名
*   effect：可选，切换效果，默认为"slide"，可设置为"fade，cube，coverflow，flip"。
*   其他参数参阅官网 http://www.swiper.com.cn
* */
//tab切换效果

function tabs(obj,swiperObj,className,index) {
    var mySwiper1 = new Swiper('#header',{
        freeMode : true,
        slidesPerView : 'auto',
        freeModeSticky : true ,
        freeModeMomentumRatio: 0.5,
        autoHeight:true,
    });
      
    swiperWidth = mySwiper1.container[0].clientWidth; 
    maxTranslate = mySwiper1.maxTranslate(); 
    maxWidth = -maxTranslate + swiperWidth / 2;
    $("#header").on('touchstart', function(e){ 
        e.preventDefault();
    }) 
   
    mySwiper1.on('tap', function(swiper, e){ 
        //e.preventDefault() 
        slide = swiper.slides[swiper.clickedIndex] 
        slideLeft = slide.offsetLeft 
        slideWidth = slide.clientWidth 
        slideCenter = slideLeft + slideWidth / 2 
        // 被点击slide的中心点 
        mySwiper1.setWrapperTransition(300) 
        if (slideCenter < swiperWidth / 2){ 
            mySwiper1.setWrapperTranslate(0); 
        }else if(slideCenter > maxWidth){ 
            mySwiper1.setWrapperTranslate(maxTranslate); 
        }else{ 
            nowTlanslate = slideCenter - swiperWidth / 2;
            mySwiper1.setWrapperTranslate(-nowTlanslate);   
        }    
        $("#header  .active").removeClass('active'); 
        $("#header .swiper-slide").eq(swiper.clickedIndex).addClass('active'); 
    })

    var tabSwiper = new Swiper(swiperObj, {
        initialSlide: index, // 设定初始化时slide的索引
        effect : 'slide',//切换效果
        speed : 500, //滑动速度，单位ms
        autoHeight: true, // 高度随内容变化
        onSlideChangeStart : function() {
            if(tabSwiper){ /*判断tabSwiper是否存在，否则当哈希值不为0的时候会报错 */
                $(obj+"."+className).removeClass(className); /*有当前类名的删除类名,给下一个添加当前类名*/
                $(obj).eq(tabSwiper.activeIndex).addClass(className);/*activeIndex是过渡后的slide索引*/
            }
        }
    });
    // 模拟点击事件，如果是移入事件，将mousedown 改为 mouseenter
    $(obj).on('touchstart mousedown', function(e) {
        e.preventDefault();/*清除默认事件*/
        $(obj+"."+className).removeClass(className);
        $(this).addClass(className); /*点击当前导航 改变当前样式*/
        tabSwiper.slideTo($(this).index());/*滑动到对应的滑块*/
        if($(this).index() == 1){
            //alert($(this).index());
            //queryCourseInfo();
        }
    });
    $(obj).click(function(e) {
        e.preventDefault();/*清除默认点击事件*/
    });
}

/*window.onload = function(){
    var tabsSwiper = new Swiper('#tabs-container',{
        autoHeight: true, // 高度随内容变化
        onSlideChangeStart: function(){
            $("#navbox .active").removeClass('active');
            $("#navbox .swiper-slide").eq(tabsSwiper.activeIndex).addClass('active'); 
        }
    })
    $("#navbox .swiper-slide").on('touchstart mousedown',function(e){
        e.preventDefault();
        $("#navbox .active").removeClass('active');
        $(this).addClass('active');
        tabsSwiper.slideTo($(this).index());
    });
    $("#navbox .swiper-slide").click(function(e){
        e.preventDefault();
    });
}*/