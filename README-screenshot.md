# 📸 Gerador de Screenshot - Site OiAna

Este script automatiza a captura de screenshots do site OiAna usando Puppeteer.

## 🚀 Como usar

### 1. Instalar dependências
```bash
npm install
```

### 2. Executar o script
```bash
npm run screenshot
```

## 📋 O que o script faz

- ✅ Captura screenshot completo da página (`oiana-website-screenshot.png`)
- ✅ Captura screenshot apenas da seção hero (`oiana-website-hero.png`)
- ✅ Remove animações CSS para screenshot limpo
- ✅ Usa resolução desktop (1920x1080)
- ✅ Qualidade máxima (PNG 100%)

## 📁 Arquivos gerados

- `oiana-website-screenshot.png` - Página completa
- `oiana-website-hero.png` - Apenas a primeira seção

## 🔧 Personalização

Você pode editar o arquivo `screenshot.js` para:
- Alterar resolução
- Mudar formato de saída
- Capturar seções específicas
- Adicionar marca d'água

## 🌐 Alternativas Online

Se preferir não instalar nada:
- [htmlcsstoimage.com](https://htmlcsstoimage.com)
- [urltoimage.com](https://urltoimage.com)
- [screenshot.guru](https://screenshot.guru)

## 📱 Screenshots Mobile

Para capturar versão mobile, altere o viewport no script:
```javascript
await page.setViewport({
  width: 375,
  height: 667,
  deviceScaleFactor: 2,
});
``` 