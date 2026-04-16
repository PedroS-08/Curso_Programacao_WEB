algoritmo "Nota do Senai"
 
var

    n_projeto: real
    n_prova: real
    peso_proj: inteiro
    peso_prova: inteiro
    media_ponderada: real

inicio

    peso_proj<- 3
    peso_prova<- 2

    escreval ("Digite a nota do Projeto Prático: ")
    leia(n_projeto)
    escreva ("Digite a nota da Prova Escrita: ")
    leia(n_prova)

    n_projeto<- n_projeto * peso_proj
    n_prova<- n_prova * peso_prova
    media_ponderada<- (n_projeto + n_prova) / (peso_proj + peso_prova)

    escreva("Nota final: " + media_ponderada)

fimalgoritmo