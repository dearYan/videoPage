 var rtmpPlayer = {},
     common = {},
     newData = [],
     showData = [],
     totalLen = 0,
     currentIndex = 0,
     deleteDomIndex = 0,
     option = {
     	right : 14,
     	bottom : [{
     		num :10,
     		className : 'into_big_image',
     	},{
     		num : 19,
     		className : 'turn_scale_up',
     	},{
     		num :19,
     		className : 'small_turn_up',
     	},{
     		num :19,
     		className : 'small_turn_up',
     	}]
     },
     floatDir = [
        {
	    	position : -1,
	    	order : 4,
	    	dir : 'down',
	    	className : 'turn_down'
	    },
	    {
	    	position : 0,
	    	order : 5,
	    	dir : 'down',
	    	className : 'turn_down'
	    },
	    {
	    	position : 1,
	    	order : 6,
	    	dir : 'left',
	    	className : 'turn_left'
	    },
	    {
	    	position : 2,
	    	order : 7,
	    	dir : 'up',
	    	className : 'turn_up'
	    },
	    {
	    	position : -2,
	    	order : 3,
	    	dir : 'down',
	    	className : 'turn_down'
	    },
	    {
	    	position : 3,
	    	order : 8,
	    	dir : 'up',
	    	className : 'turn_up'
	    },
	    {
	    	position : -3,
	    	order : 6,
	    	dir : 'down',
	    	className : 'turn_down'
	    },
	    {
	    	position : 4,
	    	order : 9,
	    	dir : 'up',
	    	className : 'turn_up'
	    },
	    {
	    	position : -4,
	    	order : 2,
	    	dir : 'down',
	    	className : 'turn_down'
	    },
	    {
	    	position : 5,
	    	order : 10,
	    	dir : 'up',
	    	className : 'turn_up'
	    },
	    {
	    	position : -5,
	    	order : 1,
	    	dir : 'down',
	    	className : 'turn_down'
	    },
	    {
	    	position : 6,
	    	order : 11,
	    	dir : 'up',
	    	className : 'turn_up'
	    },
	    {
	    	position : -6,
	    	order : 0,
	    	dir : 'left',
	    	className : 'turn_left'
	    },
	    {
	    	position : 7,
	    	order : 12,
	    	dir : 'up',
	    	className : 'turn_up'
	    }
	 ],
	 floatSmall = [],
     clearInt,
     clearUpdate;

