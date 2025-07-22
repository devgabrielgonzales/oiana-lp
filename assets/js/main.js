document.addEventListener("DOMContentLoaded", () => {
  // --- SELETORES DE ELEMENTOS ---
  const croInput = document.getElementById("cro");
  const estadoSelect = document.getElementById("estado");
  const nomeCompletoInput = document.getElementById("nome-completo");
  const enderecoContainer = document.getElementById("endereco-container");
  const enderecoUnico = document.getElementById("endereco-unico");
  const enderecosMultiplos = document.getElementById("enderecos-multiplos");
  const listaEnderecos = document.getElementById("lista-enderecos");
  const formularioBeneficio = document.getElementById("formulario-beneficio");

  // --- Seletores da NOVA MODAL DE AUTORIZAÇÃO ---
  const authModalOverlay = document.getElementById("auth-modal-overlay");
  const authConfirmButton = document.getElementById("auth-confirm-button");
  const authCancelButton = document.getElementById("auth-cancel-button");

  let dadosCompletosDentista = null;

  // --- FUNÇÕES AUXILIARES ---

  function toCamelCase(str) {
    return str
      .toLowerCase()
      .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
  }

  function formatarEndereco(endereco) {
    const partes = [];
    if (endereco.logradouro) partes.push(endereco.logradouro);
    if (endereco.numero) partes.push(endereco.numero);
    if (endereco.complemento) partes.push(endereco.complemento);
    if (endereco.bairro) partes.push(endereco.bairro);
    if (endereco.cidade) partes.push(endereco.cidade);
    if (endereco.uf) partes.push(endereco.uf);
    if (endereco.cep) partes.push(`CEP: ${endereco.cep}`);
    return partes.join(", ");
  }

  // Funções para controlar a modal de autorização
  function showAuthModal() {
    if (!authModalOverlay) return;
    authModalOverlay.classList.remove("hidden");
    setTimeout(() => authModalOverlay.classList.add("visible"), 20);
  }

  function hideAuthModal() {
    if (!authModalOverlay) return;
    authModalOverlay.classList.remove("visible");
    setTimeout(() => authModalOverlay.classList.add("hidden"), 400);
  }

  // --- LÓGICA PRINCIPAL DO FORMULÁRIO ---

  async function validarCROApi(cro, uf) {
    try {
      const response = await fetch(
        `https://api.dentaluni.com.br/grc/dentista?cro=${cro}&uf=${uf}`
      );
      const data = await response.json();
      if (data.error === 1 || !Array.isArray(data) || data.length === 0) {
        throw new Error(data.msg || "CRO não encontrado");
      }
      return data[0];
    } catch (error) {
      throw error;
    }
  }

  function processarEnderecos(enderecos) {
    if (!enderecos || enderecos.length === 0) {
      enderecoContainer.style.display = "none";
      return;
    }
    enderecoContainer.style.display = "block";

    if (enderecos.length === 1) {
      enderecoUnico.classList.remove("hidden");
      enderecosMultiplos.classList.add("hidden");
      enderecoUnico.value = formatarEndereco(enderecos[0]);
    } else {
      enderecoUnico.classList.add("hidden");
      enderecosMultiplos.classList.remove("hidden");
      listaEnderecos.innerHTML = "";
      enderecos.forEach((endereco, index) => {
        const enderecoFormatado = formatarEndereco(endereco);
        const checkboxContainer = document.createElement("div");
        checkboxContainer.className =
          "endereco-item flex items-start space-x-3 p-3 rounded-md";
        checkboxContainer.setAttribute("data-endereco-index", index);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `endereco-${index}`;
        checkbox.name = "enderecos-selecionados";
        checkbox.value = index;
        checkbox.className = "endereco-checkbox mt-1";

        const label = document.createElement("label");
        label.htmlFor = `endereco-${index}`;
        label.className = "text-sm text-gray-700 cursor-pointer flex-1";
        label.textContent = enderecoFormatado;

        checkboxContainer.addEventListener("click", (e) => {
          if (e.target !== checkbox) checkbox.checked = !checkbox.checked;
          updateEnderecoSelection(checkboxContainer, checkbox.checked);
        });
        checkbox.addEventListener("change", (e) =>
          updateEnderecoSelection(checkboxContainer, e.target.checked)
        );

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);
        listaEnderecos.appendChild(checkboxContainer);
      });
    }
  }

  function updateEnderecoSelection(container, isSelected) {
    container.classList.toggle("selected", isSelected);
  }

  async function carregarDadosDoCRO() {
    const cro = croInput.value.trim();
    const uf = estadoSelect.value;

    nomeCompletoInput.placeholder = "Validando e carregando dados...";
    nomeCompletoInput.value = "";
    enderecoContainer.style.display = "none";
    dadosCompletosDentista = null;

    try {
      const dadosDentista = await validarCROApi(cro, uf);
      dadosCompletosDentista = dadosDentista;
      nomeCompletoInput.value = toCamelCase(dadosDentista.nome);
      processarEnderecos(dadosDentista.enderecos);
      croInput.classList.remove("border-red-500");
      estadoSelect.classList.remove("border-red-500");
    } catch (error) {
      croInput.classList.add("border-red-500");
      estadoSelect.classList.add("border-red-500");
      // Opcional: mostrar erro no modal de resposta
      // mostrarModal(error.message, 'erro', 'Erro de Validação');
    } finally {
      nomeCompletoInput.placeholder =
        "Nome será preenchido automaticamente após validação do CRO";
    }
  }

  // Função que INICIA a verificação, abrindo o modal de autorização
  function iniciarVerificacaoCRO() {
    const cro = croInput.value.trim();
    const uf = estadoSelect.value;

    if (cro && uf && cro.length >= 3) {
      showAuthModal();
    } else {
      nomeCompletoInput.value = "";
      enderecoContainer.style.display = "none";
      dadosCompletosDentista = null;
    }
  }

  // Event Listeners para o formulário e a nova modal
  if (croInput && estadoSelect) {
    croInput.addEventListener("blur", iniciarVerificacaoCRO);
    estadoSelect.addEventListener("change", iniciarVerificacaoCRO);
  }

  if (authConfirmButton) {
    authConfirmButton.addEventListener("click", () => {
      hideAuthModal();
      carregarDadosDoCRO(); // Executa a validação e carregamento dos dados
    });
  }

  if (authCancelButton)
    authCancelButton.addEventListener("click", hideAuthModal);
  if (authModalOverlay)
    authModalOverlay.addEventListener(
      "click",
      (e) => e.target === authModalOverlay && hideAuthModal()
    );

  // --- RESTANTE DO SEU CÓDIGO JS ORIGINAL (MODAIS, ANIMAÇÕES, ETC.) ---

  // Validação numérica para o campo CRO
  if (croInput) {
    croInput.addEventListener(
      "input",
      (e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
    );
    croInput.addEventListener(
      "keypress",
      (e) =>
        !/[0-9]/.test(e.key) &&
        ![
          "Backspace",
          "Delete",
          "Tab",
          "Enter",
          "ArrowLeft",
          "ArrowRight",
        ].includes(e.key) &&
        e.preventDefault()
    );
    croInput.addEventListener("paste", (e) => {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData("text");
      e.target.value = paste.replace(/[^0-9]/g, "");
    });
  }

  // Lógica de seleção de plano
  function selecionarPlanoFormulario(nomePlano) {
    const selectPlanos = document.getElementById("select-planos");
    if (selectPlanos) {
      selectPlanos.value = nomePlano;
      setTimeout(
        () =>
          document
            .getElementById("form")
            ?.scrollIntoView({ behavior: "smooth" }),
        100
      );
    }
  }

  document.addEventListener("click", (e) => {
    const button = e.target.closest(".plan-select-button");
    if (button) {
      const planName = button.getAttribute("data-plan");
      if (planName) {
        e.preventDefault();
        selecionarPlanoFormulario(planName);
        if (button.closest("#plans-modal-overlay")) {
          const modalOverlay = document.getElementById("plans-modal-overlay");
          if (modalOverlay) {
            modalOverlay.classList.remove("visible");
            setTimeout(() => modalOverlay.classList.add("hidden"), 400);
          }
        }
      }
    }
  });

  // Lógica de envio do formulário
  if (formularioBeneficio) {
    formularioBeneficio.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btnEnviar = document.getElementById("btn-enviar");
      const cro = croInput.value.trim();
      const uf = estadoSelect.value;
      const nomeCompleto = nomeCompletoInput.value.trim();
      const plano = document.getElementById("select-planos")?.value;

      let enderecosSelecionados = [];
      if (dadosCompletosDentista?.enderecos) {
        if (dadosCompletosDentista.enderecos.length === 1) {
          enderecosSelecionados.push(
            formatarEndereco(dadosCompletosDentista.enderecos[0])
          );
        } else {
          document
            .querySelectorAll('input[name="enderecos-selecionados"]:checked')
            .forEach((cb) => {
              enderecosSelecionados.push(
                formatarEndereco(
                  dadosCompletosDentista.enderecos[parseInt(cb.value)]
                )
              );
            });
        }
      }

      if (!cro || !uf || !nomeCompleto || !plano) {
        mostrarModal(
          "Por favor, preencha todos os campos obrigatórios.",
          "erro",
          "Campos Obrigatórios"
        );
        return;
      }
      if (
        dadosCompletosDentista?.enderecos?.length > 1 &&
        enderecosSelecionados.length === 0
      ) {
        mostrarModal(
          "Por favor, selecione pelo menos um endereço de clínica.",
          "erro",
          "Endereço Obrigatório"
        );
        return;
      }
      if (!nomeCompleto) {
        mostrarModal(
          "Por favor, valide seu CRO e Estado para preencher o nome.",
          "erro",
          "Validação de CRO"
        );
        return;
      }

      btnEnviar.disabled = true;
      btnEnviar.textContent = "Enviando...";

      let mensagem = `Solicitação de benefício OiAna - ${plano} - Nome: ${nomeCompleto} - CRO: ${cro}/${uf}`;
      if (enderecosSelecionados.length > 0) {
        mensagem += `\n\nEndereços das clínicas:\n${enderecosSelecionados
          .map((end, i) => `${i + 1}. ${end}`)
          .join("\n")}`;
      }

      try {
        const response = await fetch(
          "https://api.dentaluni.com.br/solicitacao-beneficio-oiana",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cro,
              uf,
              nome_completo: nomeCompleto,
              abertura: 26,
              msg: mensagem,
            }),
          }
        );
        const data = await response.json();

        if (data.error === false && data.status === true) {
          mostrarModal(
            data.retorno_app,
            "sucesso",
            "Solicitação Enviada!",
            data.atendimento.cod_ans
          );
          formularioBeneficio.reset();
          dadosCompletosDentista = null;
          nomeCompletoInput.value = "";
          enderecoContainer.style.display = "none";
          croInput.classList.remove("border-red-500");
          estadoSelect.classList.remove("border-red-500");
        } else {
          const erros = data.erros
            ? Object.values(data.erros).flat().join(" ")
            : "";
          mostrarModal(
            `${
              data.msg || "Não foi possível processar sua solicitação."
            } ${erros}`,
            "erro",
            "Erro na Solicitação"
          );
        }
      } catch (error) {
        console.error("Erro ao enviar formulário:", error);
        mostrarModal(
          "Erro de conexão. Verifique sua internet e tente novamente.",
          "erro",
          "Erro de Conexão"
        );
      } finally {
        btnEnviar.disabled = false;
        btnEnviar.textContent = "Enviar Solicitação";
      }
    });
  }

  function mostrarModal(mensagem, tipo, titulo, protocolo = null) {
    const modalOverlay = document.getElementById("response-modal-overlay");
    const modalTitle = document.getElementById("response-modal-title");
    const modalMessage = document.getElementById("response-modal-message");
    const modalIcon = document.getElementById("response-modal-icon");
    const successIcon = document.getElementById("success-icon");
    const errorIcon = document.getElementById("error-icon");
    const okButton = document.getElementById("response-modal-ok-button");

    modalTitle.textContent = titulo;
    modalMessage.innerHTML =
      protocolo && tipo === "sucesso"
        ? mensagem.replace(protocolo, `<strong>${protocolo}</strong>.`)
        : mensagem;

    const isSuccess = tipo === "sucesso";
    successIcon.classList.toggle("hidden", !isSuccess);
    errorIcon.classList.toggle("hidden", isSuccess);

    modalIcon.className = `mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4 ${
      isSuccess ? "bg-green-100" : "bg-red-100"
    }`;
    successIcon.className = `h-6 w-6 ${
      isSuccess ? "text-green-600" : "hidden"
    }`;
    errorIcon.className = `h-6 w-6 ${!isSuccess ? "text-red-600" : "hidden"}`;
    okButton.className = `inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition ${
      isSuccess
        ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
        : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
    }`;

    modalOverlay.classList.remove("hidden");
    setTimeout(() => {
      modalOverlay.classList.add("visible");
      if (isSuccess && typeof confetti === "function") {
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

  const responseModalOverlay = document.getElementById(
    "response-modal-overlay"
  );
  if (responseModalOverlay) {
    const fecharModalResposta = () => {
      responseModalOverlay.classList.remove("visible");
      setTimeout(() => {
        responseModalOverlay.classList.add("hidden");
        if (
          !document.getElementById("success-icon").classList.contains("hidden")
        ) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 400);
    };
    document
      .getElementById("response-modal-close-button")
      ?.addEventListener("click", fecharModalResposta);
    document
      .getElementById("response-modal-ok-button")
      ?.addEventListener("click", fecharModalResposta);
    responseModalOverlay.addEventListener(
      "click",
      (e) => e.target === responseModalOverlay && fecharModalResposta()
    );
    document.addEventListener(
      "keydown",
      (e) =>
        e.key === "Escape" &&
        responseModalOverlay.classList.contains("visible") &&
        fecharModalResposta()
    );
  }

  // --- Animações e outros scripts da página ---
  // (O restante do código, como menu mobile, back-to-top, animações de scroll, etc., permanece o mesmo)

  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () =>
      mobileMenu.classList.toggle("hidden")
    );
    document
      .querySelectorAll("#mobile-menu a")
      .forEach((link) =>
        link.addEventListener("click", () => mobileMenu.classList.add("hidden"))
      );
  }

  const backToTopButton = document.getElementById("back-to-top");
  if (backToTopButton) {
    window.addEventListener("scroll", () => {
      backToTopButton.classList.toggle("hidden", window.scrollY < 200);
    });
  }

  const animatedElements = document.querySelectorAll(
    ".js-scroll-animation, .anim-fade-in-left, .anim-fade-in-right, .anim-fade-in-up, .count-up"
  );
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate", "is-visible");
          if (entry.target.classList.contains("count-up"))
            animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  animatedElements.forEach((el) => observer.observe(el));

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
      element.innerText = Math.floor(progress * target).toLocaleString("pt-BR");
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.innerText = formatNumber(target);
      }
    };
    window.requestAnimationFrame(step);
  };

  const plansModalOverlay = document.getElementById("plans-modal-overlay");
  if (plansModalOverlay) {
    const closeModal = () => {
      plansModalOverlay.classList.remove("visible");
      setTimeout(() => plansModalOverlay.classList.add("hidden"), 400);
    };
    const openModal = () => {
      plansModalOverlay.classList.remove("hidden");
      setTimeout(() => {
        plansModalOverlay.classList.add("visible");
        if (typeof confetti === "function") {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            zIndex: 1001,
            colors: ["#5a425a", "#d4799e", "#ffffff", "#e08dad"],
          });
        }
      }, 20);
    };
    setTimeout(openModal, 1500);
    document
      .getElementById("modal-close-button")
      ?.addEventListener("click", closeModal);
    plansModalOverlay.addEventListener(
      "click",
      (e) => e.target === plansModalOverlay && closeModal()
    );
    document.addEventListener(
      "keydown",
      (e) =>
        e.key === "Escape" &&
        plansModalOverlay.classList.contains("visible") &&
        closeModal()
    );
  }

  const heroImg = document.getElementById("hero-img");
  const heroAnim = document.getElementById("hero-anim");
  if (heroImg && heroAnim) {
    const images = [
      "assets/images/about/agenda.png",
      "assets/images/about/guias.png",
      "assets/images/about/performance.png",
    ];
    let current = 0;
    setInterval(() => {
      heroAnim.classList.add("fade-out");
      setTimeout(() => {
        current = (current + 1) % images.length;
        heroImg.src = images[current];
        heroAnim.classList.remove("fade-out");
      }, 700);
    }, 3500);
  }
});
