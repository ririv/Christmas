const giftContainer = document.getElementById('gift-container'); // SVG容器
const particlesContainer = document.querySelector('.particles'); // 粒子效果容器
const treeContainer = document.getElementById('treeContainer'); // 圣诞树容器

// 动态加载SVG
fetch('gift.svg') // 替换为你的礼物SVG文件路径
    .then(response => response.text())
    .then(svg => {
        giftContainer.innerHTML = svg; // 加载SVG到容器内
        const loadedSVG = giftContainer.querySelector('svg'); // 获取加载的SVG元素
        loadedSVG.setAttribute('id', 'gift'); // 给SVG设置ID
        bindExplosionEffect(loadedSVG); // 绑定爆炸效果事件
    })
    .catch(err => console.error('加载SVG失败:', err));

// 绑定爆炸效果事件
function bindExplosionEffect(svgElement) {
    svgElement.addEventListener('click', () => {
        // 手动触发缩放效果
        svgElement.style.transform = 'scale(0.95)';

        // 等待缩小完成
        svgElement.addEventListener(
            'transitionend',
            function handleTransitionEnd() {
                // 恢复原样动画开始
                svgElement.style.transform = 'scale(1)';

                // 在恢复一半时间后触发爆炸
                setTimeout(() => {
                    const rect = svgElement.getBoundingClientRect(); // 获取SVG的位置
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    // 隐藏SVG
                    svgElement.style.display = 'none';

                    // 触发爆炸粒子效果
                    createExplosion(centerX, centerY);

                    // 显示圣诞树
                    setTimeout(() => {
                        treeContainer.style.display = 'block'; // 显示圣诞树
                    }, 500); // 延迟1秒显示圣诞树
                }, 150); // 恢复一半时间后触发爆炸

                // 移除事件监听，避免重复绑定
                svgElement.removeEventListener('transitionend', handleTransitionEnd);
            }
        );
    });
}

// 创建爆炸粒子效果
function createExplosion(x, y) {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.background = getRandomColor();
        particle.style.borderRadius = '50%';
        particle.style.top = `${y}px`;
        particle.style.left = `${x}px`;
        particlesContainer.appendChild(particle);

        const angle = Math.random() * 2 * Math.PI; // 随机角度
        const distance = Math.random() * 200 + 50; // 随机爆炸距离
        const duration = Math.random() * 1 + 0.5; // 随机动画时间

        // 使用GSAP动画
        gsap.to(particle, {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            opacity: 0,
            scale: 0.5,
            duration: duration,
            ease: 'power1.out',
            onComplete: () => particle.remove() // 动画完成后移除粒子
        });
    }
}

// 随机颜色生成函数
function getRandomColor() {
    const colors = ['#ff5252', '#ffb74d', '#4fc3f7', '#81c784', '#ba68c8'];
    return colors[Math.floor(Math.random() * colors.length)];
}


// 获取 SVG 元素
const svg = document.getElementById('tree');

// 配置流星数量
const meteorCount = 3; // 流星数量
const maxTrailLength = 20; // 拖尾最大长度

// 存储流星及其轨道信息
const meteors = [];

// 初始化流星
for (let i = 0; i < meteorCount; i++) {
    // 创建流星元素
    const meteor = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    meteor.setAttribute('r', 2); // 流星半径
    meteor.setAttribute('fill', 'white');
    meteor.setAttribute('opacity', 1);
    svg.appendChild(meteor);

    // 每颗流星的轨道配置
    meteors.push({
        element: meteor,
        centerX: 400,
        centerY: 300 + i / meteorCount * 350 - 130, // 随机中心 Y 坐标
        radiusX: 120 + i / meteorCount * 150, // 随机水平半径
        radiusY: 30 + i / meteorCount * 10, // 随机垂直半径
        angle: (i * (2 * Math.PI)) / meteorCount, // 初始角度，均匀分布
        trailElements: [], // 存储拖尾
    });
}

function animateMeteors() {
    meteors.forEach((meteorData) => {
        const { element, centerX, centerY, radiusX, radiusY, trailElements } = meteorData;

        // 计算流星的位置
        const x = centerX + radiusX * Math.cos(meteorData.angle);
        const y = centerY + radiusY * Math.sin(meteorData.angle);

        // 更新流星的位置
        element.setAttribute('cx', x);
        element.setAttribute('cy', y);

        // 控制流星透明度（上半圆逐渐消失）
        let particleOpacity = 1;
        if (y < centerY) {
            particleOpacity = (y - (centerY - radiusY)) / radiusY; // 透明度从 1 到 0
        }
        element.setAttribute('opacity', Math.max(0, Math.min(particleOpacity, 1)));

        // 创建拖尾
        const trail = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        const prevX = centerX + radiusX * Math.cos(meteorData.angle - 0.1);
        const prevY = centerY + radiusY * Math.sin(meteorData.angle - 0.1);
        trail.setAttribute('x1', prevX);
        trail.setAttribute('y1', prevY);
        trail.setAttribute('x2', x);
        trail.setAttribute('y2', y);
        trail.setAttribute('stroke', 'white');
        trail.setAttribute('stroke-width', 2);
        trail.setAttribute('opacity', particleOpacity);
        svg.appendChild(trail);
        trailElements.push(trail);

        // 渐隐拖尾
        trailElements.forEach((trail, index) => {
            const opacity = parseFloat(trail.getAttribute('opacity'));
            if (opacity > 0) {
                trail.setAttribute('opacity', opacity - 0.05); // 逐渐减少透明度
            } else {
                svg.removeChild(trail);
                trailElements.splice(index, 1); // 删除透明度为 0 的拖尾
            }
        });

        // 限制拖尾长度（防止拖尾过多）
        if (trailElements.length > maxTrailLength) {
            const oldTrail = trailElements.shift();
            svg.removeChild(oldTrail);
        }

        // 增加角度，控制旋转速度
        meteorData.angle += 0.05;
        if (meteorData.angle >= 2 * Math.PI) {
            meteorData.angle -= 2 * Math.PI; // 防止角度过大
        }
    });

    // 循环动画
    requestAnimationFrame(animateMeteors);
}

// 启动动画
animateMeteors();
