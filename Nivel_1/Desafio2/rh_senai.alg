algoritmo "Sistema de RH - SENAI"

var

    nome: caractere
    idade: caractere
    email: caractere
    valor_ba: real
    exp_previa: logico 

inicio

    escreval("___ Cadastro de Dados ___")
    escreval ("Digite seu nome completo: ")
    leia(nome)
    escreval ("Insira sua idade: ")
    leia(idade)
    escreval ("Digite seu e-mail: ")
    leia(email)
    escreval ("Insira o valor da Bolsa Auxílio: ")
    leia(valor_ba)
    escreval ("Possui experiência prévia? [Verdadeiro/Falso]: ")
    leia(exp_previa)

    escreval("-" * 15)
    escreval("RELATÓRIO")
    escreval("-" * 15)
    escreval("Dados do Estagiário")
    escreval("=" * 60)
    escreval("Nome: " + nome, "  -  Idade: " + idade)
    escreval("_" * 40)
    escreval("E-mail: " + email)
    escreval("=" * 60)
    escreval("Valor da Bolsa Auxílio: R$" + valor_ba)
    escreval("_" * 40)
    escreval("Experiência prévia: " + exp_previa)
    escreva("_" * 40)

fimalgoritmo