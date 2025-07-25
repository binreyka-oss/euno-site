
document.addEventListener('DOMContentLoaded', () => {

    // --- Floating Slogan Bubbles ---
    const sloganContainer = document.getElementById('slogans-container');
    if (sloganContainer && window.matchMedia("(min-width: 769px)").matches) {
        const slogans = [
            "ты знаешь как вырасти", "ты знаешь важность eNPS", "ты знаешь свой путь", "ты знаешь силу идеи", 
            "ты знаешь силу бренда", "ты знаешь как вдохновлять", "ты знаешь смысл изменений", "ты знаешь свой потенциал", 
            "ты знаешь где твое преимущество", "ты знаешь, что создает ценность", "ты знаешь силу команды", "ты знаешь как влиять",
            "ты знаешь свое влияние", "ты знаешь что цепляет", "ты знаешь как убеждать", "ты знаешь что важно клиентам", 
            "ты знаешь что двигает рынок", "ты знаешь как выделиться", "ты знаешь, что мотивирует", "ты знаешь, что вдохновляет людей", 
            "ты знаешь как управлять вниманием", "ты знаешь, что рождает доверие", "ты знаешь, что делает бренд живым", "ты знаешь, как вызвать «вау»", 
            "ты знаешь, что рождает ценность", "ты знаешь, что создает историю", "ты знаешь, где скрыта магия", 
            "ты знаешь, как удержать внимание", "ты знаешь, что объединяет команду", "ты знаешь, что берет за душу",
            "ты знаешь, что создает доверие", "ты знаешь, что делает мир лучше"
        ];
        let bubbles = [];
        let animationFrameId;

        function createBubbles() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            bubbles = [];
            sloganContainer.innerHTML = '';
            const bounds = sloganContainer.getBoundingClientRect();
            if (bounds.width === 0 || bounds.height === 0) return;

            const headline = document.getElementById('main-headline');
            const deadZoneRect = headline.getBoundingClientRect();
            const deadZone = {
                top: deadZoneRect.top - bounds.top - 50,
                right: deadZoneRect.right - bounds.left + 50,
                bottom: deadZoneRect.bottom - bounds.top + 50,
                left: deadZoneRect.left - bounds.left - 50,
            };

            slogans.forEach(sloganText => {
                const span = document.createElement('div');
                span.className = 'slogan-bubble';
                span.textContent = sloganText;
                
                const size = 130 + Math.random() * 50;
                const bubble = {
                    element: span,
                    x: 0,
                    y: 0,
                    vx: (Math.random() - 0.5) * 1.0, // Increased speed
                    vy: (Math.random() - 0.5) * 1.0, // Increased speed
                    size: size,
                    radius: size / 2
                };
                
                do {
                    bubble.x = Math.random() * (bounds.width - size);
                    bubble.y = Math.random() * (bounds.height - size);
                } while (
                    bubble.x + size > deadZone.left && bubble.x < deadZone.right &&
                    bubble.y + size > deadZone.top && bubble.y < deadZone.bottom
                );

                span.style.width = `${size}px`;
                span.style.height = `${size}px`;
                sloganContainer.appendChild(span);
                bubbles.push(bubble);
            });
            animateBubbles();
        }
        
        function animateBubbles() {
            const bounds = sloganContainer.getBoundingClientRect();
            bubbles.forEach((bubble, i) => {
                bubble.x += bubble.vx;
                bubble.y += bubble.vy;

                if (bubble.x <= 0) { bubble.x = 0; bubble.vx *= -1; }
                if (bubble.x >= bounds.width - bubble.size) { bubble.x = bounds.width - bubble.size; bubble.vx *= -1; }
                if (bubble.y <= 0) { bubble.y = 0; bubble.vy *= -1; }
                if (bubble.y >= bounds.height - bubble.size) { bubble.y = bounds.height - bubble.size; bubble.vy *= -1; }

                for (let j = i + 1; j < bubbles.length; j++) {
                    const otherBubble = bubbles[j];
                    const dx = (otherBubble.x + otherBubble.radius) - (bubble.x + bubble.radius);
                    const dy = (otherBubble.y + otherBubble.radius) - (bubble.y + bubble.radius);
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const minDistance = bubble.radius + otherBubble.radius;

                    if (distance < minDistance) {
                        const angle = Math.atan2(dy, dx);
                        const overlap = (minDistance - distance) / 2;
                        bubble.x -= overlap * Math.cos(angle);
                        bubble.y -= overlap * Math.sin(angle);
                        otherBubble.x += overlap * Math.cos(angle);
                        otherBubble.y += overlap * Math.sin(angle);
                        
                        const tempVx = bubble.vx;
                        const tempVy = bubble.vy;
                        bubble.vx = otherBubble.vx;
                        bubble.vy = otherBubble.vy;
                        otherBubble.vx = tempVx;
                        otherBubble.vy = tempVy;
                    }
                }
                bubble.element.style.transform = `translate(${bubble.x}px, ${bubble.y}px)`;
            });
            animationFrameId = requestAnimationFrame(animateBubbles);
        }

        window.addEventListener('load', createBubbles);
        window.addEventListener('resize', createBubbles); 
    }

    // --- Cursor Trail ---
    const cursorArea = document.querySelector('.custom-cursor-area');
    if (cursorArea && window.matchMedia("(min-width: 769px)").matches) {
        const foodIcons = ['🍎', '🍞', '🥕', '🍇', '🍌', '🍕', '🍔', '🍣', '🌭', '🌮', '🍟', '🍲', '🦐', '🍩', '🍰', '🥗', '🥪', '🥞'];
        let moveCounter = 0;
        
        window.addEventListener('mousemove', e => {
            moveCounter++;
            if (moveCounter % 4 === 0) {
                const trail = document.createElement('div');
                trail.className = 'cursor-trail';
                trail.innerHTML = foodIcons[Math.floor(Math.random() * foodIcons.length)];
                document.body.appendChild(trail);
                trail.style.left = `${e.clientX}px`;
                trail.style.top = `${e.clientY}px`;
                
                const startRotation = Math.random() * 90 - 45;
                const endRotation = startRotation + Math.random() * 60 - 30;
                trail.style.transform = `translate(-50%, -50%) rotate(${startRotation}deg) scale(1)`;

                setTimeout(() => {
                    trail.style.opacity = '0';
                    trail.style.transform = `translate(-50%, -50%) rotate(${endRotation}deg) scale(0)`;
                    setTimeout(() => {
                        trail.remove();
                    }, 1200);
                }, 100); 
            }
        });
    }

    // --- Interactive Process Tabs ---
    const tabs = document.querySelectorAll('.process-tab');
    const contents = document.querySelectorAll('.process-content');
    const progressBarFill = document.getElementById('progressBarFill');

    if (tabs.length > 0 && contents.length > 0 && progressBarFill) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const phase = tab.dataset.phase;
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                contents.forEach(c => c.classList.remove('active'));
                document.querySelector(`.process-content[data-phase="${phase}"]`).classList.add('active');
                progressBarFill.style.width = `${parseInt(phase) * 20}%`;
            });
        });
    }

    // --- Modal Logic & Form Submission ---
    const modal = document.getElementById('modal');
    if (modal) {
        const openModalButtons = document.querySelectorAll('[data-open-modal]');
        const closeModalButtons = document.querySelectorAll('[data-close-modal]');
        openModalButtons.forEach(button => button.addEventListener('click', () => modal.style.display = 'flex'));
        closeModalButtons.forEach(button => button.addEventListener('click', () => modal.style.display = 'none'));
        window.addEventListener('click', event => { if (event.target === modal) modal.style.display = 'none'; });
    }
    
    const sendLead = async (form, button) => {
        const formData = Object.fromEntries(new FormData(form).entries());
        if (!formData.consent) {
            alert('Для отправки необходимо ваше согласие на обработку персональных данных.');
            return;
        }
        const originalButtonText = button.textContent;
        button.disabled = true;
        button.textContent = 'Отправка...';
        try {
            const res = await fetch('/api/lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                alert('Спасибо! Мы скоро свяжемся с вами.');
                form.reset();
                if (modal) modal.style.display = 'none';
            } else {
                alert('Ошибка отправки. Попробуйте снова позже.');
            }
        } catch (err) {
            alert('Произошла ошибка сети.');
        } finally {
            button.disabled = false;
            button.textContent = originalButtonText;
        }
    };
    
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            sendLead(e.target, submitButton);
        });
    });

});
