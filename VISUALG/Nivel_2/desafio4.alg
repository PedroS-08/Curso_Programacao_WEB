algoritmo "Relógio do Servidor"
 
var

    tempo: inteiro
    horas: inteiro
    minutos: inteiro
    segundos: inteiro
inicio

    escreval ("Digite o tempo total em segundos: ")
    leia(tempo)

    horas<- tempo/3600
    minutos<- (tempo MOD 3600) /60
    segundos<- (tempo MOD 3600) MOD 60
    escreval ("Tempo final: " + horas, "H " + minutos, "m " + segundos, "s")

fimalgoritmo