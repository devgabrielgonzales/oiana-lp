document.addEventListener("DOMContentLoaded", () => {
  
  const croInput = document.getElementById('cro');
  if (croInput) {
    croInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
    
    croInput.addEventListener('keypress', (e) => {
      if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
    });
    
    croInput.addEventListener('paste', (e) => {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData('text');
      const numbersOnly = paste.replace(/[^0-9]/g, '');
      if (numbersOnly) {
        e.target.value = numbersOnly;
      }
    });
  }

  // Função para converter nome para camelCase
  function toCamelCase(str) {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
      return match.toUpperCase();
    });
  }

  // Função para consultar CRO na API da DentalUni
  async function validarCRO(cro, uf) {
    try {
      const response = await fetch(`https://api.dentaluni.com.br/grc/dentista?cro=${cro}&uf=${uf}`);
      const data = await response.json();
      
      if (data.error === 1) {
        throw new Error(data.msg || 'CRO não encontrado');
      }
      
      if (Array.isArray(data) && data.length > 0) {
        return data[0];
      } else {
        throw new Error('CRO não encontrado');
      }
    } catch (error) {
      throw error;
    }
  }

  // Evento para validar CRO quando CRO e UF estiverem preenchidos
  const estadoSelect = document.getElementById('estado');
  const nomeCompletoInput = document.getElementById('nome-completo');
  const enderecoContainer = document.getElementById('endereco-container');
  const enderecoUnico = document.getElementById('endereco-unico');
  const enderecosMultiplos = document.getElementById('enderecos-multiplos');
  const listaEnderecos = document.getElementById('lista-enderecos');

  // Variável para armazenar os dados completos do dentista
  let dadosCompletosDentista = null;

  // Função para formatar endereço
  function formatarEndereco(endereco) {
    const partes = [];
    if (endereco.logradouro) partes.push(endereco.logradouro);
    if (endereco.numero) partes.push(endereco.numero);
    if (endereco.complemento) partes.push(endereco.complemento);
    if (endereco.bairro) partes.push(endereco.bairro);
    if (endereco.cidade) partes.push(endereco.cidade);
    if (endereco.uf) partes.push(endereco.uf);
    if (endereco.cep) partes.push(`CEP: ${endereco.cep}`);
    
    return partes.join(', ');
  }

  // Função para atualizar visual de seleção de endereço
  function updateEnderecoSelection(container, isSelected) {
    if (isSelected) {
      container.classList.add('selected');
    } else {
      container.classList.remove('selected');
    }
  }

  // Função para processar endereços
  function processarEnderecos(enderecos) {
    if (!enderecos || enderecos.length === 0) {
      enderecoContainer.style.display = 'none';
      return;
    }

    enderecoContainer.style.display = 'block';

    if (enderecos.length === 1) {
      // Mostrar campo único
      enderecoUnico.classList.remove('hidden');
      enderecosMultiplos.classList.add('hidden');
      enderecoUnico.value = formatarEndereco(enderecos[0]);
    } else {
      // Mostrar checkboxes múltiplos
      enderecoUnico.classList.add('hidden');
      enderecosMultiplos.classList.remove('hidden');
      
      // Limpar lista anterior
      listaEnderecos.innerHTML = '';
      
              // Criar checkboxes para cada endereço
        enderecos.forEach((endereco, index) => {
          const enderecoFormatado = formatarEndereco(endereco);
          
          const checkboxContainer = document.createElement('div');
          checkboxContainer.className = 'endereco-item flex items-start space-x-3 p-3 rounded-md';
          checkboxContainer.setAttribute('data-endereco-index', index);
          
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = `endereco-${index}`;
          checkbox.name = 'enderecos-selecionados';
          checkbox.value = index;
          checkbox.className = 'endereco-checkbox mt-1';
          
          const label = document.createElement('label');
          label.htmlFor = `endereco-${index}`;
          label.className = 'text-sm text-gray-700 cursor-pointer flex-1';
          label.textContent = enderecoFormatado;
          
          // Adicionar evento de clique no container
          checkboxContainer.addEventListener('click', (e) => {
            // Evitar duplo clique se clicou diretamente no checkbox
            if (e.target === checkbox) return;
            
            checkbox.checked = !checkbox.checked;
            updateEnderecoSelection(checkboxContainer, checkbox.checked);
          });
          
          // Adicionar evento de mudança no checkbox
          checkbox.addEventListener('change', (e) => {
            updateEnderecoSelection(checkboxContainer, e.target.checked);
          });
          
          checkboxContainer.appendChild(checkbox);
          checkboxContainer.appendChild(label);
          listaEnderecos.appendChild(checkboxContainer);
        });
    }
  }

      async function verificarCRO() {
      const cro = croInput.value.trim();
      const uf = estadoSelect.value;
      
      if (cro && uf && cro.length >= 3) {
        try {
          // Limpar campos
          nomeCompletoInput.value = '';
          enderecoContainer.style.display = 'none';
          dadosCompletosDentista = null;
          
          // Buscar dados na API
          const dadosDentista = await validarCRO(cro, uf);
          
          // Armazenar dados completos
          dadosCompletosDentista = dadosDentista;
          
          // Processar nome completo
          const nomeCompleto = toCamelCase(dadosDentista.nome);
          
          // Preencher campo nome
          nomeCompletoInput.value = nomeCompleto;
          
          // Processar endereços
          processarEnderecos(dadosDentista.enderecos);
          
          // Remover estilo de erro se existir
          croInput.classList.remove('border-red-500');
          estadoSelect.classList.remove('border-red-500');
          
        } catch (error) {
          // Limpar campos em caso de erro
          nomeCompletoInput.value = '';
          enderecoContainer.style.display = 'none';
          dadosCompletosDentista = null;
          
          // Adicionar estilo de erro
          croInput.classList.add('border-red-500');
          estadoSelect.classList.add('border-red-500');
          
          // Erro silencioso - campo será limpo automaticamente
        }
      } else {
        // Limpar campos se não tiver dados suficientes
        nomeCompletoInput.value = '';
        enderecoContainer.style.display = 'none';
        dadosCompletosDentista = null;
      }
    }

  if (croInput && estadoSelect) {
    croInput.addEventListener('blur', verificarCRO);
    estadoSelect.addEventListener('change', verificarCRO);
  }

  // Função para selecionar plano no formulário
  function selecionarPlanoFormulario(nomePlano) {
    const selectPlanos = document.getElementById('select-planos');
    if (selectPlanos) {
      selectPlanos.value = nomePlano;
      
      // Scroll para o formulário com um pequeno delay para garantir que a página carregou
      setTimeout(() => {
        const formulario = document.getElementById('form');
        if (formulario) {
          formulario.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }

  // Event listeners para todos os botões com classe plan-select-button
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('plan-select-button') || e.target.closest('.plan-select-button')) {
      const button = e.target.classList.contains('plan-select-button') ? e.target : e.target.closest('.plan-select-button');
      const planName = button.getAttribute('data-plan');
      
      if (planName) {
        e.preventDefault();
        selecionarPlanoFormulario(planName);
        
        // Se for um botão do modal, fechar o modal
        if (button.closest('#plans-modal-overlay')) {
          const modalOverlay = document.getElementById('plans-modal-overlay');
          if (modalOverlay) {
            modalOverlay.classList.remove('visible');
            setTimeout(() => {
              modalOverlay.classList.add('hidden');
            }, 400);
          }
        }
      }
    }
  });

  const formularioBeneficio = document.getElementById('formulario-beneficio');
  if (formularioBeneficio) {
    formularioBeneficio.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btnEnviar = document.getElementById('btn-enviar');
      
      const cro = document.getElementById('cro').value.trim();
      const uf = document.getElementById('estado').value;
      const nomeCompleto = document.getElementById('nome-completo').value.trim();
      const planoElement = document.getElementById('select-planos');
      const plano = planoElement ? planoElement.value : '';
      
      // Obter endereços selecionados
      let enderecosSelecionados = [];
      if (dadosCompletosDentista && dadosCompletosDentista.enderecos) {
        if (dadosCompletosDentista.enderecos.length === 1) {
          // Endereço único - incluir automaticamente
          enderecosSelecionados.push(formatarEndereco(dadosCompletosDentista.enderecos[0]));
        } else {
          // Múltiplos endereços - obter selecionados
          const checkboxesSelecionados = document.querySelectorAll('input[name="enderecos-selecionados"]:checked');
          checkboxesSelecionados.forEach(checkbox => {
            const index = parseInt(checkbox.value);
            enderecosSelecionados.push(formatarEndereco(dadosCompletosDentista.enderecos[index]));
          });
        }
      }
      
      // Montar mensagem com endereços
      let mensagem = `Solicitação de benefício OiAna - ${plano} - Nome: ${nomeCompleto} - CRO: ${cro}/${uf}`;
      if (enderecosSelecionados.length > 0) {
        mensagem += `\n\nEndereços das clínicas:\n${enderecosSelecionados.map((endereco, index) => `${index + 1}. ${endereco}`).join('\n')}`;
      }
      
      if (!cro || !uf || !nomeCompleto || !plano) {
        mostrarModal('Por favor, preencha todos os campos obrigatórios.', 'erro', 'Campos Obrigatórios');
        return;
      }
      
      // Validar seleção de endereços para múltiplos endereços
      if (dadosCompletosDentista && dadosCompletosDentista.enderecos && dadosCompletosDentista.enderecos.length > 1 && enderecosSelecionados.length === 0) {
        mostrarModal('Por favor, selecione pelo menos um endereço de clínica.', 'erro', 'Endereço Obrigatório');
        return;
      }
      
      // Verificar se o CRO foi validado (se o campo nome completo está preenchido)
      if (!nomeCompleto) {
        mostrarModal('Por favor, verifique se o CRO e UF estão corretos. O nome deve ser preenchido automaticamente.', 'erro', 'Validação de CRO');
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
            nome_completo: nomeCompleto,
            abertura: 26,
            msg: mensagem
          })
        });
        
        const data = await response.json();
        
        if (data.error === false && data.status === true) {
          mostrarModal(
            data.retorno_app,
            'sucesso',
            'Solicitação Enviada!',
            data.atendimento.cod_ans
          );
          // Limpar formulário
          formularioBeneficio.reset();
          // Limpar dados do dentista
          dadosCompletosDentista = null;
          // Limpar campo nome completo
          nomeCompletoInput.value = '';
          // Esconder container de endereços
          enderecoContainer.style.display = 'none';
          // Remover estilos de erro se existirem
          croInput.classList.remove('border-red-500');
          estadoSelect.classList.remove('border-red-500');
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
    
    function mostrarModal(mensagem, tipo, titulo, protocolo = null) {
      const modalOverlay = document.getElementById('response-modal-overlay');
      const modalTitle = document.getElementById('response-modal-title');
      const modalMessage = document.getElementById('response-modal-message');
      const modalIcon = document.getElementById('response-modal-icon');
      const successIcon = document.getElementById('success-icon');
      const errorIcon = document.getElementById('error-icon');
      const okButton = document.getElementById('response-modal-ok-button');
      
      modalTitle.textContent = titulo;
      
      if (protocolo && tipo === 'sucesso') {
        modalMessage.innerHTML = mensagem.replace(protocolo, `<strong>${protocolo}</strong>.`);
      } else {
        modalMessage.textContent = mensagem;
      }
      
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
        if (tipo === 'sucesso' && typeof confetti === 'function') {
          confetti({
            particleCount: 200,
            spread: 70,
            origin: { y: 0.6 },
            zIndex: 1001,
            colors: ["#5a425a", "#d4799e", "#ffffff", "#e08dad", "#16a34a"],
          });
        }
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
        // Verificar se foi modal de sucesso pela presença de ícone de sucesso visível
        const successIcon = document.getElementById('success-icon');
        if (successIcon && !successIcon.classList.contains('hidden')) {
          // Rolar suavemente para o topo da página
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
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
    ".js-scroll-animation, .anim-fade-in-left, .anim-fade-in-right, .anim-fade-in-up, .count-up"
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
            entry.target.classList.contains("anim-fade-in-right") ||
            entry.target.classList.contains("anim-fade-in-up")
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
  
      }
    }

    function selecionarPlanoEFecharModal(plano) {
      
      selecionarPlano(plano);
      closeModal();
      setTimeout(() => {
        const form = document.getElementById('form');
        if (form) {
          form.scrollIntoView({behavior: 'smooth'});
  
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