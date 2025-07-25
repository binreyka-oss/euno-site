
document.addEventListener('DOMContentLoaded', () => {

    // --- Floating Slogan Bubbles ---
    const slogans = [
        "ты знаешь как вырасти", "ты знаешь важность eNPS", "ты знаешь свой путь", "ты знаешь силу идеи", 
        "ты знаешь силу бренда", "ты знаешь как вдохновлять", "ты знаешь смысл изменений", "ты знаешь свой потенциал",
        "ты знаешь где твое преимущество", "ты знаешь, что создает ценность", "ты знаешь силу команды", "ты знаешь как влиять",
        "ты знаешь свое влияние", "ты знаешь что цепляет", "ты знаешь как убеждать", "ты знаешь что важно клиентам"
    ];
    const sloganContainer = document.getElementById('slogans-container');
    const colors = ['rgba(51, 87, 255, 0.8)', 'rgba(51, 255, 161, 0.8)', 'rgba(229, 29, 69, 0.8)']; // Blue, Green, Red
    const bubbles = [];

    if (sloganContainer) {
        const headline = document.getElementById('main-headline');
        const deadZone = headline.getBoundingClientRect();

        slogans.forEach(sloganText => {
            const span = document.createElement('div');
            span.className = 'slogan-bubble';
            span.textContent = sloganText;
            
            const bubble = {
                element: span,
                x: 0,
                y: 0,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: 150 + Math.random() * 100
            };
            
            // Set initial position outside the dead zone
            do {
                bubble.x = Math.random() * sloganContainer.offsetWidth;
                bubble.y = Math.random() * sloganContainer.offsetHeight;
            } while (
                bubble.x > deadZone.left - bubble.size &&
                bubble.x < deadZone.right &&
                bubble.y > deadZone.top - bubble.size &&
                bubble.y < deadZone.bottom
            );

            span.style.width = `${bubble.size}px`;
            span.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            span.style.color = 'white';

            sloganContainer.appendChild(span);
            bubbles.push(bubble);
        });

        function animateBubbles() {
            bubbles.forEach(bubble => {
                bubble.x += bubble.vx;
                bubble.y += bubble.vy;

                // Bounce off walls
                if (bubble.x < 0 || bubble.x > sloganContainer.offsetWidth - bubble.size) {
                    bubble.vx *= -1;
                }
                if (bubble.y < 0 || bubble.y > sloganContainer.offsetHeight - bubble.size) {
                    bubble.vy *= -1;
                }

                bubble.element.style.transform = `translate(${bubble.x}px, ${bubble.y}px)`;
            });
            requestAnimationFrame(animateBubbles);
        }
        animateBubbles();
    }


    // --- Cursor Trail ---
    const cursorArea = document.querySelector('.custom-cursor-area');
    if (cursorArea) {
        const foodIcons = ['🍎', '🍞', '🥕', '🍇', '🍌', '🍕', '🍔'];
        
        window.addEventListener('mousemove', e => {
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
                }, 600);
            }, 10);
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
                
                const progress = parseInt(phase) * 20;
                progressBarFill.style.width = `${progress}%`;
            });
        });
    }

    // --- Modal Logic ---
    const modal = document.getElementById('modal');
    if (modal) {
        const openModalButtons = document.querySelectorAll('[data-open-modal]');
        const closeModalButtons = document.querySelectorAll('[data-close-modal]');

        openModalButtons.forEach(button => {
            button.addEventListener('click', () => modal.style.display = 'flex');
        });
        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => modal.style.display = 'none');
        });
        window.addEventListener('click', event => {
            if (event.target === modal) modal.style.display = 'none';
        });
    }

    // --- Submit forms -> Telegram ---
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
