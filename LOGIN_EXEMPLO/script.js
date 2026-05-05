// ==========================================================================
//   LOGIN COM HTML E JS: A Transição para Orientação a Eventos
// ==========================================================================

// 1º CONCEITO NOVO: VARIÁVEIS GLOBAIS
// Tiramos as variáveis de dentro dos laços de repetição. 
// Como o código será executado uma vez a cada clique, a variável 'contador' 
// precisa ficar "do lado de fora" para não ser zerada.
let userCorreto = "admin";
let senhaCorreta = "1234";
let contador = 0;

// 2º CONCEITO NOVO: FUNÇÃO ATRELADA A UM EVENTO
// O evento do botão HTML (onsubmit) substitui o comando "repita" (while).
// O código só roda quando o usuário clica no botão Sign In.
function fazerLogin() {

    // 3º CONCEITO NOVO: LENDO DO HTML
    // Substituímos o leia() e o prompt() pelo DOM. O JavaScript "pega" 
    // o valor (.value) que o usuário digitou diretamente das caixas de texto.
    let tentativa_user = document.getElementById("login-user").value;
    let tentativa_senha = document.getElementById("login-pass").value;

    // Verificação de segurança: Se o contador chegou a 3, bloqueia a função.
    if (contador >= 3) {
        alert("🔒 Conta Bloqueada! Atualize a página.");
        return; // O comando 'return' aborta a função imediatamente.
    }

    // A cada clique no botão, aumentamos o contador de tentativas
    contador++;

    // 4º CONCEITO: A LÓGICA CONDICIONAL SE MANTÉM
    // O raciocínio (if/else) é idêntico à versão do VisuAlg!
    if (tentativa_user === userCorreto && tentativa_senha === senhaCorreta) {

        alert("Acesso Liberado! 🎉");
        contador = 0; // Zera as tentativas após o sucesso.

    } else {

        // Se errou, verificamos se ainda tem tentativas (menos que 3)
        if (contador < 3) {
            alert("Usuário ou senha incorretos! Tentativa " + contador + " de 3");
        } else {
            // Se chegou a 3, alerta e bloqueia as caixas de texto no HTML!
            alert("🔒 Conta Bloqueada por segurança! Muitas tentativas falhas.");
            document.getElementById("login-user").disabled = true;
            document.getElementById("login-pass").disabled = true;
        }

    }
}

// ==========================================================================
//   FUNÇÃO VISUAL: Alternador das abas Login e Registro
// ==========================================================================
function abaForm(type) {
    const slider = document.getElementById('slider');
    const indicator = document.getElementById('indicator');
    const btnLogin = document.getElementById('btn-login');
    const btnRegister = document.getElementById('btn-register');

    if (type === 'register') {
        slider.style.transform = 'translateX(-50%)';
        indicator.style.transform = 'translateX(100%)';
        btnRegister.classList.add('active');
        btnLogin.classList.remove('active');
    } else {
        slider.style.transform = 'translateX(0)';
        indicator.style.transform = 'translateX(0)';
        btnLogin.classList.add('active');
        btnRegister.classList.remove('active');
    }
}