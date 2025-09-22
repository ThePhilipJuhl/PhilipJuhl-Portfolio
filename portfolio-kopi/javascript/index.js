

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const navbar = document.getElementById('navbar');
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('section');
  const bgElements = document.querySelectorAll('.fixed > div');

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenuButton.classList.toggle('active');
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        mobileMenu.style.height = '0';
        mobileMenu.classList.remove('open');
      } else if (mobileMenu) {
        mobileMenu.classList.add('open');
        mobileMenu.style.height = `${mobileMenu.scrollHeight}px`;
      }
    });
  }

  if (mobileNavLinks && mobileNavLinks.length) {
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenuButton) mobileMenuButton.classList.remove('active');
        if (mobileMenu) {
          mobileMenu.style.height = '0';
          mobileMenu.classList.remove('open');
        }
      });
    });
  }

  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    
    highlightCurrentSection();
  });

  if (navLinks && navLinks.length) {
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (!targetId || !targetId.startsWith('#')) return;
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 70; 
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          
          targetSection.classList.add('section-highlight');
          setTimeout(() => {
            targetSection.classList.remove('section-highlight');
          }, 1000);
        }
      });
    });
  }

  function highlightCurrentSection() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
    
    mobileNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // Parallax effect for background elements
  /*
  if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      bgElements.forEach(element => {
        const speed = 20; // Adjust for more or less movement
        const xOffset = (x - 0.5) * speed;
        const yOffset = (y - 0.5) * speed;
        
        element.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      });
    });
  }
  */

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
      }
    });
  }, { threshold: 0.1 });
  
  sections.forEach(section => {
    section.classList.add('section-hidden');
    observer.observe(section);
  });

  highlightCurrentSection();
  
  setTimeout(() => {
    const headerText = document.querySelector('.text-6xl');
    if (headerText) {
      headerText.style.opacity = 1;
      headerText.style.transform = 'translateY(0)';
    }
  }, 300);
  
  // Footer year
  const year = document.getElementById('year');
  if (year) { year.textContent = String(new Date().getFullYear()); }

  // Modal slideshow for Shopify project
  const galleryMap = {
    shopify: [
      { src: 'images/ShopifyStore.png', caption: 'My first ever main page' },
      { src: 'images/ShopifyStoreContent.png', caption: 'My first ever produkt page' }
    ],
    portfolio: [
      { src: 'images/PortfolioPage.png', caption: 'Portfolio: main page' },
      { src: 'images/PortfolioPageCode.png', caption: 'Portfolio: code preview' }
    ],
    leagues: [
      { src: 'images/LeaguesTeamPage.png', caption: 'Leagues: team page i created with their design team.' },
      { src: 'images/LeaguesUserEditProfile.png', caption: 'Leagues: user edit profile, created and designed by me for better user handling' },
      { src: 'images/LeaguesUsersWithRoles.png', caption: 'Leagues: users with roles created by me, using newly created backend routes, and if you are owner of the given team, you can edit roles.' },
      { src: 'images/LeaguesCardDesign.png', caption: 'Leagues: card design created with their design team.' }
    ]
  };

  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  const dotsContainer = document.getElementById('modal-dots');
  const overlayEl = document.querySelector('.modal-overlay');
  const prevBtn = document.querySelector('[data-prev]');
  const nextBtn = document.querySelector('[data-next]');
  const closeEls = document.querySelectorAll('[data-close-modal]');
  let currentGallery = [];
  let currentIndex = 0;

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    currentGallery.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i === currentIndex ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  function show() {
    if (!modalImg) return;
    const item = currentGallery[currentIndex];
    modalImg.src = item.src;
    if (overlayEl) overlayEl.textContent = item.caption || '';
    renderDots();
  }

  function openModal(key) {
    const list = galleryMap[key];
    if (!modal || !list || !list.length) return;
    currentGallery = list;
    currentIndex = 0;
    show();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function goTo(index) {
    if (!currentGallery.length) return;
    currentIndex = (index + currentGallery.length) % currentGallery.length;
    show();
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (closeEls && closeEls.length) closeEls.forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (!modal || modal.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // Hook up Demo buttons
  document.querySelectorAll('[data-gallery]')?.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-gallery');
      if (key) openModal(key);
    });
  });

  // Click on project thumbnail opens the same modal as Demo button
  const cards = document.querySelectorAll('.project-grid .card');
  cards.forEach(card => {
    const media = card.querySelector('.card-media');
    const demoBtn = card.querySelector('[data-gallery]');
    if (!media || !demoBtn) return;
    const key = demoBtn.getAttribute('data-gallery');
    media.style.cursor = 'pointer';
    media.addEventListener('click', (e) => {
      e.preventDefault();
      if (key) openModal(key);
    });
  });
});