function aba(secao) {
    document.querySelectorAll("main section").forEach(s => s.style.display = "none");
    document.getElementById(secao).style.display = "block";
}

let produtos = []

function cadastrar() {
    let nome_prod = document.getElementById("nome_prod");
    let txt_area = document.getElementById("txt_area");
    let selec = document.getElementById("selec");
    let preco_venda = document.getElementById("preco_venda");
    let preco_custo = document.getElementById("preco_custo");
    let qtd = document.getElementById("qtd");
    let rad = document.querySelector('input[name="atv"]:checked');

    let radValue = rad ? rad.value.trim() : '';
    let name = nome_prod.value.trim();
    let txt = txt_area.value.trim();
    let slc = selec.value.trim();
    let pv = preco_venda.value.trim();
    let pc = preco_custo.value.trim();
    let qt = qtd.value.trim();

    if (name=='' || txt=='' || slc=='' || radValue=='' || pv=='' || pc=='' || qt=='') {
        document.getElementById('mensagem').textContent = 'Campo(s) vazio(s)! Preencha todas as informações para cadastrar o Produto!';
        return;
    }

    let produto = {
        nome: name,
        descricao: txt,
        categoria: slc,
        status: radValue,
        venda: pv,
        custo: pc,
        quantidade: qt
    };

    produtos.push(produto);
    mostrarProdutos(produtos);
    document.getElementById("mensagem").textContent = "Produto registrado!";
}

function mostrarProdutos(lista) {
    let listaProd = document.getElementById("lista_prod");
    listaProd.innerHTML = "";

    lista.forEach(prod => {
        listaProd.innerHTML += `
            <tr>
                <td>${prod.nome}</td>
                <td>${prod.categoria}</td>
                <td>${prod.venda}</td>
                <td>${prod.quantidade}</td>
            </tr>
        `;
    });
}


function filtrar(categoria) {

    if (categoria == "Todos") {
        mostrarProdutos(produtos);

    } else {

        let filtrados = produtos.filter(prod => prod.categoria == categoria);
        mostrarProdutos(filtrados);
    }
}

function limpar() {
    document.getElementById("nome_prod").value = "";
    document.getElementById("txt_area").value = "";
    document.getElementById("selec").selectedIndex = 0;
    document.getElementById("preco_venda").value = "";
    document.getElementById("preco_custo").value = "";
    document.getElementById("qtd").value = "";
    document.querySelectorAll('input[name="atv"]').forEach(radio => { radio.checked = false;});
    document.getElementById("mensagem").textContent = "";
}