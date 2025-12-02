// ----------------- Chatbot -----------------
const botaoChat = document.getElementById("btnAbrirChatbot");
const dfMessenger = document.querySelector("df-messenger");


botaoChat.addEventListener("click", () => {
    dfMessenger.classList.toggle("aberto");
    dfMessenger.setAttribute("opened", dfMessenger.classList.contains("aberto"));
});

// ----------------- Variáveis globais -----------------
let stream = null;
let modelosCarregados = false;

// Elementos DOM
document.addEventListener("DOMContentLoaded", () => {
const abrirIA = document.getElementById('abrirIA');
const cameraModal = document.getElementById('cameraModal');
const fecharModal = document.getElementById('fecharModal');
const video = document.getElementById('video');
const tirarFoto = document.getElementById('tirarFoto');
const fotoCanvas = document.getElementById('fotoCanvas');
const modalStatus = document.getElementById('modalStatus');

// ----------------- Carregar modelos -----------------
async function carregarModelos() {
  if (modelosCarregados) return;
  modalStatus.innerText = 'Carregando modelos...';
  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/models');
    modelosCarregados = true;
    modalStatus.innerText = 'Modelos carregados.';
  } catch (err) {
    console.error('Erro carregando modelos:', err);
    modalStatus.innerText = 'Erro ao carregar modelos. Veja console.';
  }
}

// ----------------- Abrir modal e ativar câmera -----------------
abrirIA.addEventListener('click', async () => {
  cameraModal.classList.add('open');
  cameraModal.setAttribute('aria-hidden', 'false');
  modalStatus.innerText = 'Carregando...';
  await carregarModelos();

  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640 } });
    video.srcObject = stream;
    await video.play();
    modalStatus.innerText = 'Câmera ativa. Posicione seu rosto e clique em 📸';
  } catch (err) {
    console.error('Erro ao acessar a câmera:', err);
    modalStatus.innerText = 'Não foi possível acessar a câmera.';
  }
});

// ----------------- Fechar modal e parar câmera -----------------
fecharModal.addEventListener('click', () => {
  pararCamera();
  cameraModal.classList.remove('open');
  cameraModal.setAttribute('aria-hidden', 'true');
  modalStatus.innerText = 'Aguardando...';
});

// ----------------- Parar câmera -----------------
function pararCamera() {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }
  video.srcObject = null;
}

// ----------------- Tirar foto, enviar para backend e detectar emoção -----------------
tirarFoto.addEventListener('click', async () => {
  if (!video || video.readyState < 2) {
    modalStatus.innerText = 'Vídeo não pronto. Tente novamente.';
    return;
  }

  // Desenha no canvas
  fotoCanvas.width = video.videoWidth || 640;
  fotoCanvas.height = video.videoHeight || 480;
  const ctx = fotoCanvas.getContext('2d');
  ctx.drawImage(video, 0, 0, fotoCanvas.width, fotoCanvas.height);

  modalStatus.innerText = 'Enviando foto para processamento...';

  // Para a câmera e fecha modal
  pararCamera();
  cameraModal.style.display = 'none';
  cameraModal.setAttribute('aria-hidden', 'true');

  // Converte canvas em blob para envio
  fotoCanvas.toBlob(async (blob) => {
    if (!blob) {
      modalStatus.innerText = 'Erro ao capturar a foto.';
      return;
    }

    const formData = new FormData();
    formData.append('foto', blob, 'foto.png');

    try {
      const response = await fetch(`${window.location.origin}/processar-foto`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.facesEncontradas === 0) {
        modalStatus.innerText = 'Nenhuma face detectada na foto.';
        return;
      }

      // Salva imagem no sessionStorage para página de resultado
      const dataUrl = fotoCanvas.toDataURL('image/png');
      sessionStorage.setItem('ultimaFoto', dataUrl);

      // Redireciona para a página resultado com emoção e confiança
      const emocao = data.emocao || 'neutral';
      const confianca = data.confianca || 0;
      window.location.href = `resultado.html?emocao=${encodeURIComponent(emocao)}&conf=${encodeURIComponent(confianca)}`;

    } catch (err) {
      modalStatus.innerText = 'Erro ao enviar foto para o servidor.';
      console.error('Erro fetch:', err);
    }
  }, 'image/png');
});
});
    // Dados estáticos do projeto (usar/alterar conforme necessário)
    // TODO: Atualizar variáveis abaixo se quiser customizar sem editar HTML
    const projeto = {
      tema: "Animais em Extinção",
      slogan: "Salve os oceanos, preserve a vida marinha.",
      resumo: "O site apresenta informações sobre animais marinhos em extinção, mostrando as espécies ameaçadas, causas e iniciativas de preservação.",
      equipe: ["Cauã Alves Gonçalves Bernardes","Giulia Christine Silva Amorin","Julio Cesar Mariano Liberato de Sousa"]
    };

    // Inserção do ano atual no rodapé
    document.getElementById('year').textContent = new Date().getFullYear();

    // Theme toggle (modo claro/escuro)
    const body = document.body;
    const btnToggleTheme = document.getElementById('btnToggleTheme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if(prefersDark) body.classList.add('dark');

    btnToggleTheme.addEventListener('click', () => {
      const isDark = body.classList.toggle('dark');
      btnToggleTheme.setAttribute('aria-pressed', String(isDark));
      btnToggleTheme.textContent = isDark ? 'Escuro' : 'Claro';
    });

    // Accessibility: permitir fechar chatbot com Escape
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape' && asideChat.classList.contains('open')){
        abrirChatbot();
      }
    });

    // Small enhancement: smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if(href.length > 1){
          e.preventDefault();
          const el = document.querySelector(href);
          if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
        }
      });
    });

    // Keyboard navigation helpers (tab order)
    // Ensure focusable controls have visible focus (handled by CSS outline)

    // End of script
  