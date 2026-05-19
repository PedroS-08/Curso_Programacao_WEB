function adicionarTarefa() {

    //Dado que o usuário digitou na memória
    let tarefa = document.getElementById("inputTarefa").value

    //mensagem de tarefa adicionada com sucesso atribuiída como constante a uma variável
    let mensagem = "Tarefa adicionada com sucesso!"

    //exibe a mensagem na tela atribuída a um elemento HTML
    document.getElementById("mensagem").textContent = mensagem

    //limpa o input do usuário após adicionar a tarefa
    inputTarefa.value = ""
    document.getElementById("inputTarefa").value = ""

    localStorage.setItem("tarefa", tarefa)

    console.log(localStorage.getItem("tarefa"))
}