$(function(){
                             
    var loading = '<div class="loading_container">'+
        '<div class="loading_out_cicrle"><div class="loading_turn_cicrle"></div>'+
        '<div class="loading_inner_cicrle"></div></div></div>';

    $("img").parent().append(loading);

    rtmpPlayer.player = lyplayer("videoPlay").setup({
		file: 'rtmp://rtmp5.public.topvdn.cn/live/1003775',
		rtmp: {
        	bufferlength: 2.0
    	},
    	events : {
        	 onPlay : function (){
        	 	$(".videoContaner .into_play_area").html("");
	            $(".videoContaner .into_play_area").removeAttr("id");
        	 },
        	 onError : function(){
        	 	$(".videoContaner .into_play_area").html("");
	            $(".videoContaner .into_play_area").removeAttr("id");
        	 }
        },
		width:'100%',
		height:'100%',
		autostart:true
    });

    rtmpPlayer.playCamera = function(cid, ip) {
        var k = +cid % 10;
        var ip2 = cid==ip?'rtmp'+k.toString()+'.public.topvdn.cn':ip;
        var player = rtmpPlayer.player;
        player.stop();
        player.setup({
            file: 'rtmp://'+ip2+'/live/'+cid,
            rtmp: {
                bufferlength: 2.0,
                stagevideo:true 
            },
            width:'100%',
            height:'100%',
            events : {
            	 onPlay : function (){
            	 	$(".videoContaner .into_play_area").html("");
    	            $(".videoContaner .into_play_area").removeAttr("id");
            	 },
            	 onError : function(){
	        	 	$(".videoContaner .into_play_area").html("");
		            $(".videoContaner .into_play_area").removeAttr("id");
	        	 }
            },
            autostart:true
        })
    }
    
    common.initData = function initData(callback){
    	$.ajax({
	    	url : 'http://120.26.74.53:8066/cameras/camera_viwer_stat',
	    	type : 'GET',
	    	dataType : 'json',
	    	success : function(data){
	    		callback(data);
	    	}
	    });
    }

    common.initData(function(data){
    	var tempCid = data[data.length-1]["cid"],
    	    tempName = data[data.length-1]["app_name"]+"-"+data[data.length-1]["location"];

	     showData = data; 
     //    var tempArr = [];
	    // for(var i=0;i<65;i++){
	    // 	tempArr.push(data[i]);
	    // }
	    // showData = tempArr;

	    $(".video_desc_container .video_current_name").html(tempName);
	    rtmpPlayer.playCamera(tempCid,tempCid);

		initImage(showData);

		if( showData.length>totalLen+14 ){
			currentIndex = totalLen + 14;
		}else{
			currentIndex = 14+$(".footer_contianer .footer_container_img").length;
		}
    });

    $(".videoContaner .video_overlay").on("mouseover",function(){
    	$(".videoContaner .video_locking").css("top","0");
    });

    $(".videoContaner .video_locking").on("mouseout",function(){
    	var status = $(".video_locking .video_locking_btn").attr("data-status");
    	if(status === "false"){
    		return false;
    	}
    	$(this).css("top","-50px");
    });

    $(".videoContaner .video_overlay").on("mouseout",function(){
    	var status = $(".video_locking .video_locking_btn").attr("data-status");
    	if(status === "false"){
    		return false;
    	}
    	$(".videoContaner .video_locking").css("top","-50px;");
    });

    function initImage(data){
    	var imgUrl = [],
    	    index = 0,
    	    classIndex = 0,
    	    smallDataLen = data.length - 14,
    	    smallArray = option["bottom"],
    	    totalIndex = 0,
    	    smallLen = smallArray.length,
    	    initPosition = smallArray[1]["num"]
    	    startPosition = smallArray[0]["num"],
    	    smallHtl = '',
    	    bigImage = $(".img_screen .img_container");

    	for(var i=0;i<smallLen;i++){
    		totalLen = totalLen + smallArray[i]["num"];
    		startPosition = startPosition - smallArray[i]["num"];
    	}

    	startPosition -- ;
        floatSmall.push({position:startPosition,dir:"left",className:"small_turn_left"});

        for(var i = smallLen-1;i>=0;i--){
        	var currentSmallLen = smallArray[i]["num"];
        	if(i%2 === 0){
        		for(var j=0;j<currentSmallLen;j++){
        			startPosition++
        			if(j === currentSmallLen-1){
        				floatSmall.push({position:startPosition,dir:"up",className:smallArray[i]["className"]});
        			}else{
        				floatSmall.push({position:startPosition,dir:"right",className:"small_turn_right"});
        			}
        			
        		}	
        	}else{
        		for(var j=0;j<currentSmallLen;j++){
        			startPosition++;
        			if(j === currentSmallLen-1){
        				floatSmall.push({position:startPosition,dir:"up",className:smallArray[i]["className"]});
        			}else{
        				floatSmall.push({position:startPosition,dir:"left",className:"small_turn_left"});
        			}
        			
        		}
        	}
        }
       
        for(var i=0;i<smallLen;i++){
        	if(i === 0){
        		for(var k=0;k<smallArray[i]["num"];k++){
        			totalIndex ++;
        			classIndex ++;
        			if(totalIndex < smallDataLen){
        				smallHtl = smallHtl + '<div class="footer_container_img footer_container_img_'+classIndex+'" data-position="'+k+'"><img/></div>'
        			}
        		}
        		initPosition = initPosition - smallArray[1]["num"];
        	}else {
        	   
        		if(i%2 === 0){
        			classIndex = classIndex + smallArray[i]["num"];
        			for(var k=0;k<smallArray[i]["num"];k++){
                        totalIndex ++;
	        			if(totalIndex < smallDataLen){
	        				initPosition --;
	        				smallHtl = smallHtl + '<div class="footer_container_img footer_container_img_'+classIndex+' scale_min" data-position="'+initPosition+'"><img/></div>';
	        				classIndex --;
	        			}
	        		}
        		}else{
        			classIndex = totalIndex;
        			for(var k=0;k<smallArray[i]["num"];k++){
	        			classIndex ++ ;
	        			totalIndex ++;
	        			if(totalIndex < smallDataLen){
	        				initPosition --;
	        			    smallHtl = smallHtl + '<div class="footer_container_img footer_container_img_'+classIndex+' scale_min" data-position="'+initPosition+'"><img/></div>'
	        			}
	        		}
        		}
        	}
        }

        $(".footer_contianer").append(smallHtl);
        $("img").parent().append(loading);

        $("img").on("load",function(){
			$(this).siblings(".loading_container").remove();
		});

		$("img").on("error",function(){
			$(this).siblings(".loading_container").remove();
			$(this).parent().addClass("error_image");
	    	$(this).remove();
	    });

        var smalImage = $(".footer_contianer .footer_container_img");

    	for(var i=0,len=data.length;i<len;i++){
    		var temp = parseInt(data[i]["cid"]),
    		    k = +temp % 10,
    		    url = 'http://rtmp'+k+'.public.topvdn.cn/snapshot/'+temp+'.jpg';
    		imgUrl.push(url);
    	}
    	
    	for(var i=0,len=bigImage.length;i<len;i++){
    		var tempDom = bigImage.eq(i).find("img");
    		tempDom.attr({"data-url":data[index]["cid"],"data-name":data[index]["app_name"],"src":imgUrl[index],"data-location":data[index]["location"]});
    		index ++;
    	}

    	for(var i=0,len=smalImage.length;i<len;i++){
    		var tempDom = smalImage.eq(i).find("img");
    		tempDom.attr({"data-url":data[index]["cid"],"data-name":data[index]["app_name"],"src":imgUrl[index],"data-location":data[index]["location"]});
    		index++;
    	}
    }

});

