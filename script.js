// 视频播放功能 - 全局函数
function playVideo(type) {
    const modal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoSource = document.getElementById('videoSource');
    
    // 根据类型设置视频源
    if (type === 'jump') {
        videoSource.src = 'videos/Jump.mp4'; // 跳转视频文件
    } else if (type === 'sway') {
        videoSource.src = 'videos/Sway.mp4'; // 摇摆视频文件
    }
    
    // 显示弹窗并播放视频
    modal.style.display = 'block';
    videoPlayer.load();
    videoPlayer.play();
    
    // 阻止背景滚动
    document.body.style.overflow = 'hidden';
}

function closeVideo() {
    const modal = document.getElementById('videoModal');
    const videoPlayer = document.getElementById('videoPlayer');
    
    // 隐藏弹窗并停止视频
    modal.style.display = 'none';
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
    
    // 恢复背景滚动
    document.body.style.overflow = 'auto';
}

// 点击弹窗外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('videoModal');
    if (event.target === modal) {
        closeVideo();
    }
}

// 导航栏交互
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // 汉堡菜单切换
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // 点击导航链接时关闭菜单
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // 滚动时导航栏样式变化
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(116, 185, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)';
            navbar.style.backdropFilter = 'none';
        }
    });
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // 考虑固定导航栏的高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    document.querySelectorAll('.step, .tip-category, .trouble-item, .checklist, .setup-steps').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // 复选框交互
    document.querySelectorAll('.checklist input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            playCheckSound();
            const label = this.nextElementSibling;
            if (this.checked) {
                label.style.textDecoration = 'line-through';
                label.style.color = '#28a745';
                // 添加完成动画
                label.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    label.style.transform = 'scale(1)';
                }, 200);
            } else {
                label.style.textDecoration = 'none';
                label.style.color = '#333';
            }
            
            // 检查是否所有项目都已完成
            checkAllItemsComplete();
        });
    });
    
    // 检查所有项目是否完成
    function checkAllItemsComplete() {
        const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
        const checkedBoxes = document.querySelectorAll('.checklist input[type="checkbox"]:checked');
        const okBadge = document.getElementById('okBadge');
        const setupSteps = document.getElementById('setupSteps');
        
        if (checkedBoxes.length === checkboxes.length && checkboxes.length > 0) {
            // 所有项目都已完成
            setTimeout(() => {
                // 显示OK徽章
                okBadge.classList.add('show');
                
                // 添加庆祝动画
                okBadge.style.animation = 'bounce 0.6s ease-in-out';
                
                // 播放庆祝音效（可选）
                playCelebrationSound();
                
                // 延迟显示はじめ方内容
                setTimeout(() => {
                    setupSteps.classList.add('show');
                    
                    // 为はじめ方内容添加逐个显示动画
                    const setupStepsItems = setupSteps.querySelectorAll('li');
                    setupStepsItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '0';
                            item.style.transform = 'translateX(-20px)';
                            item.style.transition = 'all 0.5s ease';
                            
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateX(0)';
                            }, 100);
                        }, index * 300);
                    });
                }, 1000);
            }, 500);
        } else {
            // 有项目未完成，隐藏OK徽章和はじめ方内容
            okBadge.classList.remove('show');
            setupSteps.classList.remove('show');
        }
    }
    
    // 播放庆祝音效（使用Web Audio API）
    function playCelebrationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            // 如果音频播放失败，静默处理
            console.log('Audio playback not supported');
        }
    }
    
    // 进度指示器
    function updateProgress() {
        const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
        const checkedBoxes = document.querySelectorAll('.checklist input[type="checkbox"]:checked');
        const progress = (checkedBoxes.length / checkboxes.length) * 100;
        
        // 创建或更新进度条
        let progressBar = document.querySelector('.progress-bar');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                height: 4px;
                background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
                z-index: 1001;
                transition: width 0.3s ease;
            `;
            document.body.appendChild(progressBar);
        }
        progressBar.style.width = progress + '%';
    }
    
    // 监听复选框变化来更新进度
    document.querySelectorAll('.checklist input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateProgress);
    });
    
    // 初始化进度
    updateProgress();
    
    // 添加一些有趣的交互效果
    document.querySelectorAll('.step').forEach((step, index) => {
        step.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        step.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // 添加延迟动画
        setTimeout(() => {
            step.style.opacity = '1';
            step.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // 添加提示卡片的悬停效果
    document.querySelectorAll('.tip-category').forEach((tip, index) => {
        tip.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) rotate(1deg)';
        });
        
        tip.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg)';
        });
        
        // 添加延迟动画
        setTimeout(() => {
            tip.style.opacity = '1';
            tip.style.transform = 'translateY(0)';
        }, index * 150);
    });
    
    // 添加故障排除项的交互
    document.querySelectorAll('.trouble-item').forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(1.02)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    // 导航按钮交互效果
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            // 添加轻微的弹跳效果
            this.style.transform = this.classList.contains('nav-btn-prev') 
                ? 'translateX(-5px) scale(1.05)' 
                : 'translateX(5px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
        
        btn.addEventListener('click', function(e) {
            // 添加点击波纹效果
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // 添加返回顶部按钮
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(backToTop);
    
    // 显示/隐藏返回顶部按钮
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    // 返回顶部功能
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 添加键盘导航支持
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
    
    // 添加加载动画
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
});

// 添加移动端菜单样式和波纹动画
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: rgba(116, 185, 255, 0.95);
            width: 100%;
            text-align: center;
            transition: 0.3s;
            backdrop-filter: blur(10px);
            padding: 2rem 0;
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-menu li {
            margin: 1rem 0;
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }
        
        .hamburger.active span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// 轻快的check音效
function playCheckSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = 880;
        gain.gain.value = 0.12;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.frequency.linearRampToValueAtTime(1760, ctx.currentTime + 0.08);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.12);
        osc.stop(ctx.currentTime + 0.12);
        osc.onended = () => ctx.close();
    } catch (e) {}
}

// 作品gallery动态加载gif（初始静止，点击后播放）
const worksGallery = document.getElementById('worksGallery');
if (worksGallery) {
    // 静态图和gif一一对应
    const works = [
        { still: 'theworks/1.jpg', gif: 'theworks/1.gif' },
        { still: 'theworks/2.jpg', gif: 'theworks/2.gif' },
        { still: 'theworks/3.jpg', gif: 'theworks/3.gif' }
    ];
    works.forEach((work, idx) => {
        const card = document.createElement('div');
        card.className = 'works-card';
        // 静止图
        const still = document.createElement('img');
        still.src = work.still;
        still.alt = `work${idx+1}`;
        still.style.width = '100%';
        still.style.height = '100%';
        still.style.objectFit = 'contain';
        still.draggable = false;
        // 遮罩
        const mask = document.createElement('div');
        mask.className = 'works-mask';
        mask.innerHTML = `<div class=\"works-click-icon\">👉</div>`;
        // 点击遮罩后播放gif
        mask.addEventListener('click', function(e) {
            e.stopPropagation();
            const gifImg = document.createElement('img');
            gifImg.src = work.gif + '?t=' + Date.now();
            gifImg.alt = still.alt;
            gifImg.style.width = '100%';
            gifImg.style.height = '100%';
            gifImg.style.objectFit = 'contain';
            gifImg.draggable = false;
            card.replaceChild(gifImg, still);
            mask.classList.add('hide');
        });
        card.appendChild(still);
        card.appendChild(mask);
        worksGallery.appendChild(card);
    });
} 