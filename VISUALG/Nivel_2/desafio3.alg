algoritmo "Conversor de Juros Compostos"
 
var

    capital_i: real
    taxa_juros: real
    tempo: inteiro
    montante: real

inicio

    escreval ("Insira o Capital Inicial (R$): ")
    leia(capital_i)
    escreval ("Insira a Taxa de Juros Mensal (%): ")
    leia(taxa_juros)
    taxa_juros <- taxa_juros/100
    tempo<- 8
    
    montante<- capital_i * (1 + taxa_juros) ^ tempo

    escreva ("O valor ao final de 8 meses é: R$" + montante)

fimalgoritmo