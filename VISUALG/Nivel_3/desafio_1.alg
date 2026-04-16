algoritmo "Catraca do Laboratório"

var

    idd: inteiro

inicio

    escreval("=== SISTEMA DE SEGURANÇA CATRACA ===")
    escreval ("Digite sua idade: ")
    leia(idd)
    se (idd>=18) entao
        escreval ("✅ Acesso Liberado: Máquina habilitada.")
    senao
        escreval ("❌ Acesso Negado: Risco de segurança. Procure o professor.")
    fimse

fimalgoritmo