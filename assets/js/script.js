
document.addEventListener('DOMContentLoaded', () => {

    // --- Chaotic Slogans on Hero ---
    const slogans = [
        "ты знаешь как вырасти", "ты знаешь важность eNPS", "ты знаешь свой путь", "ты знаешь силу идеи", 
        "ты знаешь силу бренда", "ты знаешь как вдохновлять", "ты знаешь смысл изменений", "ты знаешь свой потенциал",
        "ты знаешь где твое преимущество", "ты знаешь, что создает ценность", "ты знаешь силу команды", "ты знаешь как влиять",
        "ты знаешь свое влияние", "ты знаешь что цепляет", "ты знаешь как убеждать", "ты знаешь что важно клиентам",
        "ты знаешь что двигает рынок", "ты знаешь как выделиться", "ты знаешь, что мотивирует", "ты знаешь, что вдохновляет людей",
        "ты знаешь как управлять вниманием", "ты знаешь, что рождает доверие", "ты знаешь, что делает бренд живым", 
        "ты знаешь, как вызвать «вау»", "ты знаешь, что рождает ценность", "ты знаешь, что создает историю",
        "ты знаешь, где скрыта магия", "ты знаешь, как удержать внимание", "ты знаешь, что объединяет команду", 
        "ты знаешь, что берет за душу", "ты знаешь, что создает доверие", "ты знаешь, что делает мир лучше", 
        "ты знаешь, как оставить наследие", "ты знаешь, что заставляет гордиться", "ты знаешь, как изменить мир",
        "ты знаешь, где лежит истина", "ты знаешь, как найти путь", "ты знаешь, что движет прогрессом"
    ];
    const sloganContainer = document.getElementById('slogans-container');
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1'];

    if (sloganContainer) {
        slogans.forEach(sloganText => {
            const span = document.createElement('span');
            span.className = 'slogan-item';
            span.textContent = sloganText;
            
            // Random position
            span.style.top = `${Math.random() * 100}%`;
            span.style.left = `${Math.random() * 100}%`;
            
            // Random color
            span.style.color = colors[Math.floor(Math.random() * colors.length)];
            
            // Random font size
            span.style.fontSize = `${1 + Math.random() * 1.5}rem`;

            sloganContainer.appendChild(span);
        });
    }

    // --- Cursor Trail ---
    const cursorArea = document.querySelector('.custom-cursor-area');
    if (cursorArea) {
        let trailCount = 0;
        const maxTrails = 20;

        window.addEventListener('mousemove', e => {
            if (trailCount < maxTrails) {
                const trail = document.createElement('div');
                trail.className = 'cursor-trail';
                document.body.appendChild(trail);
                trailCount++;

                trail.style.left = `${e.clientX}px`;
                trail.style.top = `${e.clientY}px`;
                trail.style.background = colors[Math.floor(Math.random() * colors.length)];
                
                setTimeout(() => {
                    trail.style.opacity = '0';
                    trail.style.transform = 'translate(-50%, -50%) scale(0.5)';
                    setTimeout(() => {
                        trail.remove();
                        trailCount--;
                    }, 500);
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
