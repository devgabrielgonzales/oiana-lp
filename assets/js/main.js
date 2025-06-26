document.addEventListener("DOMContentLoaded", () => {
  // --- MOBILE MENU ---
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });

    document.querySelectorAll("#mobile-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }

  // --- BACK TO TOP BUTTON ---
  const backToTopButton = document.getElementById("back-to-top");
  if (backToTopButton) {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 200 ||
        document.documentElement.scrollTop > 200
      ) {
        backToTopButton.classList.remove("hidden");
      } else {
        backToTopButton.classList.add("hidden");
      }
    });
  }

  // --- UNIFIED SCROLL & COUNTER ANIMATIONS ---
  const animatedElements = document.querySelectorAll(
    ".js-scroll-animation, .anim-fade-in-left, .anim-fade-in-right, .count-up"
  );

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // General scroll animations
          if (entry.target.classList.contains("js-scroll-animation")) {
            entry.target.classList.add("animate");
          }
          if (
            entry.target.classList.contains("anim-fade-in-left") ||
            entry.target.classList.contains("anim-fade-in-right")
          ) {
            entry.target.classList.add("is-visible");
          }

          // Counter animation
          if (entry.target.classList.contains("count-up")) {
            animateCounter(entry.target);
          }

          observer.unobserve(entry.target); // Animate only once
        }
      });
    },
    { threshold: 0.15 } // Start animation when 15% of the element is visible
  );

  animatedElements.forEach((el) => {
    observer.observe(el);
  });

  // Counter animation function
  const animateCounter = (element) => {
    const target = +element.getAttribute("data-value");
    const duration = 2000;
    let startTime = null;

    const formatNumber = (value) => {
      if (value >= 10000) return (value / 1000).toLocaleString("pt-BR") + "K";
      if (value >= 1000 && value % 1000 === 0) return value / 1000 + "K";
      return value.toLocaleString("pt-BR");
    };

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = Math.floor(progress * target);
      element.innerText = currentValue.toLocaleString("pt-BR");

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.innerText = formatNumber(target);
      }
    };
    window.requestAnimationFrame(step);
  };

  // --- POP-UP MODAL & CONFETTI ---
  const modalOverlay = document.getElementById("plans-modal-overlay");
  const closeModalButton = document.getElementById("modal-close-button");

  if (modalOverlay && closeModalButton && typeof confetti === "function") {
    const runConfetti = () => {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        zIndex: 1001,
        colors: ["#5a425a", "#d4799e", "#ffffff", "#e08dad"],
      });
    };

    const openModal = () => {
      modalOverlay.classList.remove("hidden");
      setTimeout(() => {
        modalOverlay.classList.add("visible");
        runConfetti();
      }, 20);
    };

    const closeModal = () => {
      modalOverlay.classList.remove("visible");
      setTimeout(() => {
        modalOverlay.classList.add("hidden");
      }, 400);
    };

    // Open modal after a delay
    setTimeout(openModal, 1500);

    // Event listeners to close the modal
    closeModalButton.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (event) => {
      if (event.target === modalOverlay) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        modalOverlay.classList.contains("visible")
      ) {
        closeModal();
      }
    });
  }
});
