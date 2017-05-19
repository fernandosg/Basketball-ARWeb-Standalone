framework=new ARWeb({WIDTH:640,HEIGHT:480,canvas_id:"ra"});
framework.init();
var calibracion=new Calibracion();
var basketball=new Basketball();
framework.addStage(calibracion);
framework.addStage(basketball);
framework.start();
