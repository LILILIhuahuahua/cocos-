
cc.Class({
    extends: cc.Component,

    //�������Ի���������
    properties: {   
        // 
        jumpHeight: 300,
        //             
        jumpDuration: 0,
        // 
        maxMoveSpeed: 0,
        // 
        accel: 0,

        //跳跃音效
        jumpAudio: {
            default: null,
            type: cc.AudioClip
        },

    },

    setJumpAction: function () {  //����Ҫ����
        // ��Ծ����
        var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // ����
        var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        
        // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法
        //callFunc 调用回调函数可以让函数转变为 cc 中的 Action（动作）
        var callback = cc.callFunc(this.playJumpSound, this);
        // 不断重复，而且每次完成落地动作后调用回调来播放声音
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));     
    },

    //播放声音
    playJumpSound: function () {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },
    

    onLoad: function () {
        // ��ʼ����Ծ����
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);
    },

    onKeyDown(event) {
        // set a flag when key pressed
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = true;
                break;
            case cc.macro.KEY.d:
                this.accRight = true;
                break;
        }
    },

    onKeyUp(event) {
        // unset a flag when key released
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
                this.accRight = false;
                break;
        }
    },

    onLoad: function () {

        // 变量不用声明
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);

        // 
        this.accLeft = false;
        this.accRight = false;

        // 
        this.xSpeed = 0;

        // on 添加监听事件
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onDestroy() {
        //  off 取消监听事件
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    //dt 每帧变化
    update: function (dt) {
        // 每帧加减速度，会产生惯性的效果
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt; //每帧，所以 *dt
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        // 
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);  
        }
        //
        if (Math.abs(this.node.x) > 500) {
            this.node.x = 500 * -1*this.node.x / Math.abs(this.node.x)
        }

        // 改变位置
        this.node.x += this.xSpeed * dt;


    },

    

    
    start () {
        
    },

    
});
