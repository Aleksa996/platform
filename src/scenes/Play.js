import Phaser from 'phaser';
import Enemy from '../entities/Enemy';
import Player from "../entities/Player";

import { getEnemyTypes } from '../types';

class Play extends Phaser.Scene {

  constructor(config) {
    super('PlayScene');
    this.config = config;
  }

  create() {
    const map = this.createMap();
    const layers = this.createLayers(map);
    const playerZones = this.getPlayerZones(layers.playerZones);
    const player = this.createPlayer(playerZones.start);
    const enemies = this.createEnemies(layers.enemySpawns);
    
    this.createEnemyColliders(enemies,{
      colliders:{
      platformsColliders:layers.platformsColliders,
      player
    }});

    this.createPlayerColliders(player,{
      colliders:{
      platformsColliders:layers.platformsColliders
    }});

    this.createEndOfLevel(playerZones.end, player);
    this.setupFollowupCameraOn(player);
  }

  createMap(){
    const map = this.make.tilemap({key: 'map'});
    map.addTilesetImage('main_lev_build_1', 'tiles-1');
    return map;
  }

  createLayers(map){
    const tileset = map.getTileset('main_lev_build_1');
    const platformsColliders = map.createDynamicLayer('platforms_colliders', tileset);
    const enviroment = map.createStaticLayer('environment', tileset);
    const platforms = map.createDynamicLayer('platforms', tileset);
    const playerZones = map.getObjectLayer("player_zones");
    const enemySpawns = map.getObjectLayer("enemy_spawns");
    

    platformsColliders.setCollisionByProperty({collides: true});

    return {enviroment, platforms, platformsColliders,playerZones,enemySpawns};
  }

  createPlayer(start){
    return new Player(this, start.x, start.y);
  }

  createEnemies(spawnLayer) {
    const enemyTypes = getEnemyTypes();
    return spawnLayer.objects
      .filter(spawnPoint => enemyTypes[spawnPoint.type] != undefined)
      .map(spawnPoint => {
        return new enemyTypes[spawnPoint.type](this, spawnPoint.x, spawnPoint.y);
    })
    
  }

  createEnemyColliders(enemies,{colliders}){
    enemies.forEach(enemy => {
    enemy.addCollider(colliders.platformsColliders);
    enemy.addCollider(colliders.player)
    })
  }

  createPlayerColliders(player,{colliders}){
    player.addCollider(colliders.platformsColliders);
  }

  setupFollowupCameraOn(player){
    const {height,width,mapOffset,zoomFactor} = this.config;

    this.physics.world.setBounds(0,0,width + mapOffset,height + 200);

    this.cameras.main.setBounds(0,0,width + mapOffset,height).setZoom(zoomFactor);
      this.cameras.main.startFollow(player);
  }

  getPlayerZones(playerZone){
    const playerZones = playerZone.objects;
    return{
      start: playerZones[0],
      end: playerZones[1]
    }
  }

  createEndOfLevel(end, player){
    const endOfLevel = this.physics.add.sprite(end.x,end.y,"end").setSize(5, this.config.height);

    const eolOverlap = this.physics.add.overlap(player,endOfLevel, () => {
      eolOverlap.active = false;
      console.log("Player has won");
    })

  }
}

export default Play;