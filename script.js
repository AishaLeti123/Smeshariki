document.addEventListener('DOMContentLoaded', () => {
    
    const liftBtn = document.getElementById('liftBtn');
    const clicksEl = document.getElementById('clicks');
    const plateausEl = document.getElementById('plateaus');
    const levelEl = document.getElementById('level');
    const kopatych = document.getElementById('kopatych');
    const plateauMsg = document.getElementById('plateauMsg');
    const plateauTimer = document.getElementById('plateauTimer');
    const plateauBar = document.getElementById('plateauBar');
    const gameStatus = document.getElementById('gameStatus');
    const effectsLayer = document.getElementById('effects');

    let clicks = 0;
    let plateaus = 0;
    let level = 1;
    let inPlateau = false;
    let plateauInterval = null;
    let gameStarted = false;

    liftBtn.addEventListener('click', handleClick);

    function handleClick() {
        if (!gameStarted) {
            gameStarted = true;
            gameStatus.textContent = '💪 Тренировка началась!';
        }

        if (inPlateau) {
            failPlateau();
            return;
        }

        clicks++;
        clicksEl.textContent = clicks;

        kopatych.classList.add('lifting');
        setTimeout(() => kopatych.classList.remove('lifting'), 400);

        showEffect('+1', '#4CAF50');

        if (clicks >= 10) {
            startPlateau();
        }
    }

    function startPlateau() {
        inPlateau = true;
        plateauMsg.classList.remove('hidden');
        liftBtn.disabled = true;
        
        let timeLeft = 3.0;
        plateauTimer.textContent = timeLeft.toFixed(1);
        plateauBar.style.width = '0%';

        gameStatus.textContent = '🛑 ПЛАТО! Не нажимай кнопку!';
        gameStatus.style.color = '#FF6B6B';

        const startTime = Date.now();
        plateauInterval = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            const remaining = Math.max(0, 3 - elapsed);
            plateauTimer.textContent = remaining.toFixed(1);
            plateauBar.style.width = ((elapsed / 3) * 100) + '%';

            if (remaining <= 0) {
                clearInterval(plateauInterval);
                successPlateau();
            }
        }, 50);
    }

    function successPlateau() {
        inPlateau = false;
        plateauMsg.classList.add('hidden');
        liftBtn.disabled = false;
        
        plateaus++;
        level++;
        clicks = 0;

        plateausEl.textContent = plateaus;
        levelEl.textContent = level;
        clicksEl.textContent = clicks;

        gameStatus.textContent = `✨ Плато преодолено! Уровень ${level}!`;
        gameStatus.style.color = '#4CAF50';

        showEffect('🎉 ПЛАТО!', '#FFD93D', true);
        showEffect('💪 +100', '#FF6B6B', true);
        createConfetti();
    }

    function failPlateau() {
        clearInterval(plateauInterval);
        inPlateau = false;
        plateauMsg.classList.add('hidden');
        
        clicks = 0;
        clicksEl.textContent = clicks;

        gameStatus.textContent = '💥 Слишком рано! Прогресс сброшен.';
        gameStatus.style.color = '#FF6B6B';

        showEffect('💥 СБРОС!', '#FF6B6B', true);

        const field = document.querySelector('.game-field');
        field.style.animation = 'shake 0.5s';
        setTimeout(() => field.style.animation = '', 500);
    }

    function showEffect(text, color, big = false) {
        const effect = document.createElement('div');
        effect.className = 'effect';
        effect.textContent = text;
        effect.style.color = color;
        effect.style.left = (40 + Math.random() * 20) + '%';
        effect.style.top = (40 + Math.random() * 20) + '%';
        if (big) effect.style.fontSize = '3em';
        effectsLayer.appendChild(effect);
        setTimeout(() => effect.remove(), 1000);
    }

    function createConfetti() {
        const colors = ['#FF6B6B', '#FFD93D', '#4CAF50', '#2196F3', '#FF69B4', '#9C27B0'];
        for (let i = 0; i < 40; i++) {
            const conf = document.createElement('div');
            conf.style.position = 'absolute';
            conf.style.left = Math.random() * 100 + '%';
            conf.style.top = '50%';
            conf.style.width = '10px';
            conf.style.height = '10px';
            conf.style.background = colors[Math.floor(Math.random() * colors.length)];
            conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            conf.style.transition = 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            conf.style.zIndex = '9';
            effectsLayer.appendChild(conf);

            setTimeout(() => {
                conf.style.left = Math.random() * 100 + '%';
                conf.style.top = Math.random() * 100 + '%';
                conf.style.transform = `rotate(${Math.random() * 720}deg)`;
                conf.style.opacity = '0';
            }, 50);

            setTimeout(() => conf.remove(), 1600);
        }
    }

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Анимация появления секций
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.about-card, .character-card, .point').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});