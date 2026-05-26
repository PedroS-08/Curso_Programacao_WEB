function adicionarTarefa() {

    let tarefa = document.getElementById("inputTarefa").value.trim()

    if (tarefa == '' || tarefa == null ) {
        document.getElementById('mensagem').textContent = 'ERRO! Campo vazio!';
        return;
    }


    let mensagem = "Tarefa adicionada com sucesso!"

    document.getElementById("mensagem").textContent = mensagem

    inputTarefa.value = ""
    document.getElementById("inputTarefa").value = ""

    localStorage.setItem("tarefa", tarefa)

    console.log(localStorage.getItem("tarefa"))

}