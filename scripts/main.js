// --------------- GSAP ---------------
gsap.registerPlugin(ScrollTrigger);

gsap.config({
  nullTargetWarn: false,
  trialWarn: false,
});

let mm = gsap.matchMedia();

// --------------- GLOBAL - RELOAD AT THE TOP ---------------
window.addEventListener("beforeunload", function () {
  history.scrollRestoration = "manual";
});

// --------------- LENIS ---------------
window.lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// --------------- PAPER TIGET SIGNATURE ---------------
const pprtgr = [
  'color: #F2F3F3',
  'background: #080808',
  'font-size: 12px',
  'padding-left: 10px',
  'line-height: 2',
  'border-left: 5px solid #ff3c31',
].join(';');
console.info(`

%cWebsite by Paper Tiger${' '}
www.papertiger.com${'     '}

`, pprtgr);

// --------------- CURRENT YEAR ---------------
const currentYear = document.querySelector('[current-year]');
if (currentYear) {
  currentYear.innerHTML = new Date().getFullYear();
}

// --- HERO SECTION PLAYER
function heroPlayer() {
  const video = document.querySelector('.c-video.hm-hero');
  const button = document.querySelector('.c-video-btn');
  const soundText = button?.querySelector('[data-sound-text]');

  if (video && button && soundText) {
    const updateButtonText = (text) => {
      soundText.innerText = text;
    };

    button.addEventListener('click', () => {
      const isMuted = video.muted;

      if (isMuted) {
        video.muted = false;
        button.classList.remove('is-muted');
        button.classList.add('is-unmuted');
        updateButtonText('Mute');
      } else {
        video.muted = true;
        button.classList.remove('is-unmuted');
        button.classList.add('is-muted');
        updateButtonText('Play');
      }
    });

    if (video.muted) {
      button.classList.add('is-muted');
      button.classList.remove('is-unmuted');
      updateButtonText('Play');
    } else {
      button.classList.add('is-unmuted');
      button.classList.remove('is-muted');
      updateButtonText('Mute');
    }
  }

  // Mute on scroll
  if (video && button && soundText) {
    ScrollTrigger.create({
      trigger: '.c-section.hm-hero',
      start: 'top top',
      end: 'bottom center',
      onEnter: () => {},
      onLeave: () => {
        video.muted = true;
        button.classList.remove('is-unmuted');
        button.classList.add('is-muted');
        soundText.innerText = 'Play';
      }
    });
  }
}

// --- CARDS HOVER EFFECT
function cardsHover() {
  const cards = document.querySelectorAll(".c-team-card");

  cards.forEach(card => {
    const hoverEl = card.querySelector(".c-team-card-hover");
    const photo = card.querySelector(".c-img-contain.team");

    const tl = gsap.timeline({
      paused: true,
      defaults: {
        ease: "power4.inOut",
        duration: 0.6
      }
    });

    tl.to(photo, { scale: 1, opacity: 0 });
    tl.to(hoverEl, { opacity: 1 }, 0);

    card.addEventListener("mouseenter", function () {
      tl.restart();
    });

    card.addEventListener("mouseleave", function () {
      tl.reverse();
    });
  });
}

// --- FEATURED PROJECT HOVER EFFECT
function featuredProjectHover() {
  const cards = document.querySelectorAll(".c-project-card");

  cards.forEach(card => {
    const photo = card.querySelector(".c-img-contain.project");
    const overlay = card.querySelector(".c-overlay");
    const gradient = card.querySelector(".c-img-contain.project-hover");
    const text = card.querySelector(".c-project-card-inner");

    const tl = gsap.timeline({
      paused: true,
      defaults: {
        ease: "power4.inOut",
        duration: 1
      }
    });

    tl.to(photo, { scale: 1 });
    tl.to(overlay, { opacity: 1 }, 0);
    tl.to(gradient, { opacity: 0.4 }, 0);
    tl.to(text, { opacity: 1 }, 0);

    card.addEventListener("mouseenter", function () {
      tl.restart();
    });

    card.addEventListener("mouseleave", function () {
      tl.reverse();
    });
  });
}

