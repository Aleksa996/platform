import Phaser from "phaser";
import collidable from "../mixins/collidable";

class Enemy extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y,key){
        super(scene,x,y,key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //Mixins
        Object.assign(this, collidable);

        this.init();
        this.initEvents();
    }

    init(){

    this.gravity = 500;
    this.speed = 150;
   
    this.body.setGravityY(this.gravity);
    this.setSize(20, 45);
    this.setOffset(7,20);
    this.setCollideWorldBounds(true);
    this.setImmovable(true);
    this.setOrigin(0.5,1);
    }

    initEvents(){
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update,this)
    }

    update(time,delta){
        this.setVelocityX(30);
    }
}

export default Enemy;