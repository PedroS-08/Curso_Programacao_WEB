algoritmo "Software do Caixa Eletrônico"
 
var

    valor: inteiro
    nota_100: inteiro
    nota_50: inteiro
    nota_20: inteiro
    nota_10: inteiro
    nota_5: inteiro
    nota_1: inteiro

inicio

    escreval ("Digite um valor a sacar: ")
    leia(valor)
    
    nota_100<- valor / 100
    valor <- valor MOD 100

    nota_50<- valor / 50
    valor <- valor MOD 50

    nota_20<- valor / 20
    valor <- valor MOD 20

    nota_10<- valor / 10
    valor <- valor MOD 10

    nota_5<- valor / 5
    valor <- valor MOD 5

    nota_1<- valor / 1

    escreval("Notas de R$100: " + nota_100)
    escreval("Notas de R$50: " + nota_50)
    escreval("Notas de R$20: " + nota_20)
    escreval("Notas de R$10: " + nota_10)
    escreval("Notas de R$5: " + nota_5)
    escreval("Notas de R$1: " + nota_1)

fimalgoritmo