// --------------- HEADER SCROLLED ---------------
function headerScrolled() {
  const header = document.querySelector(".c-header");

  if (!header) return;

  ScrollTrigger.create({
    trigger: "body",
    start: "50 top",
    onToggle: (self) => {
      if (self.isActive) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  });
}

// --- NAV SECTION LINKS
function navSectionLinks() {
  const links = document.querySelectorAll("[data-link]");
  const sections = document.querySelectorAll(".c-section");
  const header = document.querySelector(".c-header");
  const headerHeight = parseFloat(window.getComputedStyle(header).height);

  links.forEach(link => {
    const linkInfo = link.getAttribute("data-link");

    link.addEventListener("click", function () {
      setTimeout(() => {
        lenis.scrollTo(`.c-section[id=${linkInfo}]`, {
          duration: 1.2,
          offset: window.innerWidth <= 991 ? -headerHeight : 0
        });
      }, 10);
    });

  });
}

// --- HEADER
function header() {
  const header = document.querySelector(".c-header");
  const navMenu = document.querySelector(".c-header-nav");
  const trigger = document.querySelector(".c-header-bar-icon");
  let navStatus = "closed";
  let totalFrames = 0;

  const lottieIcon = lottie.loadAnimation({
    container: trigger,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "https://cdn.prod.website-files.com/67ffa003d8805851ed4c6b08/6818684af1dcd92003b47492_mighty_website_hamburger_0502.json"
  });

  lottieIcon.addEventListener("DOMLoaded", () => {
    totalFrames = lottieIcon.getDuration(true);
  });

  lottieIcon.addEventListener("complete", () => {
    lottieIcon.pause();
  });

  function playLottieSegment(startPercent, endPercent) {
    if (totalFrames === 0) return;

    const startFrame = Math.round((startPercent / 100) * totalFrames);
    const endFrame = Math.round((endPercent / 100) * totalFrames);

    lottieIcon.stop();
    lottieIcon.setDirection(endFrame > startFrame ? 1 : -1);
    lottieIcon.playSegments([startFrame, endFrame], true);
  }

  const tl = gsap.timeline({ paused: true, defaults: { ease: "power4.inOut", duration: 0.6 } });

  gsap.set(".c-nav-link", { y: -20 });

  tl.to(".c-nav-link", { opacity: 1, y: 0, stagger: { each: 0.1 } }, 0);

  function openMenu() {
    if (navStatus !== "open") {
      tl.restart();
      navStatus = "open";
      header.classList.add("is-open");

      // Play Lottie from 0% to 80%
      playLottieSegment(0, 80);
    }
  }

  function closeMenu() {
    if (navStatus !== "closed") {
      tl.reverse();
      navStatus = "closed";
      header.classList.remove("is-open");

      // Play Lottie from 80% to 100%
      playLottieSegment(80, 100);
    }
  }

  trigger.addEventListener("mouseenter", openMenu);

  header.addEventListener("mouseleave", (e) => {
    if (!header.contains(e.relatedTarget)) {
      closeMenu();
    }
  });

  // Close the menu when a link inside the header is clicked
  const navLinks = navMenu.querySelectorAll("a");
  navLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });
}

// --- PARALLAX
function parallax() {
  const images = document.querySelectorAll("[parallax]");

  if (images) {
    new Ukiyo(images, {
      scale: 1.2,
      speed: 1.2,
      // willChange: true,
    });
  }
}

// --- BACKGROUND SLIDER
function bgSlider() {

  const sliderEl = document.querySelector(".swiper.ss");
  if (!sliderEl) return;

  const slider = new Swiper(sliderEl, {
    slidesPerView: "auto",
    speed: 600,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: true
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
  });

  const grain = document.querySelector(".c-img-contain.grain-static");

  ScrollTrigger.create({
    trigger: ".c-section.hm-hero",
    start: "top bottom",
    end: "bottom top",
    onLeave: () => {
      gsap.to(grain, { opacity: 0, duration: 0.6, ease: "power3.inOut" });
    },
    onEnterBack: () => {
      gsap.to(grain, { opacity: 1, duration: 0.6, ease: "power3.inOut" });
    }
  });
}

// --- LOADER
function loader() {
  const image = document.querySelector(".c-img-contain.grain-static");
  const slider = document.querySelector(".c-swiper");

  const tl = gsap.timeline({
    defaults: {
      duration: 1.2,
      ease: "power3.out"
    }
  });

  tl.to(image, { opacity: 1 });
  tl.to(slider, { opacity: 1 }, "<");
}

// --- BICYCLE
function bicycle() {
  const item = document.querySelectorAll(".c-bicycle-item");
  if (item.lenght === 0) return;

  gsap.to(item, { x: "100%", duration: 20, ease: "linear", repeat: -1 });
}

// --- TEAM MODAL
function teamModal() {
  const cards = document.querySelectorAll('.c-team-card');
  const modals = document.querySelectorAll('.c-team-modal');
  const closeButtons = document.querySelectorAll('.c-team-modal-close-btn');

  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      const modal = modals[index];
      if (modal) {
        modal.classList.add('is-open');
        lenis.stop();
      }
    });
  });

  function closeModal(modal) {
    modal.classList.remove('is-open');
    lenis.start();
  }

  closeButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const modal = modals[index];
      if (modal) {
        closeModal(modal);
      }
    });
  });

  modals.forEach((modal, index) => {
    const overlay = modal.querySelector('.c-team-modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => {
        closeModal(modal);
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      modals.forEach(modal => {
        if (modal.classList.contains('is-open')) {
          closeModal(modal);
        }
      });
    }
  });

}

// --------------- INIT ---------------
function init() {
  heroPlayer();
  headerScrolled();
  cardsHover();
  navSectionLinks();
  header();
  featuredProjectHover();
  bgSlider();
  loader();
  bicycle();
  teamModal();
}

init();

// --------------- MATCHMEDIA (DESKTOP) ---------------
mm.add("(min-width: 992px)", () => {
  //
  return () => {
    //
  };
});

// --------------- MATCHMEDIA (TABLET AND MOBILE) ---------------
mm.add("(max-width: 991px)", () => {
  //
  return () => {
    //
  };
});