window.onload = function(){
	var bigImg = $(".img_screen .img_container"),
	    smallImg = $(".footer_contianer .footer_container_img"),
	    bigImageContainer = $(".img_screen .img_screen_contianer"),
	    smallImageContainer = $(".footer_contianer"),
	    videoContaner = $(".videoContaner"),
	    videAnmation = $(".videoContaner .into_play_area"),
	    isPlayVideo = true,
	    isLockBtn = $(".videoContaner .video_locking_btn"),
	    isAnmationing = false,
	    isSmallAnmationing = false,
	    isAutoPlay = true,
	    smallAnimationCount = 0,
	    isAutoPlaySmall = true,
	    bigIndex = 0,
	    smallIndex = 0;

	function anmationEvent(dom,className){
		var top = parseInt(dom.css("top")),
		    left = parseInt(dom.css("left")),
		    domPosition = parseInt(dom.attr("data-position")),
		    leftValue,
		    topValue = 0;
		for(var i=0;i<floatDir.length;i++){
			if(floatDir[i]["position"] === domPosition){
				var className = floatDir[i]["className"],
				    dir = floatDir[i]["dir"];
				if(dir === "up"){
					topValue = top-118;
					dom.css("top",topValue+"px");
				}

				if(dir === "left"){
					leftValue = left - 209;
					dom.css("left",leftValue+"px");
				}

				if(dir === "down"){
					topValue = top+118;
					dom.css("top",topValue+"px");
				}
				dom.addClass(className);
				bigIndex ++ ;	

				if(bigIndex<bigImg.length){
					anmationEvent(bigImg.eq(bigIndex));
				}
			}

		}
	}

	function smallImgEvent(dom){
		var topValue = 0,
		    leftValue = 0,
		    rightValue = 0,
		    top = parseInt(dom.css("top")),
		    left = parseInt(dom.css("left")),
		    right = parseInt(dom.css("right")),
		    width = parseInt(dom.css("width")),
		    currentPosition = parseInt(dom.attr("data-position")), 
		    dir = floatSmall[smallIndex]["dir"];

        for(var i=0,len=floatSmall.length;i<len;i++){
        	var temp = floatSmall[i]["position"],
        	    className = floatSmall[i]["className"];
        	if(temp === currentPosition){
        		var dir = floatSmall[i]["dir"],
        		    offset_left = 0,
        		    offset_top = 0;

        		if(currentPosition > -2){
        			offset_left = width+10;
        			offset_top = 75;
        		}else {
        			offset_left = 100;
        			offset_top = 50;
        		}
       
        		if(dir === "up"){
					topValue = top - offset_top;
					dom.css("top",topValue+"px");
					if(left<0){
						dom.css("left","-45px");
					}
				} 
				if(dir === "left"){
					leftValue = left - offset_left;
					dom.css("left",leftValue+"px");
				}
		        
		        if(dir === "up_bigImage"){
		        	topValue = top - 137;
					dom.css("top",topValue+"px");
					dom.css("left","1700px");
		        }

		        if(dir === "right"){
		        	leftValue = left + offset_left;
		        	dom.css("left",leftValue +"px");
		        }
                
                if(currentPosition === -1){
                	dom.css("left","0px");
                }
		        dom.addClass(className);
		        
		        smallIndex ++ ;
		        if(smallIndex<floatSmall.length){
		        	smallImgEvent(smallImg.eq(smallIndex),floatSmall[smallIndex]["className"]);
		        }
        	}
        }
	}

    $(".videoContaner .video_locking_btn").on("click",function(){
    	var status = $(this).attr("data-status");
    	if(status === "true"){
    		isPlayVideo = false;
    		videoContaner.css("z-index","100000");
    		$(this).attr("data-status","false");
    		$(this).removeClass("vide_locking_false");
    		$(this).addClass("vide_locking_true");
    	}else{
    		isPlayVideo = true;
    		videoContaner.css("z-index","100");
    		$(this).attr("data-status","true");
    		$(this).removeClass("vide_locking_true");
    		$(this).addClass("vide_locking_false");
    	}
    });

	function intoFlashPlay(imgUrl,ip,dataName){
		var isJumpout = false;
		if(isPlayVideo){
			var imgHtl = '<img src="'+imgUrl+'"/>';
			videAnmation.html(imgHtl);
            $(".video_desc_container .video_current_name").html(dataName);
			rtmpPlayer.playCamera(ip,ip);
			videAnmation.attr("id","anmiation_img");
		}
	}

    function initBigImage(){
    	bigIndex = 0;
    	anmationEvent(bigImg.eq(bigIndex));
    }
    
    function insertSmallImage(){  
        smallImg = $(".footer_contianer .footer_container_img");
    	currentIndex ++;  
        
        if(currentIndex>showData.length-1){
        	currentIndex = 0;
        }

         
         var lastImage = $(".footer_contianer .footer_container_img:last"),
            len = $(".footer_contianer .footer_container_img").length,
    	    dataPosition = parseInt(lastImage.attr("data-position")),
    	    temp = showData[currentIndex]["cid"],
    	    classIndex = len,
    	    k = temp % 10,
    	    imgUrl = 'http://rtmp'+k+'.public.topvdn.cn/snapshot/'+temp+'.jpg';

    	if(len>28 && len< 48){
    		classIndex = 49 - (len - 29)-1;
    	}else{
    		classIndex ++ ;
    	}

        if(len<68){
            var smallImage = '<div class="footer_container_img footer_container_img_'+classIndex+' scale_min" data-position="'+(dataPosition-1)+
                    '"><img src="'+imgUrl+'" data-url="'+temp+'" data-name="'+showData[currentIndex]["app_name"]+'" data-location="'+showData[currentIndex]["location"]+'"/></div>';

                smallImageContainer.append(smallImage);
        }
        
    	

    	smallImg = $(".footer_contianer .footer_container_img");
    }

    function initSmallImage(){
    	if(isAutoPlaySmall){
    		smallIndex = 0;
	        
	        insertSmallImage();
    		smallImgEvent(smallImg.eq(smallIndex));	

    	} 
    }

    function insertBigImage(dom){
    	var currentDem = dom.find("img"),
		    imgUrl = currentDem.attr("src"),
		    opacity = currentDem.css("opacity"),
		    dataUrl = currentDem.attr("data-url"),
		    dataLocation = currentDem.attr("data-location"),
		    dataName = currentDem.attr("data-name"),
		    bigHtl ='',
		    dataPosition =8;

		if(!isAutoPlay){
			dataPosition = 7;
		}

		if(imgUrl==="" || imgUrl ===undefined){
			bigHtl = '<div class="img_container img_container_14 error_image" data-position="'+dataPosition+'"></div>'
		}else{
			bigHtl = '<div class="img_container img_container_14" data-position="'+dataPosition+'"><img src="'+imgUrl+'" data-url="'+dataUrl+'" data-location="'+dataLocation+'" data-name="'+dataName+'" style="opacity:'+opacity+';"/></div>'
		}

		$(".img_screen .img_screen_contianer").append(bigHtl);

        smallImg.parent().find("[data-position='10']").remove();
        
        if(isAutoPlay){
        	bigImg = $(".img_screen .img_container");
			for(var i=0,len = bigImg.length;i<len;i++){
	    		var dom = bigImg[i],
	    		    temp = parseInt($(dom).attr("data-position"));
	    		$(dom).attr("data-position",temp-1);
	    	}
        }
    }

    function isPlay(){
    	var status = isLockBtn.attr("data-status"),
    	    opacity = bigImg.parent().find("[data-position = '-6']").children().css("opacity");
 
    	if(status === "true" && opacity==="1"){
        	isPlayVideo = true;
        	$(".videoContaner").css("z-index","100");
        }else{
        	isPlayVideo = false;
        	$(".videoContaner").css("z-index","100000");
        }
    }

	function initAnmation(){
        clearInterval(clearUpdate);
		bigImg = $(".img_screen .img_container");
		smallImg = $(".footer_contianer .footer_container_img");
        isAnmationing = true,
        isSmallAnmationing = true,
        smallAnimationCount = 0,

        isPlay();

        if(isAutoPlay){
        	initBigImage();
        }
        initSmallImage();
        
		smallImg = $(".footer_contianer .footer_container_img");

		if(isAutoPlaySmall){
			for(var i=0,len=smallImg.length;i<len;i++){
	    		var dom = smallImg[i],
	    		    temp = parseInt($(dom).attr("data-position"));
	    		$(dom).attr("data-position",temp+1);
	    	}
		}

        smallImg.on("webkitTransitionEnd",function(){
	       	var dataPosition = $(this).attr("data-position");
	       	if(dataPosition === "0"){
	       		$(this).removeClass("scale_min");
	       	}

	       	$(this).removeClass("small_turn_left");
	       	$(this).removeClass("small_turn_up");
	       	$(this).removeClass("small_turn_right");
	       	$(this).removeClass("turn_scale_up");

	    });
        
	    bigImg.on("webkitTransitionEnd",function(){
            var dataPosition = $(this).attr("data-position");
 
	       	if(dataPosition === "-6"){
	       		if(isAutoPlay){
	    		 	var willPlayDom = $(this).find("img"),
	        	    willPlayImageUrl = willPlayDom.attr("src"),
	        	    willPlayImageLocation = willPlayDom.attr("data-location"),
	        	    willPlayName = willPlayDom.attr("data-name")+"-"+willPlayImageLocation,
				    willPlayIp = willPlayDom.attr("data-url");

					intoFlashPlay(willPlayImageUrl,willPlayIp,willPlayName);
					bigImg.parent().find("[data-position='-6']").remove();
	        	}
	       	}

	    	$(this).removeClass("turn_left");
	    	$(this).removeClass("turn_down");
	    	$(this).removeClass("turn_up");

	    });

        smallImg.parent().find("[data-position='10']").on("webkitTransitionEnd",function(){
			var dom = $(this);
			insertBigImage(dom);
		});

	    $("img").on("error",function(){
	    	$(this).parent().addClass("error_image");
	    	$(this).remove();
	    });

	    clearUpdate = setInterval(function(){
	    	common.initData(function(data){
	    	    deleteDomIndex = 0;
	    		updateData(data);
	    	});
	    },10000);
	}

	$(".img_screen").on("click",".img_container",function(){
		clearInterval(clearInt);
        clearInterval(clearUpdate);
		videAnmation.html("");
		videAnmation.removeAttr("id");

    	var dom = $(this).find("img"),
    	    opacity = dom.css("opacity"),
    	    position = parseInt($(this).attr("data-position"))+1,
    	    num = 7 - position,
    	    location = dom.attr("data-location"),
    	    dataName = dom.attr("data-name")+'-'+location,
    	    ip = dom.attr("data-url"),
    	    src = dom.attr("src");

        isPlayVideo = true;
        isAutoPlay = false;
        isAutoPlaySmall = true;
        videoContaner.css("z-index","100");
        $(this).remove();

    	for(position;position<8;position++){
    		for(var i=0,len=floatDir.length;i<len;i++){
	    		if(floatDir[i]["position"] === position){
	    			var className = floatDir[i]["className"],
	    			    currentDom = bigImg.parent().find("[data-position='"+position+"']"),
	    			    top = parseInt(currentDom.css("top")),
		                left = parseInt(currentDom.css("left")),
		                topValue = 0,
		                leftValue = 0,
	    			    dir = floatDir[i]["dir"];

	    			if(dir === "up"){
						topValue = top-118;
						currentDom.css("top",topValue+"px");
					}

					if(dir === "left"){
						leftValue = left - 209;
						currentDom.css("left",leftValue+"px");
					}

					if(dir === "down"){
						topValue = top+118;
						currentDom.css("top",topValue+"px");
					}
					currentDom.addClass(className);
					currentDom.attr("data-position",position-1);
	    		}
	        }
    	}
         
        if(opacity === "1"){
        	intoFlashPlay(src,ip,dataName);
	    	rtmpPlayer.playCamera(ip,ip);
	        isLockBtn.attr("data-status","false");
	        $(".videoContaner .video_locking").css("top","0");
	        isLockBtn.removeClass("vide_locking_false");
	        isLockBtn.addClass("vide_locking_true");
        }
    	initAnmation();
    });

    $(".img_screen").on("mouseover",".img_container",function(){
		clearInterval(clearInt);
		clearInterval(clearUpdate);
    });

    $(".img_screen").on("mouseout",".img_container",function(){
		clearInt = setInterval(function(){
			isAutoPlay = true;
    		isAutoPlaySmall = true;
			initAnmation();
		}, 30000);
		clearUpdate = setInterval(function(){
	    	common.initData(function(data){
	    	    deleteDomIndex = 0;
	    		updateData(data);
	    	});
	    },10000);
    });

    $(".footer_contianer").on("mouseover",".footer_container_img",function(){
    	clearInterval(clearInt);
    	clearInterval(clearUpdate);
    	
    });

    $(".footer_contianer").on("mouseout",".footer_container_img",function(){
    	clearInt = setInterval(function(){
    		isAutoPlay = true;
    		isAutoPlaySmall = true;
			initAnmation();
		} , 30000);
		clearUpdate = setInterval(function(){
	    	common.initData(function(data){
	    	    deleteDomIndex = 0;
	    		updateData(data);
	    	});
	    },10000);
    });

    $(".footer_contianer").on("click",".footer_container_img",function(){

    	clearInterval(clearInt);
        clearInterval(clearUpdate);
    	videAnmation.html("");
		videAnmation.removeAttr("id");
        
    	var dom = $(this).find("img"),
    	    minPosition = parseInt($(".footer_contianer .footer_container_img:last").attr("data-position"))-2,
    	    opacity = dom.css("opacity"),
    	    location = dom.attr("data-location"),
    	    dataName = dom.attr("data-name")+'-'+location,
    	    ip = dom.attr("data-url"),
    	    position = parseInt($(this).attr("data-position"))-1,
    	    src = dom.attr("src");
        
        isPlayVideo = true;
    	isAutoPlay = false;
        isAutoPlaySmall = false;
        videoContaner.css("z-index","100");
        
        insertSmallImage();
        $(this).remove();

        for(position;position>minPosition;position--){
    		for(var i=0,len=floatSmall.length;i<len;i++){
	    		if(floatSmall[i]["position"] === position){
	    			var className = floatSmall[i]["className"],
	    			    currentDom = smallImg.parent().find("[data-position='"+position+"']"),
	    			    top = parseInt(currentDom.css("top")),
		                left = parseInt(currentDom.css("left")),
		                width = parseInt(currentDom.css("width")),
		                offset_left = 0,
		                offset_top = 0,
	    			    dir = floatSmall[i]["dir"];

		    		if(position > -2){
		    			offset_left = width+10;
		    			offset_top = 75;
		    		}else {
		    			offset_left = 100;
		    			offset_top = 50;
		    		}
		   
	        		if(dir === "up"){
						topValue = top - offset_top;
						currentDom.css("top",topValue+"px");
						if(left<0){
							currentDom.css("left","-45px");
						}
					} 
					if(dir === "left"){
						leftValue = left - offset_left;
						currentDom.css("left",leftValue+"px");
					}
		        
			        if(dir === "up_bigImage"){
			        	topValue = top - 137;
						currentDom.css("top",topValue+"px");
						currentDom.css("left","1700px");
			        }

			        if(dir === "right"){
			        	leftValue = left + offset_left;
			        	currentDom.css("left",leftValue +"px");
			        }
                
	                if(position === -1){
	                	currentDom.css("left","0px");
	                }

					currentDom.addClass(className);
					currentDom.attr("data-position",position+1);
	    		}
	        }
    	}
        
        if(opacity === "1"){
        	intoFlashPlay(src,ip,dataName);
	    	rtmpPlayer.playCamera(ip,ip);
	        isLockBtn.attr("data-status","false");
	        $(".videoContaner .video_locking").css("top","0");
	        isLockBtn.removeClass("vide_locking_false");
	        isLockBtn.addClass("vide_locking_true");
        }
    	
    	initAnmation();
    });
    

    function deleteBigImage(currentDom){

    	var position = parseInt(currentDom.attr("data-position"))+1;
    	currentDom.remove();
        isAutoPlay = false;
        isAutoPlaySmall = true;

    	for(position;position<8;position++){
    		for(var i=0,len=floatDir.length;i<len;i++){
	    		if(floatDir[i]["position"] === position){
	    			var className = floatDir[i]["className"],
	    			    currentDom = bigImg.parent().find("[data-position='"+position+"']"),
	    			    top = parseInt(currentDom.css("top")),
		                left = parseInt(currentDom.css("left")),
		                topValue = 0,
		                leftValue = 0,
	    			    dir = floatDir[i]["dir"];

	    			if(dir === "up"){
						topValue = top-118;
						currentDom.css("top",topValue+"px");
					}

					if(dir === "left"){
						leftValue = left - 209;
						currentDom.css("left",leftValue+"px");
					}

					if(dir === "down"){
						topValue = top+118;
						currentDom.css("top",topValue+"px");
					}
					currentDom.addClass(className);
					currentDom.attr("data-position",position-1);
	    		}
	        }
    	}
    	initAnmation();
    }

    function deleteSmallImage(currentDom){

    	var position = parseInt(currentDom.attr("data-position"))-1,
    	    minPosition = parseInt($(".footer_contianer .footer_container_img:last").attr("data-position"))-2;
        
        insertSmallImage();
        currentDom.remove();
        isAutoPlay = false;
        isAutoPlaySmall = false;

        for(position;position>minPosition;position--){
    		for(var i=0,len=floatSmall.length;i<len;i++){
	    		if(floatSmall[i]["position"] === position){
	    			var className = floatSmall[i]["className"],
	    			    currentDom = smallImg.parent().find("[data-position='"+position+"']"),
	    			    top = parseInt(currentDom.css("top")),
		                left = parseInt(currentDom.css("left")),
		                width = parseInt(currentDom.css("width")),
		                offset_left = 0,
		                offset_top = 0,
	    			    dir = floatSmall[i]["dir"];

		    		if(position > -2){
		    			offset_left = width+10;
		    			offset_top = 75;
		    		}else {
		    			offset_left = 100;
		    			offset_top = 50;
		    		}
		   
	        		if(dir === "up"){
						topValue = top - offset_top;
						currentDom.css("top",topValue+"px");
						if(left<0){
							currentDom.css("left","-45px");
						}
					} 
					if(dir === "left"){
						leftValue = left - offset_left;
						currentDom.css("left",leftValue+"px");
					}
		        
			        if(dir === "up_bigImage"){
			        	topValue = top - 137;
						currentDom.css("top",topValue+"px");
						currentDom.css("left","1700px");
			        }

			        if(dir === "right"){
			        	leftValue = left + offset_left;
			        	currentDom.css("left",leftValue +"px");
			        }
                
	                if(position === -1){
	                	currentDom.css("left","0px");
	                }

					currentDom.addClass(className);
					currentDom.attr("data-position",position+1);
	    		}
	        }
    	}

        initAnmation();
    }

    function deleteDom(currentDom,curIndex,callback){
    	setTimeout(function(){
    		callback(currentDom);
    	},curIndex*900)
    }

    function findDom(ip){
    	bigImg = $(".img_screen .img_container");
		smallImg = $(".footer_contianer .footer_container_img");

		var isShowsmall = true;
		for(var i=0,len = bigImg.length;i<len;i++){
			var currentDom = bigImg.eq(i).find("img"),
			    dataUrl = currentDom.attr("data-url");
			if(dataUrl === ip){
				isShowsmall = false;
				deleteDomIndex ++;
				deleteDom(bigImg.eq(i),deleteDomIndex,function(currentDom){
					deleteBigImage(currentDom);
				})
			}
		}

		if(isShowsmall){
			for(var i=0,len = smallImg.length;i<len;i++){
				var small = smallImg.eq(i).find("img"),
				    url = small.attr("data-url");

				if(url === ip){
					deleteDomIndex ++;
					deleteDom(smallImg.eq(i),deleteDomIndex,function(currentDom){
						deleteSmallImage(currentDom);
					})
				}
			}
		}
    }

    function insertUpdateData(data){
    	smallImg = $(".footer_contianer .footer_container_img");
    	var len = smallImg.length,
    	    classIndex = len,
    	    lastSmallDom = $(".footer_contianer .footer_container_img:last"),
    	    last_position = parseInt(lastSmallDom.attr("data-position"))-1;
    	if(len<67){

    		if(len>28 && len< 48){
	    		classIndex = 49 - (len - 29)-1;
	    	}else{
	    		classIndex ++ ;
	    	}
    		var len = smallImg.length,
    		    tempObj = floatSmall[len],
    		    temp = data["cid"],
    	        k = temp % 10,
    	        imgUrl = 'http://rtmp'+k+'.public.topvdn.cn/snapshot/'+temp+'.jpg',
    	        htl = '<div class="footer_container_img footer_container_img_'+classIndex+' scale_min" data-position="'+last_position+
    	         '"><img src="'+imgUrl+'" data-url="'+temp+'" data-name="'+tempObj["app_name"]+'" data-location="'+tempObj["location"]+'"/></div>';
    		$(".footer_contianer").append(htl);
    	}
    	smallImg = $(".footer_contianer .footer_container_img");
    }

    function travelDeleteDome(arr){
        if(arr.length){
            clearInterval(clearInt);
            for(var k=0,len = arr.length;k<len;k++){
                findDom(arr[k]);
            }
            clearInt = setInterval(function(){
                isAutoPlay = true;
                isAutoPlaySmall = true;
                initAnmation();
            }, 1000*30);
        }
    }

    function travaleAddDome(addArray){
        if(addArray.length){
            clearInterval(clearInt);
            setTimeout(function(){
                for(var k=0,len=addArray.length;k<len;k++){
                    insertUpdateData(addArray[k]);
                }
            },900*deleteDomIndex);
            clearInt = setInterval(function(){
                isAutoPlay = true;
                isAutoPlaySmall = true;
                initAnmation();
            }, 1000*30);
        }
    }

    function updateData(data){
    	var tempData = [],
    	    isAdd = true,
    	    len = data.length,
            deleteArray = [],
            addArray = [],
    	    isDelete = false,
    	    showLen = showData.length;
        
    	for(var i=0;i<showLen;i++){
    		isDelete = true;
    		var cid = showData[i]["cid"];
    		for(var k = 0;k<len;k++){
    			if(data[k]["cid"] === cid){
    				tempData.push(showData[i]);
    				isDelete = false;
    			}
    		}
    		if(isDelete){
    			if(currentIndex>i){
    				currentIndex --;
    			}
                deleteArray.push(cid);
    			//findDom(cid);
    		}
    	}
    
    	for(var i=0;i<len;i++){
    		var isHas = false,
    		    cid = data[i]["cid"];
    		for(var k=0;k<showLen;k++){
    			if(showData[k]["cid"] === cid){
    				isHas = true;
    			}
    		}
    		if(!isHas){
    			tempData.push(data[i]);
                addArray.push(data[i]);
    		}
    	}

    	showData = tempData;
        travelDeleteDome(deleteArray);
        travaleAddDome(addArray);
    }

    // setTimeout(function(){
    // 	initAnmation();
    // },15000)
    // initAnmation();

	clearInt = setInterval(function(){
		initAnmation();
	}, 1000*30);

	// setTimeout(function(data){
	// 	var tempData = showData.slice(50) 
	//     var temp = [],
	//         len = showData.length-1;
	// 	for(var i=0;i<50;i++){
	// 		temp.push(showData[len-i]);
	// 	}
	// 	common.initData(function(data){
	// 	    updateData(data);
 //    	});
	// },10000);
    
    clearUpdate = setInterval(function(){
    	common.initData(function(data){
    	    deleteDomIndex = 0;
    		updateData(data);
    	});
    },10000);

}                             