/**
 * Samruddhi Agro Tourism — Cinematic Scroll & Atmospheric Experience
 */
document.addEventListener('DOMContentLoaded', () => {

  const navbar = document.getElementById('main-navbar');
  const heroSection = document.getElementById('hero');
  const heroLayers = document.getElementById('hero-layers');
  const heroTypography = document.getElementById('hero-typography');

  // ===== 1. STICKY NAVBAR SCROLLED STATE =====
  const updateNavbarState = () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('navbar-scrolled');
    } else {
      navbar?.classList.remove('navbar-scrolled');
    }
  };

  window.addEventListener('scroll', updateNavbarState, { passive: true });
  updateNavbarState();

  // ===== 2. CINEMATIC HERO CAMERA PUSH & SCROLL TRANSITION =====
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Typography Fade on Scroll (Hero image remains stable)
    gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6
      }
    })
    .to(heroTypography, {
      y: -60,
      opacity: 0,
      ease: 'power1.out'
    }, 0);

    // Progressive reveal for Activities, Included & Gallery
    const animateElements = document.querySelectorAll(
      '.activity-card, .included-card, .gallery-item'
    );

    animateElements.forEach((el) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 35, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // LOCKED FINAL HOUSE SCENE — Subtle Entrance Animation
    const finalHouseSection = document.getElementById('book');
    if (finalHouseSection) {
      gsap.fromTo(finalHouseSection,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: finalHouseSection,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

  } else {
    // ===== FALLBACK CINEMATIC SCROLL HANDLER =====
    let ticking = false;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = heroSection?.offsetHeight || window.innerHeight;

      if (scrollY <= heroHeight) {
        const progress = Math.min(1, Math.max(0, scrollY / heroHeight));
        
        // Fade & Translate Typography (Hero image remains stable)
        if (heroTypography) {
          heroTypography.style.transform = `translateY(${-progress * 60}px)`;
          heroTypography.style.opacity = `${(1 - progress * 1.5).toFixed(2)}`;
        }
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    }, { passive: true });

    // IntersectionObserver reveal fallback for cards & gallery
    const scrollAnimateElements = document.querySelectorAll(
      '.activity-card, .timeline-item, .included-card, .gallery-item, #book'
    );

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

    scrollAnimateElements.forEach(el => {
      el.classList.add('scroll-animate');
      revealObserver.observe(el);
    });
  }

  // ===== Dynamic Image Filename Caption Sync (Timeline only) =====
  const syncImageCaptionsFromSrc = () => {
    document.querySelectorAll('.overlapping-card, .timeline-card-wrapper').forEach(card => {
      const img = card.querySelector('img');
      const caption = card.querySelector('.img-caption');
      if (img && caption) {
        const srcName = img.getAttribute('src').split('/').pop();
        caption.textContent = srcName.replace(/\.[^/.]+$/, "");
      }
    });
  };

  syncImageCaptionsFromSrc();

});
