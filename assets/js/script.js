
document.addEventListener('DOMContentLoaded', () => {

    // --- Floating Slogan Bubbles ---
    const sloganContainer = document.getElementById('slogans-container');
    const heroSection = document.querySelector('.hero');
    if (sloganContainer && heroSection && window.matchMedia("(min-width: 769px)").matches) {
        // ИЗМЕНЕНИЕ: Количество слоганов уменьшено ~на 30% (до 43)
        const slogans = [
            "ты знаешь как вырасти", "ты знаешь важность eNPS", "ты знаешь свой путь", "ты знаешь силу идеи", "ты знаешь силу бренда", 
            "ты знаешь как вдохновлять", "ты знаешь смысл изменений", "ты знаешь свой потенциал", "ты знаешь где твое преимущество",
            "ты знаешь, что создает ценность", "ты знаешь силу команды", "ты знаешь как влиять", "ты знаешь свое влияние", 
            "ты знаешь что цепляет", "ты знаешь как убеждать", "ты знаешь что важно клиентам", "ты знаешь что двигает рынок", 
            "ты знаешь как выделиться", "ты знаешь, что мотивирует", "ты знаешь, что вдохновляет людей", "ты знаешь как управлять вниманием",
            "ты знаешь, что рождает доверие", "ты знаешь, что делает бренд живым", "ты знаешь, как вызвать «вау»", 
            "ты знаешь, что рождает ценность", "ты знаешь, что создает историю", "ты знаешь, где скрыта магия", 
            "ты знаешь, как удержать внимание", "ты знаешь, что объединяет команду", "ты знаешь, что берет за душу",
            "ты знаешь, что создает доверие", "ты знаешь, что делает мир лучше", "ты знаешь, как найти суть",
            "ты знаешь цену момента", "ты знаешь, как удивить", "ты знаешь свой стиль", "ты знаешь, как быть первым",
            "ты знаешь, как создавать тренды", "ты знаешь, что такое забота", "ты знаешь, как быть смелым", "ты знаешь, как быть честным",
            "ты знаешь, как достигать цели"
        ];
        const capitalizedSlogans = slogans.map(s => s.charAt(0).toUpperCase() + s.slice(1));
        
        let bubbles = [];
        let animationFrameId;

        function createBubbles() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            bubbles = [];
            sloganContainer.innerHTML = '';
            
            const bounds = heroSection.getBoundingClientRect();
            const containerRect = sloganContainer.getBoundingClientRect();
            
            if (bounds.width === 0) return;

            const headline = document.getElementById('main-headline');
            const deadZoneRect = headline.getBoundingClientRect();
            
            const deadZone = {
                top: deadZoneRect.top - containerRect.top,
                right: deadZoneRect.right - containerRect.left,
                bottom: deadZoneRect.bottom - containerRect.top,
                left: deadZoneRect.left - containerRect.left,
            };

            capitalizedSlogans.forEach(sloganText => {
                const span = document.createElement('div');
                span.className = 'slogan-bubble';
                span.textContent = sloganText;
                
                const size = 120 + Math.random() * 50;
                const bubble = {
                    element: span, x: 0, y: 0,
                    vx: (Math.random() - 0.5) * 2.0,
                    vy: (Math.random() - 0.5) * 2.0,
                    size: size, radius: size / 2
                };
                
                const containerWidth = sloganContainer.offsetWidth;
                const containerHeight = sloganContainer.offsetHeight;

                do {
                    bubble.x = Math.random() * (containerWidth - size);
                    bubble.y = Math.random() * (containerHeight - size);
                } while (
                    bubble.x + size > deadZone.left - 50 && bubble.x < deadZone.right + 50 &&
                    bubble.y + size > deadZone.top - 50 && bubble.y < deadZone.bottom + 50
                );

                span.style.width = `${size}px`;
                span.style.height = `${size}px`;
                span.style.transform = `translate(${bubble.x}px, ${bubble.y}px)`;
                sloganContainer.appendChild(span);
                bubbles.push(bubble);
            });
            
            animateBubbles();
        }
        
        function animateBubbles() {
            const containerWidth = sloganContainer.offsetWidth;
            const containerHeight = sloganContainer.offsetHeight;

            bubbles.forEach((bubble, i) => {
                bubble.x += bubble.vx;
                bubble.y += bubble.vy;

                if (bubble.x <= 0) { bubble.x = 0; bubble.vx *= -1; }
                if (bubble.x >= containerWidth - bubble.size) { bubble.x = containerWidth - bubble.size; bubble.vx *= -1; }
                if (bubble.y <= 0) { bubble.y = 0; bubble.vy *= -1; }
                if (bubble.y >= containerHeight - bubble.size) { bubble.y = containerHeight - bubble.size; bubble.vy *= -1; }

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

        const observer = new ResizeObserver(entries => {
            if (entries[0].contentRect.width > 0) {
                createBubbles();
                observer.disconnect();
            }
        });
        
        observer.observe(heroSection);
        window.addEventListener('resize', createBubbles); 
    }


    // --- Emoji Cursor Trail ---
    const foodEmojis = ['🍕', '🍔', '🍟', '🍣', '🍩', '🍦', '🍪', '🥑', '🌮', '🍓', '🍉', '🍇', '🍎', '🥕', '🥦', '☕️', '🍹', '🍺', '🍷', '🍰', '🍿', '🥐'];
    let canCreateTrail = true;
    
    document.addEventListener('mousemove', e => {
        if (canCreateTrail) {
            canCreateTrail = false;
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.textContent = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
            trail.style.left = `${e.clientX}px`;
            trail.style.top = `${e.clientY}px`;
            
            document.body.appendChild(trail);

            setTimeout(() => {
                trail.remove();
            }, 1000);

            setTimeout(() => {
                canCreateTrail = true;
            }, 50);
        }
    });

    // --- Burger Menu ---
    const burger = document.getElementById('burger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    const navLinks = mobileNav.querySelectorAll('a');

    if (burger && mobileNav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
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

    // --- Form Submission ---
    const leadForm = document.getElementById('lead-form');
    if (leadForm) {
        leadForm.addEventListener('submit', e => {
            e.preventDefault();
            const submitButton = leadForm.querySelector('button[type="submit"]');
            sendLead(e.target, submitButton);
        });
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
            } else {
                alert('Ошибка отправки. Попробуйте снова позже.');
            }
        } catch (err) {
            console.error("Ошибка отправки формы:", err);
            alert('Произошла ошибка сети. Для демонстрации форма не отправляется.');
            form.reset();
        } finally {
            button.disabled = false;
            button.textContent = originalButtonText;
        }
    };

});
