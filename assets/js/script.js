
document.addEventListener('DOMContentLoaded', () => {

    // --- "Живая Стена Ценностей" ---
    const wallContainer = document.getElementById('slogans-wall');
    if (wallContainer && window.matchMedia("(min-width: 769px)").matches) {
        const slogans = [
            "ты знаешь как вырасти", "ты знаешь важность eNPS", "ты знаешь свой путь", "ты знаешь силу идеи", "ты знаешь силу бренда",
            "ты знаешь как вдохновлять", "ты знаешь смысл изменений", "ты знаешь свой потенциал", "ты знаешь где твое преимущество",
            "ты знаешь, что создает ценность", "ты знаешь силу команды", "ты знаешь как влиять", "ты знаешь свое влияние",
            "ты знаешь что цепляет", "ты знаешь как убеждать", "ты знаешь что важно клиентам", "ты знаешь что двигает рынок",
            "ты знаешь как выделиться", "ты знаешь, что мотивирует", "ты знаешь, что вдохновляет людей", "ты знаешь как управлять вниманием",
            "ты знаешь, что рождает доверие", "ты знаешь, что делает бренд живым", "ты знаешь, как вызвать «вау»",
            "ты знаешь, что рождает ценность", "ты знаешь, что создает историю", "ты знаешь, где скрыта магия",
            "ты знаешь, как удержать внимание", "ты знаешь, что объединяет команду", "ты знаешь, что берет за душу",
            "ты знаешь, что создает доверие", "ты знаешь, что делает мир лучше", "ты знаешь, как оставить наследие",
            "ты знаешь, что заставляет гордиться", "ты знаешь, как изменить мир", "ты знаешь, где лежит истина",
        ];
        
        const numColumns = 6;
        const slogansPerColumn = slogans.length; 

        for (let i = 0; i < numColumns; i++) {
            const column = document.createElement('div');
            column.className = 'slogan-column';
            column.classList.add(i % 2 === 0 ? 'scroll-up' : 'scroll-down');
            
            const contentWrapper = document.createElement('div');
            
            let columnContent = '';
            for (let j = 0; j < slogansPerColumn; j++) {
                columnContent += `<span>${slogans[(i * 3 + j) % slogans.length]}</span>`;
            }
            
            contentWrapper.innerHTML = columnContent + columnContent;
            column.appendChild(contentWrapper);
            wallContainer.appendChild(column);
        }
    }
    
    // --- Mobile Menu Logic ---
    const burger = document.querySelector('.header__burger');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.querySelector('body');

    if (burger && mobileNav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            mobileNav.classList.toggle('open');
            body.classList.toggle('no-scroll');
        });
        
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                mobileNav.classList.remove('open');
                body.classList.remove('no-scroll');
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
                if (modal && modal.style.display === 'flex') modal.style.display = 'none';
            } else {
                alert('Ошибка отправки. Попробуйте снова позже.');
            }
        } catch (err) {
            console.error('Ошибка отправки формы:', err);
            alert('Произошла ошибка сети. Пожалуйста, проверьте ваше подключение или попробуйте позже.');
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
