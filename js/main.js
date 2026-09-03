/**
 * Physio at Home - physioathome.pk
 * Main JavaScript Interactivity, Mobile Drawer, and Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Mobile Menu Drawer Toggle & Auto-Close on Click
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.remove('hidden');
      mobileMenu.classList.add('flex');
      document.body.classList.add('overflow-hidden');
    });
  }

  function closeMobileDrawer() {
    if (mobileMenu) {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('flex');
      document.body.classList.remove('overflow-hidden');
    }
  }

  if (closeMobileMenuBtn) {
    closeMobileMenuBtn.addEventListener('click', closeMobileDrawer);
  }

  // Auto-close mobile drawer when clicking any link inside it
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileDrawer);
    });

    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        closeMobileDrawer();
      }
    });
  }

  // Modals & Drawers Setup
  const bookingModal = document.getElementById('booking-modal');
  const searchModal = document.getElementById('search-modal');
  const portalModal = document.getElementById('portal-modal');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartBackdrop = document.getElementById('cart-backdrop');

  // Trigger Open Buttons
  document.querySelectorAll('[data-open-modal]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileDrawer(); // close mobile menu if open
      const modalType = button.getAttribute('data-open-modal');
      
      if (modalType === 'booking') {
        openModal(bookingModal);
        const selectedDoctor = button.getAttribute('data-doctor');
        const selectedService = button.getAttribute('data-service');
        const selectedPkg = button.getAttribute('data-package');

        if (selectedDoctor && document.getElementById('modal-doctor-select')) {
          document.getElementById('modal-doctor-select').value = selectedDoctor;
        }
        if (selectedService && document.getElementById('modal-service-select')) {
          document.getElementById('modal-service-select').value = selectedService;
        }
        if (selectedPkg && document.getElementById('modal-package-select')) {
          document.getElementById('modal-package-select').value = selectedPkg;
        }
      } else if (modalType === 'search') {
        openModal(searchModal);
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
      } else if (modalType === 'portal') {
        openModal(portalModal);
      } else if (modalType === 'cart') {
        openCartDrawer();
      }
    });
  });

  // Close buttons
  document.querySelectorAll('[data-close-modal]').forEach(button => {
    button.addEventListener('click', () => {
      closeModal(bookingModal);
      closeModal(searchModal);
      closeModal(portalModal);
      closeCartDrawer();
    });
  });

  // Backdrop clicks
  [bookingModal, searchModal, portalModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  if (cartBackdrop) {
    cartBackdrop.addEventListener('click', closeCartDrawer);
  }

  function openModal(modal) {
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.classList.add('overflow-hidden');
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.classList.remove('overflow-hidden');
    }
  }

  function openCartDrawer() {
    if (cartDrawer && cartBackdrop) {
      cartBackdrop.classList.remove('hidden');
      cartDrawer.classList.remove('translate-x-full');
      document.body.classList.add('overflow-hidden');
    }
  }

  function closeCartDrawer() {
    if (cartDrawer && cartBackdrop) {
      cartBackdrop.classList.add('hidden');
      cartDrawer.classList.add('translate-x-full');
      document.body.classList.remove('overflow-hidden');
    }
  }

  // Booking Form Submission & WhatsApp Trigger
  const bookingForm = document.getElementById('physio-booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const patientName = document.getElementById('patient-name')?.value || '';
      const patientPhone = document.getElementById('patient-phone')?.value || '';
      const selectedArea = document.getElementById('patient-area')?.value || 'Lahore';
      const serviceType = document.getElementById('modal-service-select')?.value || 'General Consultation';
      const genderPref = document.querySelector('input[name="gender-pref"]:checked')?.value || 'Any';
      const preferredDoctor = document.getElementById('modal-doctor-select')?.value || 'First Available Specialist';
      const appointmentDate = document.getElementById('appointment-date')?.value || 'As soon as possible';

      const successMessage = document.getElementById('booking-success');
      const formFields = document.getElementById('booking-form-fields');
      if (successMessage && formFields) {
        formFields.classList.add('hidden');
        successMessage.classList.remove('hidden');
      }

      // Format WhatsApp Message
      const waText = encodeURIComponent(
        `Hello Physio at Home team! I would like to book a Home Visit session.\n\n` +
        `👤 Patient Name: ${patientName}\n` +
        `📞 Phone: ${patientPhone}\n` +
        `📍 Location in Lahore: ${selectedArea}\n` +
        `🩺 Required Service: ${serviceType}\n` +
        `👩‍⚕️ Therapist Gender Preference: ${genderPref}\n` +
        `👨‍⚕️ Preferred Doctor: ${preferredDoctor}\n` +
        `📅 Preferred Date/Time: ${appointmentDate}\n\n` +
        `Please confirm my home visit schedule.`
      );

      const waBtn = document.getElementById('whatsapp-confirm-link');
      if (waBtn) {
        waBtn.href = `https://wa.me/923340043512?text=${waText}`;
      }
    });
  }

  // Accordions (FAQs)
  const accordionItems = document.querySelectorAll('.accordion-header');
  accordionItems.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.accordion-icon');
      
      const isOpen = !content.classList.contains('hidden');

      document.querySelectorAll('.accordion-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.accordion-icon').forEach(i => {
        if (i) i.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // Cart Management State
  let cartItems = [
    { id: 'pkg-pain-5', name: '5-Session Pain Relief Pack', price: 15000, quantity: 1 }
  ];

  function updateCartUI() {
    const cartList = document.getElementById('cart-items-list');
    const cartCount = document.getElementById('cart-count');
    const cartSubtotal = document.getElementById('cart-subtotal');

    if (cartCount) cartCount.textContent = cartItems.reduce((acc, item) => acc + item.quantity, 0).toString();

    if (cartList) {
      if (cartItems.length === 0) {
        cartList.innerHTML = `<div class="text-center py-8 text-slate-500 text-xs">Your care cart is currently empty.</div>`;
      } else {
        cartList.innerHTML = cartItems.map((item, index) => `
          <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div class="space-y-1">
              <div class="font-semibold text-slate-900 text-xs">${item.name}</div>
              <div class="text-xs text-emerald-600 font-bold">PKR ${item.price.toLocaleString()}</div>
            </div>
            <button onclick="removeCartItem(${index})" class="p-1.5 text-slate-400 hover:text-red-500 rounded transition-colors" title="Remove item">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        `).join('');
        if (window.lucide) window.lucide.createIcons();
      }
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartSubtotal) cartSubtotal.textContent = `PKR ${subtotal.toLocaleString()}`;
  }

  window.removeCartItem = function(index) {
    cartItems.splice(index, 1);
    updateCartUI();
  };

  window.addToCart = function(id, name, price) {
    const existing = cartItems.find(item => item.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cartItems.push({ id, name, price, quantity: 1 });
    }
    updateCartUI();
    openCartDrawer();
  };

  updateCartUI();

  // Search Filter Handler
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  if (searchInput && searchResults) {
    const searchableItems = [
      { title: 'Dr. Hina Asif PT - Co-Founder & Women\'s Health', category: 'Doctor', link: 'about.html' },
      { title: 'Dr. Reeba PT - Pediatric & Postnatal Care', category: 'Doctor', link: 'about.html' },
      { title: 'Dr. Amina Amir PT - Pain Specialist', category: 'Doctor', link: 'about.html' },
      { title: 'Dr. Usama PT - Sports & Orthopedic', category: 'Doctor', link: 'about.html' },
      { title: 'Dr. Nazar Rasool PT - Post-Op Rehab', category: 'Doctor', link: 'about.html' },
      { title: 'Dr. Maryam PT - Female Home Visit', category: 'Doctor', link: 'about.html' },
      { title: 'Pain Management Physiotherapy', category: 'Service', link: 'services.html' },
      { title: 'Post-Surgery Rehabilitation', category: 'Service', link: 'services.html' },
      { title: 'Women\'s Physiotherapy', category: 'Service', link: 'services.html' },
      { title: 'Pediatric Physiotherapy', category: 'Service', link: 'services.html' },
      { title: 'Neurological Rehabilitation', category: 'Service', link: 'services.html' },
      { title: 'Online Video Consultation', category: 'Service', link: 'services.html' },
      { title: 'DHA Lahore Home Visit', category: 'Location', link: 'book-appointment.html' },
      { title: 'Johar Town Home Visit', category: 'Location', link: 'book-appointment.html' },
      { title: 'Gulberg & Model Town Home Visit', category: 'Location', link: 'book-appointment.html' },
      { title: 'Bahria Town Home Visit', category: 'Location', link: 'book-appointment.html' }
    ];

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!query) {
        searchResults.innerHTML = `<div class="text-xs text-slate-400 p-4 text-center">Type a doctor name, service, or area in Lahore to search...</div>`;
        return;
      }

      const matches = searchableItems.filter(item => 
        item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)
      );

      if (matches.length === 0) {
        searchResults.innerHTML = `<div class="text-xs text-slate-500 p-4 text-center">No matching services or therapists found for "${query}".</div>`;
      } else {
        searchResults.innerHTML = matches.map(item => `
          <a href="${item.link}" class="block p-3 hover:bg-slate-50 rounded-xl transition-colors border-b border-slate-100 last:border-0">
            <div class="flex items-center justify-between">
              <div class="text-xs font-semibold text-slate-800">${item.title}</div>
              <span class="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">${item.category}</span>
            </div>
          </a>
        `).join('');
      }
    });
  }
});
