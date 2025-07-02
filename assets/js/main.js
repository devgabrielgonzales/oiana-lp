document.addEventListener("DOMContentLoaded", () => {
  
  const formularioBeneficio = document.getElementById('formulario-beneficio');
  if (formularioBeneficio) {
    formularioBeneficio.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btnEnviar = document.getElementById('btn-enviar');
      
      const cro = document.getElementById('cro').value.trim();
      const uf = document.getElementById('estado').value;
      const plano = document.getElementById('planos').value;
      const mensagem = `Solicitação de benefício para o ${plano}`;
      
      if (!cro || !uf) {
        mostrarModal('Por favor, preencha todos os campos obrigatórios.', 'erro', 'Campos Obrigatórios');
        return;
      }
      
      btnEnviar.disabled = true;
      btnEnviar.textContent = 'Enviando...';
      
      try {
        const response = await fetch('https://api.dentaluni.com.br/solicitacao-beneficio-oiana', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cro: cro,
            uf: uf,
            abertura: 26,
            msg: mensagem
          })
        });
        
        const data = await response.json();
        
        if (data.error === false && data.status === true) {
          mostrarModal(
            `Seu protocolo é: ${data.atendimento.cod_ans}. ${data.retorno_app}`,
            'sucesso',
            'Solicitação Enviada!'
          );
          formularioBeneficio.reset();
        } else {
          const erros = data.erros ? Object.values(data.erros).flat().join(' ') : '';
          mostrarModal(
            `${data.msg || 'Não foi possível processar sua solicitação.'} ${erros}`,
            'erro',
            'Erro na Solicitação'
          );
        }
      } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        mostrarModal(
          'Erro de conexão. Verifique sua internet e tente novamente.',
          'erro',
          'Erro de Conexão'
        );
      }
      
      btnEnviar.disabled = false;
      btnEnviar.textContent = 'Enviar Solicitação';
    });
    
    function mostrarModal(mensagem, tipo, titulo) {
      const modalOverlay = document.getElementById('response-modal-overlay');
      const modalTitle = document.getElementById('response-modal-title');
      const modalMessage = document.getElementById('response-modal-message');
      const modalIcon = document.getElementById('response-modal-icon');
      const successIcon = document.getElementById('success-icon');
      const errorIcon = document.getElementById('error-icon');
      const okButton = document.getElementById('response-modal-ok-button');
      
      modalTitle.textContent = titulo;
      modalMessage.textContent = mensagem;
      
      successIcon.classList.add('hidden');
      errorIcon.classList.add('hidden');
      
      if (tipo === 'sucesso') {
        modalIcon.className = 'mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4 bg-green-100';
        successIcon.classList.remove('hidden');
        successIcon.className = 'h-6 w-6 text-green-600';
        okButton.className = 'inline-flex justify-center rounded-md border border-transparent bg-green-600 hover:bg-green-700 focus:ring-green-500 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition';
      } else {
        modalIcon.className = 'mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4 bg-red-100';
        errorIcon.classList.remove('hidden');
        errorIcon.className = 'h-6 w-6 text-red-600';
        okButton.className = 'inline-flex justify-center rounded-md border border-transparent bg-red-600 hover:bg-red-700 focus:ring-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition';
      }
      
      modalOverlay.classList.remove('hidden');
      setTimeout(() => {
        modalOverlay.classList.add('visible');
      }, 20);
    }
  }
  
  const responseModalOverlay = document.getElementById('response-modal-overlay');
  const responseModalCloseButton = document.getElementById('response-modal-close-button');
  const responseModalOkButton = document.getElementById('response-modal-ok-button');
  
  if (responseModalOverlay && responseModalCloseButton && responseModalOkButton) {
    const fecharModalResposta = () => {
      responseModalOverlay.classList.remove('visible');
      setTimeout(() => {
        responseModalOverlay.classList.add('hidden');
      }, 400);
    };
    
    responseModalCloseButton.addEventListener('click', fecharModalResposta);
    responseModalOkButton.addEventListener('click', fecharModalResposta);
    responseModalOverlay.addEventListener('click', (event) => {
      if (event.target === responseModalOverlay) fecharModalResposta();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && responseModalOverlay.classList.contains('visible')) {
        fecharModalResposta();
      }
    });
  }
  

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


  const animatedElements = document.querySelectorAll(
    ".js-scroll-animation, .anim-fade-in-left, .anim-fade-in-right, .count-up"
  );

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {

          if (entry.target.classList.contains("js-scroll-animation")) {
            entry.target.classList.add("animate");
          }
          if (
            entry.target.classList.contains("anim-fade-in-left") ||
            entry.target.classList.contains("anim-fade-in-right")
          ) {
            entry.target.classList.add("is-visible");
          }


          if (entry.target.classList.contains("count-up")) {
            animateCounter(entry.target);
          }

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  animatedElements.forEach((el) => {
    observer.observe(el);
  });


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


    setTimeout(openModal, 1500);


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


    function adicionarEventosModal() {
      
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


    const observerModal = new MutationObserver(() => {
      if (!modalOverlay.classList.contains('hidden')) {
        setTimeout(adicionarEventosModal, 100);
      }
    });
    observerModal.observe(modalOverlay, { attributes: true, attributeFilter: ['class'] });
  }


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

    heroAnim.classList.add("fade-out");
    heroAnim.classList.remove("fade-in");
    setTimeout(() => {

      current = (current + 1) % images.length;
      heroImg.src = images[current];
      
      heroAnim.style.transform = "translateX(80px)";
      
      void heroAnim.offsetWidth;
      
      heroAnim.classList.add("fade-in");
      heroAnim.classList.remove("fade-out");
              heroAnim.style.transform = "";
      
      setTimeout(() => {
        heroAnim.classList.remove("fade-in");
      }, 700);
          }, 700);
  }, 3500);
}