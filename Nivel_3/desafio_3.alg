algoritmo "Sistema de Login"

var

    usuario: caractere
    senha: caractere

inicio

    escreval("===° Sistema de Login °===")
    escreval ("Digite seu nome de usuário: ")
    leia(usuario)
    escreval ("Digite sua senha: ")
    leia(senha)
    se (usuario = "admin") e (senha = "senai123") entao
        escreval ("✅ ACESSO LIBERADO: Usuário " + usuario, "!")
    senao
        escreval ("❌ Erro: Credenciais inválidas")
    fimse

fimalgoritmo