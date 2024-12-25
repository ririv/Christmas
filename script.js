    // 雪花动画脚本
    (function() {
    const canvas = document.getElementById('snowCanvas');
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const snowflakes = [];
    const numberOfSnowflakes = 200;

    // 雪花类
    class Snowflake {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 3 + 1;
            this.speed = Math.random() * 1 + 0.5;
            this.wind = Math.random() * 0.5 - 0.25;
        }

        update() {
            this.y += this.speed;
            this.x += this.wind;

            // 如果雪花超出下边界，则重置到顶部
            if (this.y > height) {
                this.y = 0;
                this.x = Math.random() * width;
                this.speed = Math.random() * 1 + 0.5;
                this.wind = Math.random() * 0.5 - 0.25;
            }

            // 如果雪花超出左右边界，则将其重新定位到另一侧
            if (this.x > width) {
                this.x = 0;
            } else if (this.x < 0) {
                this.x = width;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
        }
    }

    // 初始化雪花
    for (let i = 0; i < numberOfSnowflakes; i++) {
        snowflakes.push(new Snowflake());
    }

    // 动画循环
    function animateSnow() {
        ctx.clearRect(0, 0, width, height);
        ctx.globalAlpha = 0.8; // 设置全局透明度

        snowflakes.forEach(flake => {
            flake.update();
            flake.draw();
        });

        requestAnimationFrame(animateSnow);
    }

    animateSnow();

    // 处理窗口大小变化
    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // 重新定位雪花以适应新的窗口大小
        snowflakes.forEach(flake => {
            flake.x = Math.random() * width;
            flake.y = Math.random() * height;
        });
    });
})();


// 自动播放背景音乐
let intervalId; // 在全局定义 intervalId
const music = document.getElementById("bgm");  // 获取ID
const muteButton = document.getElementById('muteButton');
const muteIcon = muteButton.querySelector('img'); // 获取按钮中的图片元素

window.onload = function(){
    intervalId = setInterval(autoPlayMusic, 100);
}

function autoPlayMusic() {

    if (music.paused) {  // 判断是否暂停
        console.log('play bg music')
        music.play();  // 如果暂停则播放
    }
    
    // 停止定时器
    if (!music.paused && music.currentTime > 0) {
        clearInterval(intervalId);
    }
}

// 点击按钮时切换静音状态和图标
muteButton.addEventListener('click', function() {
    // 切换音频的静音状态
    music.muted = !music.muted;

    // 根据静音状态切换图标
    if (music.muted) {
    muteIcon.src = 'mute.png';  // 静音图标
    } else {
    muteIcon.src = 'play.png'; // 恢复音量图标
    }
});


document.getElementById('hat').addEventListener('click', function () {
    const hat = this;

    // 添加 shake 类触发动画
    hat.classList.add('shake');

    // 动画结束后移除 shake 类，回归初始状态
    setTimeout(() => {
        hat.classList.remove('shake');
    }, 500); // 动画时间应与 CSS 中 @keyframes shake 定义的时间一致
});
