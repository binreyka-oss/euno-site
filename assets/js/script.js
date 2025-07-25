
document.addEventListener('DOMContentLoaded', () => {

    // --- Ticker Slogan Animation ---
    const sloganContainer = document.getElementById('slogans-container');
    if (sloganContainer && window.matchMedia("(min-width: 769px)").matches) {
        const slogans = [
            "ты знаешь как вырасти", "ты знаешь важность eNPS", "ты знаешь свой путь", "ты знаешь силу идеи", "ты знаешь силу бренда", 
            "ты знаешь как вдохновлять", "ты знаешь смысл изменений", "ты знаешь свой потенциал", "ты знаешь где твое преимущество",
            "ты знаешь, что создает ценность", "ты знаешь силу команды", "ты знаешь как влиять", "ты знаешь свое влияние", 
            "ты знаешь что цепляет", "ты знаешь как убеждать", "ты знаешь что важно клиентам", "ты знаешь что двигает рынок", 
            "ты знаешь как выделиться", "ты знаешь, что мотивирует", "ты знаешь, что вдохновляет людей", "ты знаешь как управлять вниманием",
            "ты знаешь, что рождает доверие", "ты знаешь, что делает бренд живым", "ты знаешь, как вызвать «вау»", 
            "ты знаешь, что рождает ценность", "ты знаешь, что создает историю", "ты знаешь, где скрыта магия", 
            "ты знаешь, как удержать внимание", "ты знаешь, что объединяет команду", "ты знаешь, что берет за душу",
            "ты знаешь, что создает доверие", "ты знаешь, что делает мир лучше"
        ];
        
        const numColumns = 7;
        for (let i = 0; i < numColumns; i++) {
            const column = document.createElement('div');
            column.className = 'slogan-column';
            
            // Shuffle and slice slogans for variety in each column
            const shuffledSlogans = [...slogans].sort(() => 0.5 - Math.random());
            const columnSlogans = shuffledSlogans.slice(0, 15);

            // Duplicate slogans for infinite scroll effect
            const columnContent = [...columnSlogans, ...columnSlogans];
            
            columnContent.forEach(text => {
                const span = document.createElement('span');
                span.textContent = text;
                column.appendChild(span);
            });
            sloganContainer.appendChild(column);
        }
    }


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
            alert('Произошла ошибка сети.');
        } finally {
            button.disabled = false;
            button.textContent = originalButtonText;
        }
    };

});
