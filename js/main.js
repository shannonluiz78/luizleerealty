/* ==========================================================================
   LUIZ LEE REALTY - MAIN JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCounters();
  initConsultationForm();
  initModalHandlers();
});

// Mobile Navigation Drawer Toggle
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = navLinks.style.display === 'flex';
      if (isExpanded) {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'rgba(10, 17, 32, 0.98)';
        navLinks.style.padding = '24px';
        navLinks.style.borderBottom = '1px solid rgba(212, 175, 55, 0.2)';
      }
    });
  }
}

// Stats Counter Animation
function initCounters() {
  const counterElements = document.querySelectorAll('.counter');
  let animated = false;

  const animateCounters = () => {
    counterElements.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const speed = 200; // lower = faster

      let count = 0;
      const inc = target / speed;

      const updateCount = () => {
        count += inc;
        if (count < target) {
          counter.innerText = prefix + Math.ceil(count).toLocaleString() + suffix;
          setTimeout(updateCount, 15);
        } else {
          counter.innerText = prefix + target.toLocaleString() + suffix;
        }
      };

      updateCount();
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animateCounters();
        animated = true;
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) observer.observe(statsSection);
}

// WhatsApp Direct Lead Generation Form Handler
function initConsultationForm() {
  const form = document.getElementById('consultation-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const service = document.getElementById('client-service').value;
    const message = document.getElementById('client-message').value.trim();

    const text = `Hello Luiz! My name is ${name} (${phone}). I am interested in ${service}. ${message ? 'Note: ' + message : ''}`;
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/6589809229?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
  });
}

// Modal Handlers (QR Code & Service Details)
function initModalHandlers() {
  const qrModal = document.getElementById('qr-modal');
  const openQrBtn = document.getElementById('btn-open-qr');
  const closeQrBtn = document.getElementById('btn-close-qr');

  if (openQrBtn && qrModal) {
    openQrBtn.addEventListener('click', (e) => {
      e.preventDefault();
      qrModal.style.display = 'flex';
    });
  }

  if (closeQrBtn && qrModal) {
    closeQrBtn.addEventListener('click', () => {
      qrModal.style.display = 'none';
    });
  }

  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) {
        qrModal.style.display = 'none';
      }
    });
  }
}
