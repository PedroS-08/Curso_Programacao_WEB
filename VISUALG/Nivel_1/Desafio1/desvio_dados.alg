algoritmo "Desvio no Fluxo de Dados"
 
var

    aluno: caractere
    professor: caractere
    reserva: caractere

inicio

escreval ("Digite o nome do aluno: ")
leia(professor)
escreval("Nome de professor salvo.")
escreval("-" * 30)
escreva ("Digite o nome do professor: ")
leia(aluno)
escreval("Nome de aluno salvo.")
escreval("-" * 30)

reserva <- aluno
aluno <- professor
professor <- reserva

escreval("-=-=-=-=-= Correção dos Dados =-=-=-=-=-")
escreval("Nome do aluno: " + aluno)
escreval("Nome do professor: " + professor)
escreval("Dados corrigidos com sucesso!")
escreva("-" * 30)

fimalgoritmo