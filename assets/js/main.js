(function () {
  "use strict";

  window.onload = function () {
    window.setTimeout(fadeout, 500);
  };

  function fadeout() {
    document.querySelector(".preloader").style.opacity = "0";
    document.querySelector(".preloader").style.display = "none";
  }

  window.onscroll = function () {
    const header_navbar = document.querySelector(".navbar-area");
    const sticky = header_navbar.offsetTop;
    const logo = document.querySelector(".navbar-brand img");

    if (window.pageYOffset > sticky) {
      header_navbar.classList.add("sticky");
      logo.src = "assets/images/logo/logo-dark.png";
    } else {
      header_navbar.classList.remove("sticky");
      logo.src = "assets/images/logo/logo.png";
    }

    const backToTop = document.querySelector(".back-to-top");
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      backToTop.style.display = "flex";
    } else {
      backToTop.style.display = "none";
    }
  };

  const pageLink = document.querySelectorAll(".page-scroll");

  pageLink.forEach((elem) => {
    elem.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(elem.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
        offsetTop: 1 - 60,
      });
    });
  });

  function onScroll(event) {
    const sections = document.querySelectorAll(".page-scroll");
    const scrollPos =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;

    for (let i = 0; i < sections.length; i++) {
      const currLink = sections[i];
      const val = currLink.getAttribute("href");
      const refElement = document.querySelector(val);
      const scrollTopMinus = scrollPos + 73;
      if (
        refElement.offsetTop <= scrollTopMinus &&
        refElement.offsetTop + refElement.offsetHeight > scrollTopMinus
      ) {
        document.querySelector(".page-scroll").classList.remove("active");
        currLink.classList.add("active");
      } else {
        currLink.classList.remove("active");
      }
    }
  }

  window.document.addEventListener("scroll", onScroll);

  let navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  document.querySelectorAll(".page-scroll").forEach((e) =>
    e.addEventListener("click", () => {
      navbarToggler.classList.remove("active");
      navbarCollapse.classList.remove("show");
    })
  );
  navbarToggler.addEventListener("click", function () {
    navbarToggler.classList.toggle("active");
  });

  const myGallery = GLightbox({
    href: "https://www.youtube.com/watch?v=JaBE3u3Z3zw",
    type: "video",
    source: "youtube",
    width: 900,
    autoplayVideos: true,
  });

  const cu = new counterUp({
    start: 0,
    duration: 2000,
    intvalues: true,
    interval: 100,
    append: "k",
  });
  cu.start();

  new WOW().init();

  if (document.getElementById("particles-1"))
    particlesJS("particles-1", {
      particles: {
        number: {
          value: 40,
          density: {
            enable: !0,
            value_area: 4000,
          },
        },
        color: {
          value: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#fff",
          },
          polygon: {
            nb_sides: 5,
          },
          image: {
            src: "img/github.svg",
            width: 33,
            height: 33,
          },
        },
        opacity: {
          value: 0.15,
          random: !0,
          anim: {
            enable: !0,
            speed: 0.2,
            opacity_min: 0.15,
            sync: !1,
          },
        },
        size: {
          value: 50,
          random: !0,
          anim: {
            enable: !0,
            speed: 2,
            size_min: 5,
            sync: !1,
          },
        },
        line_linked: {
          enable: !1,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: !0,
          speed: 1,
          direction: "top",
          random: !0,
          straight: !1,
          out_mode: "out",
          bounce: !1,
          attract: {
            enable: !1,
            rotateX: 600,
            rotateY: 600,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: !1,
            mode: "bubble",
          },
          onclick: {
            enable: !1,
            mode: "repulse",
          },
          resize: !0,
        },
        modes: {
          grab: {
            distance: 400,
            line_linked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 250,
            size: 0,
            duration: 2,
            opacity: 0,
            speed: 3,
          },
          repulse: {
            distance: 400,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: !0,
    });

  if (document.getElementById("particles-2"))
    particlesJS("particles-2", {
      particles: {
        number: {
          value: 40,
          density: {
            enable: !0,
            value_area: 4000,
          },
        },
        color: {
          value: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#fff",
          },
          polygon: {
            nb_sides: 5,
          },
          image: {
            src: "img/github.svg",
            width: 33,
            height: 33,
          },
        },
        opacity: {
          value: 0.15,
          random: !0,
          anim: {
            enable: !0,
            speed: 0.2,
            opacity_min: 0.15,
            sync: !1,
          },
        },
        size: {
          value: 50,
          random: !0,
          anim: {
            enable: !0,
            speed: 2,
            size_min: 5,
            sync: !1,
          },
        },
        line_linked: {
          enable: !1,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: !0,
          speed: 1,
          direction: "top",
          random: !0,
          straight: !1,
          out_mode: "out",
          bounce: !1,
          attract: {
            enable: !1,
            rotateX: 600,
            rotateY: 600,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: !1,
            mode: "bubble",
          },
          onclick: {
            enable: !1,
            mode: "repulse",
          },
          resize: !0,
        },
        modes: {
          grab: {
            distance: 400,
            line_linked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 250,
            size: 0,
            duration: 2,
            opacity: 0,
            speed: 3,
          },
          repulse: {
            distance: 400,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: !0,
    });
})();

// Função para atualizar o valor do plano com base na seleção
function atualizarValorPlano() {
  const valorInput = document.getElementById("valor");
  const selectedValue = document.getElementById("planos").value;

  let valorPlano;
  switch (selectedValue) {
    case "1":
      valorPlano = "GRATUITO";
      break;
    case "2":
      valorPlano = "R$ 45,80 /mês";
      break;
    case "3":
      valorPlano = "R$ 119,90 /mês";
      break;
    default:
      valorPlano = "";
  }

  console.log("Valor Plano Selecionado:", valorPlano); // Verificação de depuração
  valorInput.value = valorPlano;
}

// Executa a função quando a página carrega para garantir que o valor inicial esteja correto
window.addEventListener("load", atualizarValorPlano);

// Atualiza o valor quando o usuário muda a seleção manualmente
document
  .getElementById("planos")
  .addEventListener("change", atualizarValorPlano);

// Eventos para mudar o select quando os botões são clicados
document.getElementById("dental-2").addEventListener("click", function () {
  document.querySelector('select[name="planos"]').value = "1";
  atualizarValorPlano();
});

document.getElementById("consultorio").addEventListener("click", function () {
  document.querySelector('select[name="planos"]').value = "2";
  atualizarValorPlano();
});

document.getElementById("clinicas").addEventListener("click", function () {
  document.querySelector('select[name="planos"]').value = "3";
  atualizarValorPlano();
});

// Função para mostrar o modal
function showModal() {
  const nome = document.getElementById("nome").value;
  const planos =
    document.getElementById("planos").options[
      document.getElementById("planos").selectedIndex
    ].text;
  const valor = document.getElementById("valor").value;

  // Atualiza o conteúdo do modal
  document.getElementById(
    "modal-title"
  ).textContent = `${nome}, seu benefício foi resgatado com sucesso!`;
  document.getElementById("selected-plan").textContent = planos;
  document.getElementById("selected-value").textContent = valor;

  // Exibe o modal
  document.getElementById("modal").style.display = "flex";
}

// Função para fechar o modal
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("send-button")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Impede o envio padrão do formulário

      const sendButton = document.getElementById("send-button");
      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const telefone = document.getElementById("telefone").value.trim();
      const valor = document.getElementById("valor").value.trim();
      const selectedValue = document.getElementById("planos").value.trim();

      // Determina o nome do plano com base no valor selecionado
      let selectedPlan;
      switch (selectedValue) {
        case "1":
          selectedPlan = "Plano DentalUni";
          break;
        case "2":
          selectedPlan = "Plano para consultórios";
          break;
        case "3":
          selectedPlan = "Plano para clínicas";
          break;
        default:
          selectedPlan = "";
      }

      if (!validateName(nome)) {
        showWarningModal("Aviso", "Por favor, insira um nome completo.");
      } else if (!validateEmail(email)) {
        showWarningModal("Aviso", "Por favor, insira um e-mail válido.");
      } else if (!validatePhone(telefone)) {
        showWarningModal(
          "Aviso",
          "Por favor, insira um número de telefone válido no formato (xx) xxxx-xxxx ou (xx) xxxxx-xxxx."
        );
      } else if (valor === "") {
        showWarningModal("Aviso", "Por favor, selecione um plano.");
      } else {
        // Substitui o texto "Enviar" pelo loader
        sendButton.innerHTML = '<div class="loader-btn"></div>';

        // Envia os dados via fetch
        fetch("https://api.sheetmonkey.io/form/s1iusZgBY9n2D9E9qxXxcj", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: nome,
            email: email,
            telefone: telefone,
            plano: selectedPlan,
            valor: valor,
          }),
        })
          .then((response) => response.text()) // Lê a resposta como texto
          .then((text) => {
            showConfirmationModal(nome, selectedPlan, valor); // Exibe o modal de confirmação
            resetSendButton(); // Restaura o botão "Enviar"
          })
          .catch((error) => {
            console.error("Erro ao enviar dados:", error);
            showConfirmationModal(nome, selectedPlan, valor); // Exibe o modal de confirmação mesmo em caso de erro
            resetSendButton(); // Restaura o botão "Enviar"
          });
      }
    });

  function showConfirmationModal(nome, selectedPlan, valor) {
    const modalTitle = document.getElementById("modal-title");
    const selectedPlanElement = document.getElementById("selected-plan");
    const requestDateElement = document.getElementById("request-date");
    const selectedValueElement = document.getElementById("selected-value");

    if (
      modalTitle &&
      selectedPlanElement &&
      requestDateElement &&
      selectedValueElement
    ) {
      modalTitle.textContent = `${nome}, seu formulário foi enviado com sucesso!`;
      selectedPlanElement.textContent = `Plano selecionado: ${selectedPlan}`;
      requestDateElement.textContent = new Date().toLocaleDateString(); // Data atual
      selectedValueElement.textContent = valor;
      document.getElementById("modal").style.display = "flex";
    } else {
      console.error("Elementos do modal de confirmação não encontrados.");
    }
  }

  function resetSendButton() {
    const sendButton = document.getElementById("send-button");
    sendButton.innerHTML = "Enviar";
  }

  function showWarningModal(title, message) {
    const warningTitle = document.getElementById("warning-title");
    const warningMessage = document.getElementById("warning-message");

    if (warningTitle && warningMessage) {
      warningTitle.innerText = title;
      warningMessage.innerText = message;
      document.getElementById("warning-modal").style.display = "flex";
    } else {
      console.error("Elementos do modal de aviso não encontrados.");
    }
  }

  function closeWarningModal(event) {
    if (event) {
      event.preventDefault();
    }
    document.getElementById("warning-modal").style.display = "none";
  }

  function closeModal(event) {
    if (event) {
      event.preventDefault();
    }
    document.getElementById("modal").style.display = "none";
  }

  function validateName(name) {
    return name.split(" ").length >= 2;
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone) {
    const re = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    return re.test(phone);
  }

  function formatPhoneNumber(value) {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 10) {
      return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
    } else {
      return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    }
  }

  document
    .getElementById("telefone")
    .addEventListener("input", function (event) {
      event.target.value = formatPhoneNumber(event.target.value);
    });

  document
    .getElementById("telefone")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
      }
    });

  document
    .getElementById("subscribe-form")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
      }
    });
});

