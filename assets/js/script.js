
document.addEventListener('DOMContentLoaded', () => {

    // --- Interactive Process Tabs ---
    const tabs = document.querySelectorAll('.process-tab');
    const contents = document.querySelectorAll('.process-content');
    const progressBarFill = document.getElementById('progressBarFill');

    if (tabs.length > 0 && contents.length > 0 && progressBarFill) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const phase = tab.dataset.phase;

                // Update tabs
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update content
                contents.forEach(c => c.classList.remove('active'));
                document.querySelector(`.process-content[data-phase="${phase}"]`).classList.add('active');
                
                // Update progress bar
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
