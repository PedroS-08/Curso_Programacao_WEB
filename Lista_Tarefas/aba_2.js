 function criarTarefa() {

    let getTarefa = localStorage.getItem("tarefa")

    let listaTarefas2 = document.getElementById("listaValores")

    let nTarefa = document.createElement("li")

    if (tarefa == '' || tarefa == null ) {
        document.getElementById('mensagem').textContent = 'ERRO! Campo vazio!';
        return;
    }
    nTarefa.textContent = getTarefa

    listaTarefas2.appendChild(nTarefa)

    console.log(getTarefa)

 }