function showConfirmationModal(nome, selectedPlan, valor) {
  const modalTitle = document.getElementById("modal-title");
  const selectedPlanElement = document.getElementById("selected-plan");
  const requestDateElement = document.getElementById("request-date");
  const selectedValueElement = document.getElementById("selected-value");

  if (
    modalTitle &&
    selectedPlanElement &&
    requestDateElement &&
    selectedValueElement
  ) {
    modalTitle.textContent = `${nome}, seu formulário foi enviado com sucesso!`;
    selectedPlanElement.textContent = `Plano selecionado: ${selectedPlan}`;
    requestDateElement.textContent = new Date().toLocaleDateString(); // Data atual
    selectedValueElement.textContent = valor;
    document.getElementById("modal").style.display = "flex";
  } else {
    console.error("Elementos do modal de confirmação não encontrados.");
  }
}

function contactViaWhatsApp() {
  const nome = document.getElementById("nome").value.trim();
  const message = `Olá, sou ${nome}, preenchi o formulário no site e resolvi entrar em contato!`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/5541991917792?text=${encodedMessage}`;
  window.open(whatsappURL, "_blank");
}

function showWarningModal(title, message) {
  document.getElementById("warning-title").innerText = title;
  document.getElementById("warning-message").innerText = message;
  document.getElementById("warning-modal").style.display = "flex";
}

function closeWarningModal(event) {
  if (event) {
    event.preventDefault();
  }
  document.getElementById("warning-modal").style.display = "none";
}

function closeConfirmationModal(event) {
  if (event) {
    event.preventDefault();
  }
  document.getElementById("modal").style.display = "none";
}
