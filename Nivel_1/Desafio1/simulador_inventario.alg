algoritmo "Simulador de Inventário"

var

    item: caractere

inicio

    escreval ("___ Inventário do Usuário ___")
    escreval("Digite o nome do primeiro item: ")
    leia(item)
    escreval ("Item 1 registrado: " + item)
    escreval("_" * 40)
    escreval("Insira o nome do segundo item: ")
    leia(item)

    item <- item

    escreval("=" * 40)
    escreval("Item 1 descartado. Item 2 registrado com sucesso: " + item)

    item <- "Vazio"

    escreva("Inventário resetado. Valor atual: " + item)

fimalgoritmo