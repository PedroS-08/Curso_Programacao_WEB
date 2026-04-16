algoritmo "Exemplo repita senha"

var

    senha_dig: caractere
    tentativas: inteiro

inicio

    tentativas <- 0

    repita
        escreval("Digite a senha de acesso: ")
        leia(senha_dig)

        tentativas <- tentativas + 1
        se (senha_dig <> "1234") entao
            escreval ("Senha incorreta. Tente novamente")
        fimse    
    ate verdadeiro
fimalgoritmo