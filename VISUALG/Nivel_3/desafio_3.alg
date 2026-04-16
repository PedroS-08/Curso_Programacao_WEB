algoritmo "Sistema de Login"

var

    usuario: caractere
    senha: caractere
    tentativas: inteiro
    login: logico

inicio

    tentativas<-5
    login<-falso
    escreval("===° Sistema de Login °===")
    repita
        escreval ("Digite seu nome de usuário: ")
        leia(usuario)
        escreval ("Digite sua senha: ")
        leia(senha)
        se (usuario <> "admin") ou (senha <> "senai123") entao
            escreval ("⚠️ Erro: Credenciais inválidas, tente novamente!")
            tentativas <- tentativas - 1
            escreval(tentativas, " tentativas restantes!")
        fimse
    ate (usuario = "admin") e (senha = "senai123") ou tentativas = 0
    escreval ("✅ ACESSO LIBERADO: Bem vindo " + usuario, "!")
    login <- verdadeiro
    se login = falso entao
        escreval("❌ ERRO: ACESSO BLOQUEADO")
    fimse

fimalgoritmo