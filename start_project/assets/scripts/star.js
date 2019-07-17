cc.Class({
    extends: cc.Component,

    properties: {
       // 星星和主角之间的距离小于这个数值时，就会完成收集
       pickRadius: 0,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {
         this.duration = 0;
     },

    start () {
        
    },

     update (dt) 
     {
         // 每帧判断和主角之间的距离是否小于收集距离
         if(this.getPlayerDistance()<this.pickRadius)
         {
             this.onPicked();
         }

         // 根据 Game 脚本中的计时器更新星星的透明度
         var opacityRatio = 1-this.game.timer/this.game.starDuration;
         var minOpacity = 50;
         this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
         
     },

    getPlayerDistance:function()
    {
         // 根据 player 节点位置判断距离
         //getPosition() 方法 返回的是节点在父节点坐标系中的位置（x, y）
         var playerPos = this.game.player.getPosition();
         // 根据两点位置计算两点之间距离
         var dist = this.node.position.sub(playerPos).mag();
         return dist;
    },

    onPicked: function() {
        // 当星星被收集时，调用 Game 脚本中的接口，生成一个新的星星
        this.game.spawnNewStar();
        // 然后销毁当前星星节点
        this.node.destroy();
        //加分
        this.game.gainScore();
    },


});
