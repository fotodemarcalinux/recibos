<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerador de Link para WhatsApp</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f0f2f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }

        .container {
            background-color: #fff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 600px;
            text-align: center;
        }

        h1 {
            color: #1a1a1a;
            margin-bottom: 20px;
            font-size: 2em;
        }

        p {
            color: #555;
            margin-bottom: 30px;
            line-height: 1.5;
        }

        .form-group {
            text-align: left;
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
        }

        input[type="tel"], textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-sizing: border-box;
            font-size: 1em;
            transition: border-color 0.3s;
        }

        input[type="tel"]:focus, textarea:focus {
            outline: none;
            border-color: #075E54;
            box-shadow: 0 0 0 2px rgba(7, 94, 84, 0.2);
        }

        textarea {
            min-height: 120px;
            resize: vertical;
        }

        .info-text {
            font-size: 0.85em;
            color: #777;
            margin-top: 5px;
        }

        button {
            width: 100%;
            padding: 15px;
            background-color: #25D366;
            color: #fff;
            font-size: 1.1em;
            font-weight: bold;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.1s ease;
        }

        button:hover {
            background-color: #128C7E;
        }

        button:active {
            transform: scale(0.99);
        }

        .result-container {
            margin-top: 30px;
            padding: 20px;
            background-color: #e9f5e9;
            border-radius: 8px;
            text-align: left;
            display: none; /* Esconde o resultado inicialmente */
            word-break: break-all;
        }

        #result-link {
            font-family: monospace;
            font-size: 1.1em;
            color: #075E54;
        }
    </style>
</head>
<body>

<div class="container">
    <h1>Gerador de Link para WhatsApp</h1>
    <p>Preencha os campos abaixo para criar seu link personalizado com uma mensagem pré-definida.</p>

    <div class="form-group">
        <label for="phone-number">Número de Telefone</label>
        <input type="tel" id="phone-number" placeholder="Ex: 5541999998888">
        <div class="info-text">Inclua o código do país (55) e o DDD, sem espaços ou caracteres especiais.</div>
    </div>

    <div class="form-group">
        <label for="message">Mensagem Personalizada (Opcional)</label>
        <textarea id="message" placeholder="Olá! Gostaria de mais informações."></textarea>
        <div class="info-text">Essa mensagem será pré-preenchida para quem clicar no seu link.</div>
    </div>

    <button onclick="generateLink()">Gerar Link</button>

    <div class="result-container" id="result-container">
        <label>Seu Link:</label>
        <p id="result-link"></p>
    </div>
</div>

<script>
    function generateLink() {
        const phoneNumber = document.getElementById('phone-number').value.replace(/\D/g, ''); // Remove caracteres não numéricos
        const message = document.getElementById('message').value;
        const resultContainer = document.getElementById('result-container');
        const resultLink = document.getElementById('result-link');

        if (phoneNumber.length < 10) {
            alert('Por favor, insira um número de telefone válido (código do país + DDD + número).');
            return;
        }

        let whatsappURL = `https://wa.me/${phoneNumber}`;

        if (message) {
            const encodedMessage = encodeURIComponent(message);
            whatsappURL += `?text=${encodedMessage}`;
        }

        resultLink.textContent = whatsappURL;
        resultContainer.style.display = 'block';
    }
</script>

</body>
</html>
