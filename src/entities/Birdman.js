import Phaser from "phaser";
import Enemy from "./Enemy";

class Birdman extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x,y){
        super(scene,x,y,"birdman");
    }
}

export default Birdman;