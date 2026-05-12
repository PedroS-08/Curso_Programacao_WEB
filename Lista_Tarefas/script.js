function adicionarTarefa() {

    //recebe valor do input do usuário
    let inputTarefa = document.getElementById("inputTarefa")
    let tarefa = inputTarefa.value.trim()
    console.log(inputTarefa)

    if (tarefa=='') {
        document.getElementById('mensagem').textContent = 'Campo vazio! Escreva algo.'
        return
    }
    //cria novo item (li) e insere na (lista ul)
    inputTarefa.textContent = ''
   let listaTarefas = document.getElementById("listaTarefas")
   let novaTarefa = document.createElement("li")
    novaTarefa.textContent = tarefa
   listaTarefas.appendChild(novaTarefa)

    //mensagem de tarefa adicionada com sucesso
    let mensagem = "Tarefa adicionada com sucesso!"
    document.getElementById("mensagem").textContent = mensagem
    //limpa o input do usuário
    inputTarefa.value = ""
}