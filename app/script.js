// Função para converter imagem para Base64
function converterImagemParaBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Função para gerar HTML personalizado para a empresa
async function gerarHtmlPersonalizado() {
    const nomeEmpresa = document.getElementById("nomeEmpresa").value;
    const endereco = document.getElementById("endereco").value;
    const telefone = document.getElementById("telefone").value;
    const logoFile = document.getElementById("logoUpload").files[0];
    const barcodeFile = document.getElementById("barcodeUpload").files[0];

    // Converter logo e código de barras para Base64
    const logoBase64 = await converterImagemParaBase64(logoFile);
    const barcodeBase64 = await converterImagemParaBase64(barcodeFile);

    // Conteúdo HTML do recibo offline
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${nomeEmpresa}</title>
    <style>
        body { 
            font-family: 'Arial', sans-serif; 
            background-color: #ffffff;
            margin: 0; 
            padding: 20px; 
            color: #333; 
            display: flex; 
            align-items: center; 
            flex-direction: column; 
        }
        .recibo-content { 
            max-width: 400px; 
            background-color: #ffffff;
            border: 1px solid #ffffff; 
            border-radius: 8px; 
            padding: 20px; 
            box-shadow: none;
            margin: auto; 
            text-align: left; 
        }
        .recibo-header { text-align: center; }
        .logo { width: 100px; margin-bottom: 10px; }
        .empresa-info { text-align: center; font-size: 14px; }
        .recibo-title { text-align: center; font-size: 18px; font-weight: bold; margin: 15px 0; }
        .dashed-line { border-top: 1px dashed #a0aec0; margin: 10px 0; }
        .info-title { text-align: center; font-weight: bold; text-transform: uppercase; font-size: 12px; margin-top: 20px; }
        .info-text { text-align: center; font-size: 12px; margin-top: 5px; }
        .recibo-body p { font-size: 14px; margin: 4px 0; }
        .barcode img { max-width: 100%; height: auto; display: block; margin: 0 auto; }
        form { 
            width: 100%; 
            max-width: 400px; 
            margin: 20px auto; 
            padding: 20px; 
            background: #ffffff;
            border-radius: 8px; 
            box-shadow: none;
        }
        form label { font-size: 14px; color: #4a5568; font-weight: bold; }
        form input, form textarea, form button { 
            width: 100%; 
            margin-top: 8px; 
            padding: 10px; 
            border: 1px solid #cbd5e0; 
            border-radius: 5px; 
            font-size: 14px; 
        }
        form button { 
            background-color: #3182ce; 
            color: white; 
            cursor: pointer; 
            transition: background-color 0.3s ease; 
            font-weight: bold; 
        }
        form button:hover { background-color: #2b6cb0; }
        footer { margin-top: 20px; text-align: center; font-size: 12px; color: #718096; }
        footer a { color: #48bb78; text-decoration: none; font-weight: bold; }
        .botoes-container {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            gap: 10px;
        }
        .botoes-container button {
            flex: 1;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            border: none;
            color: white;
            transition: background-color 0.3s ease;
        }
        #downloadButton {
            background-color: #3182ce;
        }
        #downloadButton:hover {
            background-color: #2b6cb0;
        }
        #whatsappButton {
            background-color: #25D366;
        }
        #whatsappButton:hover {
            background-color: #128C7E;
        }
    </style>
</head>
<body>

    <h2>${nomeEmpresa}</h2>
    <h3>Preencha os dados do recibo</h3>
    <form id="reciboForm">
        <label>Data (DD/MM/AAAA):</label>
        <input type="date" id="dataRecibo" required><br>
        <label>Recebi de:</label>
        <input type="text" id="recebiDe" required><br>
        <label>A importância de R$:</label>
        <input type="number" id="valor" required><br>
        <label>Referente a:</label>
        <textarea id="descricao" rows="2" required></textarea><br>
        <button type="button" onclick="gerarRecibo()">Gerar Recibo</button>
    </form>

    <div id="recibo" class="recibo-content" style="display: none;">
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
        <p class="info-title">INFORMAÇÕES IMPORTANTES</p>
        <p class="info-text">Em conformidade com a legislação vigente, este recibo é suficiente para comprovar a prestação de serviços e pagamentos efetuados.</p>
        <div class="barcode" style="text-align: center;">
            <img src="${barcodeBase64}" alt="Código de Barras">
        </div>
    </div>
    
    <div id="botoesRecibo" class="botoes-container" style="display: none;">
        <button id="downloadButton" onclick="downloadRecibo()">Baixar JPEG</button>
        <button id="whatsappButton" onclick="compartilharRecibo()">Compartilhar WhatsApp</button>
    </div>

    <footer>
        Desenvolvido por <a href="https://wa.me/5579998965081" target="_blank">Grupo Foto de Marca</a> | <a href="https://bit.ly/3UIbjPt" target="_blank">Termos de Uso</a> | <a href="https://bit.ly/3UHxOEp" target="_blank">Política de Privacidade</a>
    </footer>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script>
        function gerarRecibo() {
            const data = document.getElementById("dataRecibo").value;
            const recebiDe = document.getElementById("recebiDe").value;
            const valor = document.getElementById("valor").value;
            const descricao = document.getElementById("descricao").value;

            const [year, month, day] = data.split("-");
            const formattedDate = \`\${day}/\${month}/\${year}\`;

            document.getElementById("dataReciboText").textContent = "Data: " + formattedDate;
            document.getElementById("recebiDeText").textContent = recebiDe;
            document.getElementById("valorText").textContent = valor;
            document.getElementById("descricaoText").textContent = descricao;

            document.getElementById("recibo").style.display = "block";
            document.getElementById("botoesRecibo").style.display = "flex"; // Exibe a div com os dois botões
        }

        function downloadRecibo() {
            html2canvas(document.querySelector(".recibo-content")).then(canvas => {
                const link = document.createElement("a");
                link.href = canvas.toDataURL("image/jpeg");
                link.download = "recibo.jpg";
                link.click();
            });
        }

        function compartilharRecibo() {
            html2canvas(document.querySelector(".recibo-content")).then(canvas => {
                canvas.toBlob(blob => {
                    const file = new File([blob], "recibo.jpg", { type: "image/jpeg" });
                    
                    if (navigator.share) {
                        navigator.share({
                            files: [file],
                            title: 'Recibo gerado',
                            text: 'Segue seu recibo.',
                        }).catch(error => console.log('Erro no compartilhamento', error));
                    } else {
                        alert("A função de compartilhamento não está disponível neste navegador. Tente em outro dispositivo ou navegador mais atual.");
                    }
                }, "image/jpeg");
            });
        }
    </script>
</body>
</html>
    `;

    // Criar e baixar o arquivo HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById("downloadLink");
    downloadLink.href = url;
    downloadLink.download = `${nomeEmpresa.toLowerCase().replace(/ /g, "_")}.html`;
    downloadLink.style.display = "block";
    downloadLink.textContent = "Baixar HTML Personalizado";
}
