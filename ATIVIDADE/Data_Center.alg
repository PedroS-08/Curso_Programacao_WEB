algoritmo "Travessia Data Center"

var

    A, B, C, D: caractere
    tempo: inteiro
    t_total: inteiro
    tec1, tec2: caractere

inicio

A <- "Corredor"
B <- "Corredor"
C <- "Corredor"
D <- "Corredor"
t_total <- 0

escreval("Travessia para a sala de servidores")
escreval("-" * 40)
escreval("Tempo gasto por técnico: ")
escreval("Alice(A): 1 min")
escreval("Bruno(B): 2 min")
escreval("Carlos(C): 5 min")
escreval("Diana(D): 10 min")
escreval("Objetivo: Completar a travessia em 17 min")
escreval("-" * 50)

repita

    escreval("Tempo gasto: ", t_total)
    escreval("Digite 2 técnicos")
    
    escreval("Técnico 1: ")
    leia(tec1)
    
    escreval("Técnico 2: ")
    leia(tec2)
    se tec2 <> "A" e tec2 <> "B" e tec2 <> "C" e tec2 <> "D" entao
        tec2 <- ""
    fimse

    se tec1 = tec2 e tec2 <> "" entao
        escreval("Erro: escolha dois técnicos diferentes!")
    senao
        tempo <- 0

        // Define o maior tempo entre os dois técnicos
        se tec1 = "A" entao
            se tempo < 1 entao
                tempo <- 1
            fimse
        fimse

        se tec1 = "B" entao
            se tempo < 2 entao
                tempo <- 2
            fimse
        fimse

        se tec1 = "C" entao
            se tempo < 5 entao
                tempo <- 5
            fimse
        fimse

        se tec1 = "D" entao
            se tempo < 10 entao
                tempo <- 10
            fimse
        fimse

        se tec2 = "A" entao
            se tempo < 1 entao
                tempo <- 1
            fimse
        fimse

        se tec2 = "B" entao
            se tempo < 2 entao
                tempo <- 2
            fimse
        fimse

        se tec2 = "C" entao
            se tempo < 5 entao
                tempo <- 5
            fimse
        fimse

        se tec2 = "D" entao
            se tempo < 10 entao
                tempo <- 10
            fimse
        fimse

        // Movimenta técnico 1
        se tec1 = "A" entao
            se A = "Corredor" entao
                A <- "Sala de servidores"
                escreval("Alice foi para a ", A)
            senao
                A <- "Corredor"
                escreval("Alice voltou ao ", A)
            fimse
        fimse

        se tec1 = "B" entao
            se B = "Corredor" entao
                B <- "Sala de servidores"
                escreval("Bruno foi para a ", B)
            senao
                B <- "Corredor"
                escreval("Bruno voltou ao ", B)
            fimse
        fimse

        se tec1 = "C" entao
            se C = "Corredor" entao
                C <- "Sala de servidores"
                escreval("Carlos foi para a ", C)
            senao
                C <- "Corredor"
                escreval("Carlos voltou ao ", C)
            fimse
        fimse

        se tec1 = "D" entao
            se D = "Corredor" entao
                D <- "Sala de servidores"
                escreval("Diana foi para a ", D)
            senao
                D <- "Corredor"
                escreval("Diana voltou ao ", D)
            fimse
        fimse

        // Movimenta técnico 2
        se tec2 = "A" entao
            se A = "Corredor" entao
                A <- "Sala de servidores"
                escreval("Alice foi para a ", A)
            senao
                A <- "Corredor"
                escreval("Alice voltou ao ", A)
            fimse
        fimse

        se tec2 = "B" entao
            se B = "Corredor" entao
                B <- "Sala de servidores"
                escreval("Bruno foi para a ", B)
            senao
                B <- "Corredor"
                escreval("Bruno voltou ao ", B)
            fimse
        fimse

        se tec2 = "C" entao
            se C = "Corredor" entao
                C <- "Sala de servidores"
                escreval("Carlos foi para a ", C)
            senao
                C <- "Corredor"
                escreval("Carlos voltou ao ", C)
            fimse
        fimse

        se tec2 = "D" entao
            se D = "Corredor" entao
                D <- "Sala de servidores"
                escreval("Diana foi para a ", D)
            senao
                D <- "Corredor"
                escreval("Diana voltou ao ", D)
            fimse
        fimse

        t_total <- t_total + tempo

        escreval("Tempo desta rodada: " + tempo + " min")
        escreval("Tempo total: " + t_total + " min")
        escreval("-" * 40)
    fimse
ate (A = "Sala de servidores" e B = "Sala de servidores" e C = "Sala de servidores" e D = "Sala de servidores") ou t_total > 17

escreval("Tempo final: " + t_total + " min")

se A = "Sala de servidores" e B = "Sala de servidores" e C = "Sala de servidores" e D = "Sala de servidores" e t_total = 17 entao
    escreval("🎉PARABÉNS! Você completou a travessia no tempo limite!")
senao
    escreval("❌VOCÊ PERDEU! O sistema caiu e a travessia não foi concluída")
fimse

fimalgoritmo