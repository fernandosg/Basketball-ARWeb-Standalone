function Basketball(){

}

Basketball.prototype.start=function(){
  var geometry=new THREE.PlaneGeometry(80,80);
  var elemento=framework.createElement({WIDTH:80,HEIGHT:80,GEOMETRY:geometry});
  elemento.init();
  elemento.defineSurfaceByResource("./assets/img/basket/balon.png");
  elemento.scale(.6,.6);
  this.puntero=new THREE.Object3D();
  this.puntero.add(elemento.get());
  this.puntero.position.z=-1;
  this.puntero.matrixAutoUpdate = false;
  this.puntero.visible=false;



  this.hombro_obj=framework.createElement({WIDTH:60,HEIGHT:72,GEOMETRY:geometry});
  this.hombro_obj.init();
  this.hombro_obj.scale(.6,.6)
  this.hombro_obj.defineSurfaceByResource("./assets/img/mano.png");
  this.hombro=new THREE.Object3D();
  this.hombro.add(this.hombro_obj.get());
  this.hombro.position.z=-1;
  this.hombro.matrixAutoUpdate = false;
  this.hombro.visible=false;
  framework.addMarker({id:16,callback:this.findedMarker,puntero:this.puntero}).attach(16,{id:17,puntero:this.hombro});
  geometry=new THREE.PlaneGeometry(60,72);
  this.canasta=framework.createElement({WIDTH:60,HEIGHT:72,GEOMETRY:geometry});
  this.canasta.init();
  this.canasta.defineSurfaceByResource("./assets/img/basket/canasta.png");
  this.canasta.position({x:150,y:0,z:-500});
  framework.addToScene(this.canasta,true).watch("encesta",framework.position_util.isColliding);
  ///*
  this.origen=framework.createElement({WIDTH:60,HEIGHT:72,GEOMETRY:geometry});
  this.origen.init();
  this.origen.position({x:0,y:-170,z:-500});
  this.position_for_origin=framework.position_util.init({DISTANCE:180});
  framework.addToScene(this.origen,true).watch("origen",this.position_for_origin.isColliding);

  geometry=new THREE.PlaneGeometry(2,1200);
  this.linea=framework.createElement({WIDTH:2,HEIGHT:1200,GEOMETRY:geometry});
  this.linea.init();
  this.linea.defineSurfaceByColor("rgb(34, 208, 6)");
  this.linea.position({x:0,y:0,z:-500});
  this.linea.visible();

  framework.addToScene(this.linea);
  this.total_canastas=0;
  this.limite_canastas=5;
  this.repeticiones=0;
  this.limite_repeticiones=2;
  this.encestado=false;
}

Basketball.prototype.getAngle=function(sideA,sideB,sideC){
  return Math.acos((Math.pow(sideA,2)-Math.pow(sideB,2)-Math.pow(sideC,2))/(-2*sideB*sideC))*(180 / Math.PI);
}

Basketball.prototype.checkingAngle=function(){
  //var sideC=this.hombro_obj.getDistancia(this.origen.get());
  var sideC=framework.position_util.getDistancia(this.hombro_obj.get().getWorldPosition(),this.origen.get().getWorldPosition());
  console.log("La distancia del hombro al origen "+sideC);
  //var sideB=this.hombro_obj.getDistancia(this.puntero);
  var sideB=framework.position_util.getDistancia(this.hombro_obj.get().getWorldPosition(),this.puntero.getWorldPosition());
  console.log("La distancia del hombro al puntero "+sideB);
  //var sideA=this.origen.getDistancia(this.puntero);
  var sideA=framework.position_util.getDistancia(this.origen.get().getWorldPosition(),this.puntero.getWorldPosition());
  console.log("La distancia del origen al puntero "+sideA);
  console.log("El angulo de apertura es "+this.getAngle(sideA,sideB,sideC));
}

Basketball.prototype.findedMarker=function(puntero){
  if(puntero.getWorldPosition().z>300 && puntero.getWorldPosition().z<=500){
    puntero.visible=true;
    framework.dispatch("encesta",[puntero.getWorldPosition()],this.basketLogic);
    framework.dispatch("origen",[puntero.getWorldPosition()],this.originLogic);
    //framework.dispatch("colision",puntero,this.logicaMemorama,{stage:this});//this.mediador.comunicar("colision",puntero,this.logicaMemorama,{stage:this});
  }
}

Basketball.prototype.originLogic=function(esColisionado){
  if(esColisionado && this.encestado==true){
    console.log("regresa al encestar")
    this.encestado=false;
  }
}

Basketball.prototype.cercaDeMedio=function(obj){
  return (obj.position.x<=60 && obj.position.x>=0) || (obj.position.x>=-60 && obj.position.x<=0);
}

Basketball.prototype.basketLogic=function(esColisionado){
  if(esColisionado){
    if(this.total_canastas==this.limite_canastas){
      console.log("Yei enceste "+this.limite_canastas);
      this.checkingAngle();
      this.raiseBasket();
      this.total_canastas=0;
      this.repeticiones++;
      this.encestado=false;
      if(this.repeticiones==this.limite_repeticiones){
        framework.finishStage();
      }
    }else if(!this.encestado && this.cercaDeMedio(this.hombro)){
      console.log("regresa al origen");
      this.total_canastas++;
      this.encestado=true;
    }
  }
}

Basketball.prototype.raiseBasket=function(){
  this.canasta.incrementar({y:32});
}

Basketball.prototype.loop=function(){
  this.origen.position({x:this.hombro.getWorldPosition().x,y:this.hombro.getWorldPosition().y-270,z:-this.hombro.getWorldPosition().z});
}
