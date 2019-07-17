"use strict";
cc._RF.push(module, '58f7057g41AHZDYHzIQllEU', 'game');
// scripts/game.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        // 这个属性引用了星星预制资源
        starPrefab: {
            default: null,
            type: cc.Prefab
        },

        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,

        // 地面节点，用于确定星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },

        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: cc.Node
        },

        //分数文本
        scoreDisplay: {
            default: null,
            type: cc.Label
        },

        //得分音效
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.groundY = this.groundY + this.ground.height / 2;

        //初始化计时器
        this.timer = 0;
        this.starDuration = 0;

        //初始化计分
        this.score = 0;

        //生成新星星
        this.spawnNewStar();
    },
    start: function start() {},
    update: function update(dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameover();
            return;
        }
        this.timer += dt;
    },


    // 创建星星
    spawnNewStar: function spawnNewStar() {
        var newStar = cc.instantiate(this.starPrefab); //克隆任意对象
        this.node.addChild(newStar);
        //setPosition 方法 作用是设置节点在父节点坐标系中的位置
        newStar.setPosition(this.getNewStarPosition());

        // 在星星组件上暂存 Game 对象的引用
        newStar.getComponent('star').game = this;

        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;

        //console.log(newStar);
    },

    getNewStarPosition: function getNewStarPosition() {
        var randX = 0;
        //getComponent 方法可以得到该节点上挂载的组件引用
        var randY = this.groundY + Math.random() * this.player.getComponent('player').jumpHeight;
        var maxX = this.node.width / 2; //锚点在中心，所以最大是一半
        randX = (Math.random() - 0.5) * 2 * maxX; //-0.5为了出现正负

        //返回星星坐标
        return cc.v2(randX, randY);
    },

    gainScore: function gainScore() {
        this.score += 1;
        this.scoreDisplay.string = 'Score:' + this.score;

        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    gameover: function gameover() {
        this.player.stopAllActions(); //停止 player 节点的跳跃动作
        cc.director.loadScene('game'); //这个方法会让节点上的所有 Action 都失效。
        //cc.director.loadScene('game') 就是重新加载游戏场景 game，也就是游戏重新开始
    }

});

cc._RF.pop();