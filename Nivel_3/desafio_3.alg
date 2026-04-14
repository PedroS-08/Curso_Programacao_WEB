algoritmo "Sistema de Login"

var

    usuario: caractere
    senha: caractere

inicio

    tentativas<-5
    login<-falso
    escreval("===° Sistema de Login °===")
    enquanto (tentativas>0 e login = falso) faca
        escreval ("Digite seu nome de usuário: ")
        leia(usuario)
        escreval ("Digite sua senha: ")
        leia(senha)
        se (usuario = "admin") e (senha = "senai123") entao
            escreval ("✅ ACESSO LIBERADO: Usuário " + usuario, "!")
            tentativas <- 0
            login <- verdadeiro

        senao
            escreval ("⚠️ Erro: Credenciais inválidas, tente novamente!")
            tentativas <- tentativas - 1
            escreval(tentativas, " tentativas restantes!")
        fimse
    fimenquanto
    se login = falso entao
        escreval("❌ ERRO: ACESSO BLOQUEADO")
    fimse
fimalgoritmo
