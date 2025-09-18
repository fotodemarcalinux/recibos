// js/auth.js

// Função para verificar login em cada página
function verificarLogin() {
    const logado = localStorage.getItem("logado");
    if (logado !== "true") {
        window.location.href = "login.html";
    }
}

// Função para efetuar login
async function login(usuario, senha) {
    try {
        const resposta = await fetch("credenciais.json");
        const dadosCript = await resposta.json();

        // 🔐 Aqui seria o processo de descriptografia do JSON
        // Para teste, vou deixar simples: usuario/senha no JSON
        const dados = JSON.parse(atob(dadosCript.credenciais));

        if (dados.usuario === usuario && dados.senha === senha) {
            localStorage.setItem("logado", "true");
            window.location.href = "index.html";
        } else {
            alert("Usuário ou senha inválidos");
        }
    } catch (e) {
        alert("Erro ao validar login");
        console.error(e);
    }
}

// Função para logout
function logout() {
    localStorage.removeItem("logado");
    window.location.href = "login.html";
}
