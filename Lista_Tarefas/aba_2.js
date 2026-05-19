function criarTarefa() {

    let getTarefa = localStorage.getItem("tarefa")

    let listaTarefas2 = document.getElementById("listaValores")

    //cria um novo elemento li e atribui uma variaável para ele
    let nTarefa = document.createElement("li")

    //atribui o valor da tarefa ao conteúdo do novo elemento li
    nTarefa.textContent = getTarefa

    //adiciona o novo elemento li abaixo à lista ul
    listaTarefas2.appendChild(nTarefa)

    console.log(getTarefa)

}
//let mensagem = "Tarefa adicionada com sucesso!"
//document.getElementById("mensagem").textContent = mensagem