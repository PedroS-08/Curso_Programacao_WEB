function aba(secao) {
    document.querySelectorAll("main section").forEach(s => s.style.display = "none");
    document.getElementById(secao).style.display = "block";
}


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

    let listaProd = document.getElementById("lista_prod");
    let novoProd = document.createElement("li");
    novoProd.textContent = `${name} | ${txt} | ${slc} | ${radValue} | ${pv} | ${pc} | ${qt}`;
    listaProd.appendChild(novoProd);

    document.getElementById("mensagem").textContent = "Produto registrado!";
    
}