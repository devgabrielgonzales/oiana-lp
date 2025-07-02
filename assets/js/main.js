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

  console.log('Modal overlay encontrado:', !!modalOverlay);
  console.log('Botão fechar encontrado:', !!closeModalButton);

  if (modalOverlay && closeModalButton) {
    const runConfetti = () => {
      if (typeof confetti === "function") {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
          zIndex: 1001,
          colors: ["#5a425a", "#d4799e", "#ffffff", "#e08dad"],
        });
      }
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

    // --- FUNÇÕES PARA SELECIONAR PLANO E DIRECIONAR PARA FORMULÁRIO ---
    function selecionarPlano(plano) {
      const selectPlano = document.getElementById('planos');
      if (selectPlano) {
        selectPlano.value = plano;
        selectPlano.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('Plano selecionado:', plano);
      }
    }

    function selecionarPlanoEFecharModal(plano) {
      console.log('Fechando modal e selecionando plano:', plano);
      selecionarPlano(plano);
      closeModal();
      setTimeout(() => {
        const form = document.getElementById('form');
        if (form) {
          form.scrollIntoView({behavior: 'smooth'});
          console.log('Direcionando para formulário');
        }
      }, 500);
    }

    // Adicionar eventos aos botões do modal
    function adicionarEventosModal() {
      // Eventos para os botões "Contratar Agora" e "Resgatar Benefício"
      const botoesModal = modalOverlay.querySelectorAll('a[href="#form"]');
      botoesModal.forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          if (btn.textContent.includes('Consultórios') || btn.textContent.includes('Contratar')) {
            selecionarPlanoEFecharModal('Plano para Consultórios');
          } else {
            selecionarPlanoEFecharModal('Plano DentalUni (Gratuito)');
          }
        });
      });

      // Eventos para clicar nos cards (seleciona plano sem fechar modal)
      const consultoriosCard = document.getElementById('tier-consultorios-modal')?.closest('.rounded-3xl');
      const dentaluniCard = document.getElementById('tier-dentaluni-modal')?.closest('.rounded-3xl');

      if (consultoriosCard) {
        consultoriosCard.addEventListener('click', function(e) {
          if (!e.target.closest('a[href="#form"]')) {
            selecionarPlano('Plano para Consultórios');
          }
        });
      }

      if (dentaluniCard) {
        dentaluniCard.addEventListener('click', function(e) {
          if (!e.target.closest('a[href="#form"]')) {
            selecionarPlano('Plano DentalUni (Gratuito)');
          }
        });
      }
    }

    // Adicionar eventos quando o modal abrir
    const observerModal = new MutationObserver(() => {
      if (!modalOverlay.classList.contains('hidden')) {
        setTimeout(adicionarEventosModal, 100);
      }
    });
    observerModal.observe(modalOverlay, { attributes: true, attributeFilter: ['class'] });
  }

  // --- DESTAQUE DE LINK ATIVO NA NAV ---
  const header = document.getElementById('header');
  const navLinks = [
    {id: 'dentaluni-agenda', selector: 'a[href="#dentaluni-agenda"]'},
    {id: 'features', selector: 'a[href="#features"]'},
    {id: 'about', selector: 'a[href="#about"]'},
    {id: 'facts', selector: 'a[href="#facts"]'},
    {id: 'home', selector: 'a[href="#home"]'}
  ];
  const sections = navLinks.map(l => document.getElementById(l.id));

  function checkSectionInView() {
    const scrollY = window.scrollY || window.pageYOffset;
    let activeIndex = -1;
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (!section) continue;
      const rect = section.getBoundingClientRect();
      const top = rect.top + scrollY;
      const bottom = top + section.offsetHeight;
      if (scrollY + 80 >= top && scrollY + 80 < bottom) {
        activeIndex = i;
        break;
      }
    }
    // Destacar link ativo
    navLinks.forEach((link, idx) => {
      document.querySelectorAll(link.selector).forEach(el => {
        if (idx === activeIndex) {
          el.classList.add('text-oiana-rosa');
          el.classList.remove('text-gray-700');
        } else {
          el.classList.remove('text-oiana-rosa');
          el.classList.add('text-gray-700');
        }
      });
    });
  }
  window.addEventListener('scroll', checkSectionInView);
  window.addEventListener('resize', checkSectionInView);
  checkSectionInView();
});


// --- HERO IMAGE CAROUSEL COM SLIDE-IN CORRIGIDO ---
const heroImg = document.getElementById("hero-img");
const heroAnim = document.getElementById("hero-anim");
if (heroImg && heroAnim) {
  const images = [
    "assets/images/about/agenda.png",
    "assets/images/about/guias.png",
    "assets/images/about/performance.png"
  ];
  let current = 0;
  setInterval(() => {
    // Sai para a direita (fade + slide)
    heroAnim.classList.add("fade-out");
    heroAnim.classList.remove("fade-in");
    setTimeout(() => {
      // Troca a imagem quando estiver fora
      current = (current + 1) % images.length;
      heroImg.src = images[current];
      // Coloca a div fora do centro, à direita, antes de animar a entrada
      heroAnim.style.transform = "translateX(80px)";
      // Força reflow para garantir a transição
      void heroAnim.offsetWidth;
      // Volta com efeito de entrada da direita para o centro
      heroAnim.classList.add("fade-in");
      heroAnim.classList.remove("fade-out");
      heroAnim.style.transform = ""; // Deixa o CSS controlar o transform
      // Remove a classe fade-in após a animação para não acumular classes
      setTimeout(() => {
        heroAnim.classList.remove("fade-in");
      }, 700);
    }, 700); // Tempo igual ao transition do CSS
  }, 3500);
}