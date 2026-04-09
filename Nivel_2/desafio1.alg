algoritmo "O construtor de Data Centers"

var

    largura: real
    comprimento: real
    area: real
    perimetro: real

inicio

    escreval("Digite a largura da sala em metros: ")
    leia(largura)
    escreval ("Largura: " + largura, "m")
    escreval("-" * 50)
    escreval("Digite o comprimento da sala em metros: ")
    leia(comprimento)
    escreval("Comprimento: " + comprimento, "m")
    escreval("-" * 50)
    
    area<- largura * comprimento
    perimetro<- 2 * (largura + comprimento)

    escreval("Área total da sala: " + area, "m")
    escreval("Perímetro da sala: " + perimetro, "m")

fimalgoritmo