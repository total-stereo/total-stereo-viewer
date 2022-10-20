//import {Application} from 'pixi.js';
//import * as PIXI from 'pixi.js-legacy'

$(document).on('turbolinks:load', function() {
  
  var canvas = document.getElementById("pixiCanvas");
  if (canvas == null){
    return;
  }
  /*
  //Create a Pixi Application
  const app = new PIXI.Application({view: canvas});

  //Add the canvas that Pixi automatically created for you to the HTML document
  document.body.appendChild(app.view);*/
  
  var app = new PIXI.Application({ view: canvas})
  var alpha;
  var beta;

  var stereoImgDiv = document.getElementById('stereoImage');
  
  var imgPath = stereoImgDiv.dataset.imgpath;
  var mapPath = stereoImgDiv.dataset.mappath;


  var img = new PIXI.Sprite.from(imgPath);
  var imgratio = img.width / img.height;
  img.width = window.innerWidth;
  img.height = window.innerHeight;
  app.stage.addChild(img);

  var depthMap = new PIXI.Sprite.from(mapPath);
  depthMap.width = window.innerWidth;
  depthMap.height = window.innerHeight;
  app.stage.addChild(depthMap);
  
  resize();
  
  let displacementFilter = new PIXI.filters.DisplacementFilter(depthMap);
  app.stage.filters = [displacementFilter];

  window.onmousemove = function(e) {
    displacementFilter.scale.x = (window.innerWidth / 2 - e.clientX) /35;
    displacementFilter.scale.y = (window.innerHeight / 2 - e.clientY) /35;
    //console.log(displacementFilter.scale.x + " " + displacementFilter.scale.y);
  };
  window.ontouchmove = function(e) {
    displacementFilter.scale.x = -(window.innerWidth / 2 - e.pageX) /20;
    displacementFilter.scale.y = -(window.innerHeight / 2 - e.pageY) /20;
    //console.log(displacementFilter.scale.x + " " + displacementFilter.scale.y);
  };



  var initRotateDegrees;
  var initFrontToBack;
  var initLeftToRight;

  var mobileDevice = false;
  var gyroControlActive = false;
  try {
    DeviceMotionEvent;
    mobileDevice = true;
    $("#startButton").on("click",enableSensor);
  }catch{
    $("#startButton").hide();
    console.log("DeviceMotionEvent is not defined");
  }
  
  
  // resizing
  window.addEventListener('resize', resize);

  // Resize function window
  function resize() {

  	// Get the p
  	const parent = app.view.parentNode;
   
  	
  
    // You can use the 'screen' property as the renderer visible
    // area, this is more useful than view.width/height because
    // it handles resolution
    
    
    var newHeight = window.innerHeight-20;
    var newWidth = window.innerWidth-20;
    var rendererRatio = newWidth / newHeight;
    if (rendererRatio > 1 && imgratio > 1 ){
      newWidth = newHeight*imgratio;
      console.log("Case A");
    }else{
      newHeight = newWidth / imgratio;
      console.log("Case B");
    }
    
    console.log(rendererRatio + " " + imgratio + " " + (newWidth / newHeight));
    
  	// Resize the renderer
  	app.renderer.resize(newWidth, newHeight);
    
    
    depthMap.width = newWidth;
    depthMap.height = newHeight;
    img.width = newWidth;
    img.height = newHeight;
  }

  resize();
  
  // tilt
  function direction() {
  
    var promise = FULLTILT.getDeviceOrientation({'type': 'game'});
  	promise.then(function(orientationControl) {

  		orientationControl.listen(function() {

  			// Get latest screen-adjusted deviceorientation data
  			var screenAdjustedEvent = orientationControl.getScreenAdjustedEuler();
      
        var rotateDegrees = screenAdjustedEvent.alpha;
        var frontToBack = screenAdjustedEvent.beta;
        var leftToRight = screenAdjustedEvent.gamma;
        if(gyroControlActive == false){
          initLeftToRight = leftToRight;
          initFrontToBack = frontToBack;
          gyroControlActive = true;
        }
      
        displacementFilter.scale.x = -(initLeftToRight - leftToRight) % 360 * 1.4;
        displacementFilter.scale.y = -(initFrontToBack - frontToBack) % 360 * 1.4;
      

        //console.log(" " + displacementFilter.scale.y + " " + -(initFrontToBack - frontToBack));
        //console.log(" " + displacementFilter.scale.x);
  		});

  	});    
  }


    
  function enableSensor(){
  	$("#overlay").remove();
    //$("#startButton").prop("disabled",true);
    $("#startButton").html("Sensorsteuerung zurücksetzen");
  
    if (mobileDevice && typeof DeviceMotionEvent.requestPermission==="function" && !gyroControlActive) { // iOS 13+ devices
        DeviceMotionEvent.requestPermission()
          .then((state)=>{
            if (state==="granted") {
              direction();
            } else {
              console.error("Motion sensor access denied.");}})
          .catch(console.error);
      } else if (gyroControlActive){
        gyroControlActive = false;
      } else { // non iOS 13+ devices
        direction();
      }
  }   
  
  
  // navigation
  
  $(this).keydown(function(e) {
    e.preventDefault();
	var target;
    if(e.keyCode == 37) { 
		target = $(".prev-button").attr("href");
  	}else if(e.keyCode == 39){
  		target = $(".next-button").attr("href");
  	}
	
	if(target !== undefined){
		app.stop();
		Turbolinks.visit(target, { action: "replace" });
	}
  });


  
});


 