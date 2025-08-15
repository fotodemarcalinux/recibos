// Função para converter imagem para Base64
function converterImagemParaBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Utilitário de data (DD/MM/AAAA)
function formatarDataBR(d){
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
function somarDias(dias){
  const base = new Date();
  base.setHours(0,0,0,0);
  base.setDate(base.getDate() + dias);
  return base;
}

// Função para gerar HTML personalizado para a empresa
async function gerarHtmlPersonalizado() {
  const nomeEmpresa = document.getElementById("nomeEmpresa").value;
  const endereco = document.getElementById("endereco").value;
  const telefone = document.getElementById("telefone").value;
  
  const validade = document.getElementById("validade").value;
  const dataContratacao = new Date();
  let dataExpiracao = "";
  let diasValidade = 0;
  if (validade) {
      
      let unidade = validade.slice(-1);
      let quantidade = parseInt(validade);
      let expDate = new Date(dataContratacao);
      if (unidade === 'm') {
          expDate.setMinutes(expDate.getMinutes() + quantidade);
      } else if (unidade === 'h') {
          expDate.setHours(expDate.getHours() + quantidade);
      } else if (unidade === 'd') {
          expDate.setDate(expDate.getDate() + quantidade);
      }
      dataExpiracao = expDate.toLocaleDateString("pt-BR") + (unidade !== 'd' ? ' ' + expDate.toLocaleTimeString("pt-BR", {hour: '2-digit', minute: '2-digit'}) : '');

  }
  const dataContratacaoStr = dataContratacao.toLocaleDateString("pt-BR");
  
  const logoFile = document.getElementById("logoUpload").files[0];
  const barcodeFile = document.getElementById("barcodeUpload").files[0];
  const jn2m3aLogoFile = document.getElementById("jn2m3aLogoUpload").files[0];

  // Converter imagens para Base64
  const logoBase64 = await converterImagemParaBase64(logoFile);
  const barcodeBase64 = await converterImagemParaBase64(barcodeFile);
  const jn2m3aLogoBase64 = await converterImagemParaBase64(jn2m3aLogoFile);

  // Conteúdo HTML da PÁGINA DO USUÁRIO (offline) — sem painel de validade
  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${nomeEmpresa}</title>
  <style>
    :root{
      --ink:#1f2937;
      --muted:#6b7280;
      --line:#e5e7eb;
      --brand:#0ea5e9;
    }
    body{
      font-family: Arial, Helvetica, sans-serif;
      background:#ffffff; color:var(--ink);
      margin:0; padding:20px;
      display:flex; flex-direction:column; align-items:center;
    }
    .top-title{text-align:center; margin:4px 0 12px 0;}
    .top-title .top-logo{ width:110px; height:auto; display:block; margin:0 auto 6px; }
    h2.page-title{ margin:0; font-size:22px; }
    h3{ margin:8px 0 12px; font-size:16px; color:var(--muted); font-weight:600; }
    .datas-servico{
      width:100%; max-width:420px; background:#fff;
      border:1px dashed var(--line); border-radius:10px;
      padding:12px; margin:10px auto; text-align:center; font-size:14px;
    }
    .datas-servico strong{ display:inline-block; min-width:130px; text-align:right; margin-right:8px; }
    form#reciboForm{
      width:100%; max-width:420px; background:#fff;
      border:1px dashed var(--line); border-radius:10px;
      padding:14px; margin:10px auto;
    }
    label{display:block; font-weight:700; font-size:14px; margin:10px 0 6px}
    input[type="text"], input[type="date"], input[type="number"], textarea, select{
      width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;
    }
    button{ background:#0ea5e9; color:#fff; border:none; border-radius:10px; padding:10px 12px; font-weight:700; cursor:pointer; width:100%; }
    button:hover{ background:#0284c7; }
    .recibo-content{
      max-width:420px; background:#fff; border:1px solid #ffffff; border-radius:10px;
      padding:20px; box-shadow:none; margin:auto; text-align:left;
    }
    .recibo-header{text-align:center}
    .logo{ width:100px; margin-bottom:10px; }
    .empresa-info{text-align:center; font-size:14px}
    .recibo-title{text-align:center; font-size:18px; font-weight:700; margin:15px 0}
    .dashed-line{ border-top:1px dashed #a0aec0; margin:10px 0 }
    .recibo-body p{ font-size:14px; margin:4px 0 }
    .barcode img{ max-width:100%; height:auto; display:block; margin:0 auto }
    .barcode-credit{ text-align:center; font-size:11px; opacity:.7; margin-top:4px }
    .botoes-container{ display:flex; justify-content:space-between; margin-top:20px; gap:10px; }
    .botoes-container button{ flex:1; padding:10px 20px; font-size:16px; border-radius:5px; cursor:pointer; border:none; color:#fff }
    #downloadButton{ background:#3182ce }
    #downloadButton:hover{ background:#2b6cb0 }
    #whatsappButton{ background:#25D366 }
    #whatsappButton:hover{ background:#128C7E }
    footer.page-footer{
      margin-top: 24px; text-align:center; font-size:12px; color:var(--muted);
    }
    footer.page-footer img.footer-logo{
      height:22px; width:auto; display:block; margin: 0 auto 6px;
    }
    /* Tela de bloqueio quando expira */
    .overlay-bloqueio{
      position:fixed; inset:0; background:#fff; color:#111827;
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      padding:24px; text-align:center;
    }
    .overlay-bloqueio h1{ font-size:22px; margin:0 0 8px 0; }
    .overlay-bloqueio p{ margin:6px 0; }
    .overlay-bloqueio button{
      width:auto; padding:10px 16px; border-radius:10px; margin-top:12px;
      background:#0ea5e9; color:#fff; border:none; cursor:pointer; font-weight:700;
    }
    .overlay-bloqueio button:hover{ background:#0284c7; }
  </style>
</head>
<body>
  <!-- LOGO DA EMPRESA ACIMA DO TÍTULO (duplicada em Base64) -->
  <div class="top-title">
    <img src="${logoBase64}" alt="Logo da Empresa" class="top-logo">
    <h2 class="page-title">${nomeEmpresa}</h2>
  </div>

  <!-- Datas do serviço (apenas exibição) -->
  <div class="datas-servico">
    <div><strong>Contratado em:</strong> <span>${dataContratacaoStr}</span></div>
    <div><strong>Expiração:</strong> <span>${dataExpiracao ? dataExpiracao : "Sem expiração"}</span></div>
  </div>

  <h3>Preencha os dados do recibo</h3>
  <form id="reciboForm">
    <label>Data (DD/MM/AAAA):</label>
    <input type="date" id="dataRecibo" required><br>
    <label>Recebi de:</label>
    <input type="text" id="recebiDe" required><br>
    <label>A importância de R$:</label>
    <input type="number" id="valor" required step="0.01" min="0"><br>
    <label>Referente a:</label>
    <textarea id="descricao" rows="2" required></textarea><br>
    <button type="button" onclick="gerarRecibo()">Gerar Recibo</button>
  </form>

  <!-- CANVAS DO RECIBO (conteúdo que será compartilhado) -->
  <div id="recibo" class="recibo-content" style="display:none;">
    <div class="recibo-header">
      <img src="${logoBase64}" alt="Logo da Empresa" class="logo">
      <div class="empresa-info">
        <strong style="text-transform: uppercase;">${nomeEmpresa}</strong><br>
        ${endereco}<br>
        <strong>FONE:</strong> <strong>${telefone}</strong>
      </div>
    </div>
    <h2 class="recibo-title">RECIBO</h2>
    <div class="dashed-line"></div>
    <p id="dataReciboText">Data: </p>
    <div class="dashed-line"></div>
    <div class="recibo-body">
      <p><strong>Recebi de:</strong> <span id="recebiDeText"></span></p>
      <p><strong>A importância de R$:</strong> <span id="valorText"></span></p>
      <p><strong>Referente a:</strong> <span id="descricaoText"></span></p>
      <div class="dashed-line"></div>
    </div>
    <p class="info-title" style="text-align:center; font-weight:700; text-transform:uppercase; font-size:12px; margin-top:20px;">INFORMAÇÕES IMPORTANTES</p>
    <p class="info-text" style="text-align:center; font-size:12px; margin-top:5px;">Em conformidade com a legislação vigente, este recibo é suficiente para comprovar a prestação de serviços e pagamentos efetuados.</p>

    <div class="barcode" style="text-align:center;">
      <img src="${barcodeBase64}" alt="Código de Barras">
      <div class="barcode-credit">Desenvolvido por © JN2M3A DIGITAL.</div>
    </div>
  </div>

  <!-- Botões (fora do recibo) -->
  <div id="botoesRecibo" class="botoes-container" style="display:none;">
    <button id="downloadButton" onclick="downloadRecibo()">Baixar JPEG</button>
    <button id="whatsappButton" onclick="compartilharRecibo()">Compartilhar WhatsApp</button>
  </div>

  <!-- Rodapé da página do usuário com logo JN2M3A DIGITAL em Base64 -->
  <footer class="page-footer">
    <img class="footer-logo" src="${jn2m3aLogoBase64}" alt="JN2M3A DIGITAL" />
    <div>Uma marca do Grupo Foto de Marca</div>
    <div>WhatsApp (79) 99896-5081</div>
    <div>© 2024 JN2M3A DIGITAL. Desenvolvendo soluções que facilitam o seu dia a dia.</div>
    <div style="margin-top: 10px; font-size: 11px;">
      <a href="https://rec.sou.net.br/termo_de_uso.html" target="_blank" style="color: var(--muted); text-decoration: none;">Termos de Uso</a> | 
      <a href="https://rec.sou.net.br/faq" target="_blank" style="color: var(--muted); text-decoration: none;">Perguntas Frequentes</a>
    </div>
  </footer>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <script>
    function gerarRecibo(){
      const data = document.getElementById('dataRecibo').value;
      const recebiDe = document.getElementById('recebiDe').value;
      const valor = document.getElementById('valor').value;
      const descricao = document.getElementById('descricao').value;

      if(!data || !recebiDe || !valor || !descricao){
        alert('Preencha todos os campos do recibo.');
        return;
      }

      const [year, month, day] = data.split('-');
      const formattedDate = \`\${day}/\${month}/\${year}\`;

      document.getElementById('dataReciboText').textContent = 'Data: ' + formattedDate;
      document.getElementById('recebiDeText').textContent = recebiDe;
      document.getElementById('valorText').textContent = Number(valor).toFixed(2).replace('.', ',');
      document.getElementById('descricaoText').textContent = descricao;

      document.getElementById('recibo').style.display = 'block';
      document.getElementById('botoesRecibo').style.display = 'flex';
    }

    function downloadRecibo(){
      html2canvas(document.querySelector('.recibo-content')).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg');
        link.download = 'recibo.jpg';
        link.click();
      });
    }

    function compartilharRecibo(){
      html2canvas(document.querySelector('.recibo-content')).then(canvas => {
        canvas.toBlob(blob => {
          const file = new File([blob], 'recibo.jpg', { type: 'image/jpeg' });
          if(navigator.share){
            navigator.share({ files:[file], title:'Recibo gerado', text:'Segue seu recibo.' })
              .catch(err => console.log('Erro no compartilhamento', err));
          }else{
            alert('A função de compartilhamento não está disponível neste navegador. Tente em outro dispositivo ou navegador mais atual.');
          }
        }, 'image/jpeg');
      });
    }

    // Bloqueio por expiração (se houver validade)
    (function(){
      const validadeValor = "${validade}";
      let validadeMs = 0;
      if (validadeValor) {
          let unidade = validadeValor.slice(-1);
          let quantidade = parseInt(validadeValor);
          if (unidade === 'm') validadeMs = quantidade * 60 * 1000;
          else if (unidade === 'h') validadeMs = quantidade * 60 * 60 * 1000;
          else if (unidade === 'd') validadeMs = quantidade * 24 * 60 * 60 * 1000;
      }
    
      const dataContratacao = new Date("${dataContratacao.toISOString()}");
      if(validadeMs > 0){
        const expira = new Date(dataContratacao.getTime() + validadeMs);
        const agora = new Date();

        function mostrarTelaExpirada(){
          document.body.innerHTML = \`
            <div class="overlay-bloqueio" style="background:#f9fafb; font-family:Arial, sans-serif; text-align:center;">
              <img src="${jn2m3aLogoBase64}" alt="JN2M3A DIGITAL" style="max-width:150px; margin-bottom:20px;">
              <h1 style="color:#dc2626; font-size:26px; margin-bottom:10px;">Sua Assinatura Expirou!</h1>
              <p style="font-size:16px; color:#374151; max-width:400px; margin:0 auto 20px;">
                Seu acesso a esta página terminou.<br>
                Para continuar utilizando, por favor, renove sua assinatura.
              </p>
              <button onclick="window.location.href='https://wa.me/5579998965081'"
                style="background:linear-gradient(90deg,#16a34a,#22c55e); color:white; font-size:18px; padding:12px 24px; border:none; border-radius:8px; cursor:pointer; font-weight:bold; box-shadow:0 4px 6px rgba(0,0,0,0.1);">
                📲 Renovar Assinatura
              </button>
              <div style="margin-top:30px; font-size:12px; color:#6b7280;">
                <p>Uma marca do Grupo Foto de Marca</p>
                <p>WhatsApp (79) 99896-5081</p>
                <p>© 2024 JN2M3A DIGITAL. Desenvolvendo soluções que facilitam o seu dia a dia.</p>
                <p style="margin-top: 10px;">
                  <a href="https://rec.sou.net.br/termo_de_uso.html" target="_blank" style="color: #6b7280; text-decoration: none;">Termos de Uso</a> | 
                  <a href="https://rec.sou.net.br/faq" target="_blank" style="color: #6b7280; text-decoration: none;">Perguntas Frequentes</a>
                </p>
              </div>
            </div>
          \`;
        }

        if(agora >= expira){
          mostrarTelaExpirada();
        } else {
          setTimeout(mostrarTelaExpirada, expira.getTime() - agora.getTime());
        }
      }
    })();
  </script>
</body>
</html>
  `;

  // Criar e baixar o arquivo HTML (link na página do gerador)
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.getElementById('downloadLink');
  downloadLink.href = url;
  downloadLink.download = `${nomeEmpresa.toLowerCase().replace(/ /g, "_")}.html`;
  downloadLink.style.display = 'block';
  downloadLink.textContent = 'Baixar HTML Personalizado';
}
