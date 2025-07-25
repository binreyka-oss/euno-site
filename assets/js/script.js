
document.addEventListener('DOMContentLoaded', () => {

    // --- FADE-IN ON SCROLL ---
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };
    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });


    // --- CURSOR TRAIL (from previous version) ---
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

    // --- INTERACTIVE PROCESS TABS ---
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

    // --- MODAL LOGIC & FORM SUBMISSION ---
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
