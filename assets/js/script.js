
// Fade-in on scroll
const faders = document.querySelectorAll('.fade-in');
const appearOptions = {
  threshold: 0.2,
};
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, appearOptions);
faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

// Accordion
document.querySelectorAll('.accordion-header').forEach(button => {
  button.addEventListener('click', () => {
    const accordionItem = button.parentElement;
    const wasActive = accordionItem.classList.contains('active');
    
    // Optional: Close all other items
    // document.querySelectorAll('.accordion-item').forEach(item => {
    //   item.classList.remove('active');
    // });

    if (!wasActive) {
      accordionItem.classList.add('active');
    } else {
        accordionItem.classList.remove('active');
    }
  });
});

// Metric counter
const counters = document.querySelectorAll('.count');
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset.count;
      let current = 0;
      const increment = target / 100;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          el.textContent = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target;
        }
      };
      updateCounter();
      observer.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(counter => {
  counterObserver.observe(counter);
});

// Modal Logic
const modal = document.getElementById('modal');
const openModalButtons = document.querySelectorAll('[data-open-modal]');
const closeModalButtons = document.querySelectorAll('[data-close-modal]');

openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    modal.style.display = 'flex';
  });
});

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    modal.style.display = 'none';
  });
});

window.addEventListener('click', event => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});


// Active Nav Link on Scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.topbar-nav a');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href').substring(1) === entry.target.id);
            });
        }
    });
}, { rootMargin: '-30% 0px -70% 0px' }); // Активируется, когда секция в средней части экрана

sections.forEach(section => {
    navObserver.observe(section);
});


// Submit forms -> Telegram
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
      const errorData = await res.json();
      alert(`Ошибка отправки: ${errorData.error || 'Попробуйте снова позже.'}`);
    }
  } catch (err) {
    console.error(err);
    alert('Произошла ошибка сети. Пожалуйста, проверьте ваше подключение.');
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
