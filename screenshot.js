const puppeteer = require('puppeteer');
const path = require('path');

async function captureWebsiteScreenshot() {
  try {
    // Lança o navegador
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Define o viewport para desktop
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    // Caminho absoluto para o arquivo HTML
    const htmlPath = path.join(__dirname, 'index.html');
    const fileUrl = `file://${htmlPath}`;
    
    console.log('Carregando página:', fileUrl);
    
    // Navega para o arquivo HTML local
    await page.goto(fileUrl, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000
    });
    
    // Aguarda um pouco para garantir que todas as animações terminaram
    await page.waitForTimeout(3000);
    
    // Remove animações CSS que podem interferir
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
        .opacity-0 { opacity: 1 !important; }
      `
    });
    
    // Captura screenshot da página completa
    await page.screenshot({
      path: 'oiana-website-screenshot.png',
      fullPage: true,
      quality: 100,
      type: 'png'
    });
    
    console.log('✅ Screenshot salva como: oiana-website-screenshot.png');
    
    // Captura também uma versão em formato "above the fold" (primeira dobra)
    await page.screenshot({
      path: 'oiana-website-hero.png',
      clip: {
        x: 0,
        y: 0,
        width: 1920,
        height: 1080
      },
      quality: 100,
      type: 'png'
    });
    
    console.log('✅ Screenshot do hero salva como: oiana-website-hero.png');
    
    await browser.close();
    
  } catch (error) {
    console.error('❌ Erro ao capturar screenshot:', error);
  }
}

// Executa a função
captureWebsiteScreenshot(); 