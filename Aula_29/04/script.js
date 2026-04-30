function tarefaAdd() {
    const tarefa = document.getElementById("digite");
    let tarefaD = tarefa.value;
    let msg = document.getElementById("texto").textContent = tarefaD;
}

function tarefaDel() {
    const tarefa = document.getElementById("digite");
    tarefa.value = '';
    let msg = document.getElementById("texto").textContent = '';
}