/**
 * Transparent White Cloud Scroll Transition & About Platform Reveal
 *
 * PHASE 1: Mountain Hero stays fixed and stable.
 * PHASE 2: Transparent white cloud enters from TOP (moving downward).
 * PHASE 3: Cloud progressively covers the mountain while SIMULTANEOUSLY SCALING/ZOOMING UP (scale 1.0 -> 3.5).
 * PHASE 4: Cloud fills entire viewport, creating a 100% pure white (#FFFFFF) screen platform.
 * PHASE 5: Pinned on the white platform, About & Stay content appears sequentially ONE BY ONE:
 *          1. Section Header ("ABOUT & STAY")
 *          2. First description paragraph
 *          3. Second description paragraph
 *          4. Kaas Plateau cards & label
 *          5. Vasota Trekking cards & label
 *          6. Venna Waterfall cards & label
 * PHASE 6: Background smoothly transitions to Black (#000000) with adapted text colors.
 * PHASE 7: Unpins cleanly, normal scrolling continues into What's Included, Gallery, Booking, and Footer.
 */
document.addEventListener('DOMContentLoaded', () => {
  const cloudOverlay = document.getElementById('cloud-overlay');
  const cloudZoomWrapper = document.getElementById('cloud-zoom-wrapper');
  const aboutSection = document.getElementById('about');

  if (!cloudOverlay || !aboutSection) return;

  // Require GSAP + ScrollTrigger (already loaded in the project)
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Exact individual elements of About & Stay for the one-by-one reveal
  const elHeading = aboutSection.querySelector('.section-divider');
  const elPara1 = aboutSection.querySelector('.about-paragraph:not(.second)');
  const elPara2 = aboutSection.querySelector('.about-paragraph.second');
  const elTimeline1 = document.getElementById('timeline-kaas');
  const elTimeline2 = document.getElementById('timeline-vasota');
  const elTimeline3 = document.getElementById('timeline-venna');

  const animatedElements = [elHeading, elPara1, elPara2, elTimeline1, elTimeline2, elTimeline3].filter(Boolean);

  // Set initial states
  gsap.set(cloudOverlay, { autoAlpha: 1, y: '-100vh' });
  if (cloudZoomWrapper) {
    gsap.set(cloudZoomWrapper, { scale: 1.0 });
  }
  gsap.set(animatedElements, { opacity: 0, y: 16 });
  gsap.set(aboutSection, { backgroundColor: '#FFFFFF' });

  // ===== 1. CLOUD DESCENT + ZOOM (Hero -> About) =====
  // Cloud moves from top downward across the mountain while simultaneously expanding/zooming
  const cloudTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      endTrigger: '#about',
      end: 'top top',
      scrub: 0.5,
      invalidateOnRefresh: true,
      onLeave: () => {
        gsap.set(cloudOverlay, { autoAlpha: 0 });
      },
      onEnterBack: () => {
        gsap.set(cloudOverlay, { autoAlpha: 1 });
      },
      onUpdate: (self) => {
        if (self.progress < 1) {
          gsap.set(cloudOverlay, { autoAlpha: 1 });
        }
      }
    }
  });

  // Cloud moves down from top across mountain
  cloudTimeline.to(cloudOverlay, {
    y: '50vh',
    ease: 'none',
    duration: 1
  }, 0);

  // Cloud zooms and expands outward to fill the entire viewport with pure white
  if (cloudZoomWrapper) {
    cloudTimeline.to(cloudZoomWrapper, {
      scale: 3.5,
      ease: 'power1.in',
      duration: 1
    }, 0);
  }

  // ===== 2. ABOUT PINNED PLATFORM: ONE-BY-ONE REVEAL -> DARKEN TO BLACK =====
  const aboutTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: aboutSection,
      start: 'top top',
      end: '+=1600',
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
    }
  });

  // 1. "ABOUT & STAY" heading appears (0.00 to 0.12)
  if (elHeading) {
    aboutTimeline.to(elHeading, {
      opacity: 1,
      y: 0,
      ease: 'power1.out',
      duration: 0.12
    }, 0.00);
  }

  // 2. First description paragraph appears (0.08 to 0.20)
  if (elPara1) {
    aboutTimeline.to(elPara1, {
      opacity: 1,
      y: 0,
      ease: 'power1.out',
      duration: 0.12
    }, 0.08);
  }

  // 3. Second description paragraph appears (0.16 to 0.28)
  if (elPara2) {
    aboutTimeline.to(elPara2, {
      opacity: 1,
      y: 0,
      ease: 'power1.out',
      duration: 0.12
    }, 0.16);
  }

  // 4. Kaas Plateau timeline item appears (0.24 to 0.38)
  if (elTimeline1) {
    aboutTimeline.to(elTimeline1, {
      opacity: 1,
      y: 0,
      ease: 'power1.out',
      duration: 0.14
    }, 0.24);
  }

  // 5. Vasota Trekking timeline item appears (0.34 to 0.48)
  if (elTimeline2) {
    aboutTimeline.to(elTimeline2, {
      opacity: 1,
      y: 0,
      ease: 'power1.out',
      duration: 0.14
    }, 0.34);
  }

  // 6. Venna Waterfall timeline item appears (0.44 to 0.58)
  if (elTimeline3) {
    aboutTimeline.to(elTimeline3, {
      opacity: 1,
      y: 0,
      ease: 'power1.out',
      duration: 0.14
    }, 0.44);
  }

  // 7. Smooth transition to Black (#FFFFFF -> #000000) (0.65 to 1.00)
  aboutTimeline.to(aboutSection, {
    backgroundColor: '#000000',
    ease: 'power1.inOut',
    duration: 0.35
  }, 0.65);

  // Adapt text colors during dark transition
  aboutTimeline.to('#about .section-divider h2', {
    color: '#f0f4f1',
    ease: 'power1.inOut',
    duration: 0.35
  }, 0.65);

  aboutTimeline.to('#about .about-paragraph', {
    color: '#a3b899',
    ease: 'power1.inOut',
    duration: 0.35
  }, 0.65);

  aboutTimeline.to('#about .timeline-label', {
    color: '#f0f4f1',
    ease: 'power1.inOut',
    duration: 0.35
  }, 0.65);

  const timelineDots = aboutSection.querySelectorAll('.timeline-dot');
  if (timelineDots.length) {
    aboutTimeline.to(timelineDots, {
      backgroundColor: '#f0f4f1',
      borderColor: '#0a0e0b',
      ease: 'power1.inOut',
      duration: 0.35
    }, 0.65);
  }

  const timelineLine = aboutSection.querySelector('.timeline-line');
  if (timelineLine) {
    aboutTimeline.to(timelineLine, {
      backgroundColor: 'rgba(163, 184, 153, 0.3)',
      ease: 'power1.inOut',
      duration: 0.35
    }, 0.65);
  }

  const aboutCards = aboutSection.querySelectorAll('.overlapping-card, .timeline-card-wrapper');
  if (aboutCards.length) {
    aboutTimeline.to(aboutCards, {
      borderColor: 'rgba(255, 255, 255, 0.1)',
      ease: 'power1.inOut',
      duration: 0.35
    }, 0.65);
  }
});
