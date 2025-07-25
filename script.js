
// Fade-in on scroll
const faders = document.querySelectorAll('.fade-in');
const appear = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:0.2});
faders.forEach(el => appear.observe(el));

// Accordion
document.querySelectorAll('.accordion-header').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const item = btn.parentElement;
    item.classList.toggle('active');
  });
});

// Metric counter
const counters = document.querySelectorAll('.count');
const counterObserver = new IntersectionObserver((entries, observer)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const el = entry.target;
      const target = +el.dataset.count;
      let current = 0;
      const increment = target / 100;
      const update = ()=>{
        current += increment;
        if(current < target){
          el.textContent = Math.round(current);
          requestAnimationFrame(update);
        } else{
          el.textContent = target;
        }
      };
      update();
      observer.unobserve(el);
    }
  });
},{threshold:0.5});
counters.forEach(c=>counterObserver.observe(c));

// Modal
const modal = document.getElementById('modal');
document.querySelectorAll('[data-open-modal]').forEach(btn=>{
  btn.addEventListener('click', ()=> modal.style.display = 'flex');
});
document.querySelectorAll('[data-close-modal]').forEach(btn=>{
  btn.addEventListener('click', ()=> modal.style.display = 'none');
});
window.addEventListener('click', e=>{
  if(e.target === modal) modal.style.display = 'none';
});

// Submit forms -> Telegram
const sendLead = async (form) =>{
  const formData = Object.fromEntries(new FormData(form).entries());
  if(!formData.consent) { alert('Требуется согласие.'); return;}
  try{
    const res = await fetch('/api/lead', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(formData)
    });
    if(res.ok){
      alert('Спасибо! Мы свяжемся с вами.');
      form.reset();
    }else{
      alert('Ошибка отправки. Попробуйте позже.');
    }
  }catch(err){
    alert('Ошибка сети.');
  }
};
document.getElementById('lead-form').addEventListener('submit', e=>{
  e.preventDefault();
  sendLead(e.target);
});
document.getElementById('lead-form-modal').addEventListener('submit', e=>{
  e.preventDefault();
  sendLead(e.target);
});
