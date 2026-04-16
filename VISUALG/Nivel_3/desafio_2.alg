algoritmo "Sensor do Servidor"

var

    temperatura: inteiro

inicio

    escreval("=== SENSOR DE TEMPERATURA ===")
    escreval ("Digite a temperatura atual em °C: ")
    leia(temperatura)
    se (temperatura<=20) entao
        escreval ("✔️ Status: Climatização Ideal.")
    fimse
    se (21<temperatura) e (temperatura<=25) entao
        escreval("⚠️ Status: Normal / Atenção.")
    fimse
    se (temperatura>25) entao
        escreval ("🔴 Status: PERIGO! Servidor superaquecendo! 🔴")
    fimse

fimalgoritmo