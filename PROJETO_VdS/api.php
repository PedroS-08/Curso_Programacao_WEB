<?php

header('Content-Type: application/json; charset=utf-8');

// Permite requisições do mesmo servidor
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Aceita apenas POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'Método não permitido. Use POST.'
    ]);
    exit;
}

// Lê a requisicao
$corpo = file_get_contents('php://input');
$dados = json_decode($corpo, true);

// Verifica se o json é válido
if (json_last_error() !== JSON_ERROR_NONE || !is_array($dados)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'erro',
        'mensagem' => 'JSON inválido ou mal formatado.'
    ]);
    exit;
}

// Validação dos campos obrigatórios 
$erros = [];

if (empty(trim($dados['nome'] ?? ''))) {
    $erros[] = 'O campo "nome do problema" é obrigatório.';
}
if (empty(trim($dados['descricao'] ?? ''))) {
    $erros[] = 'O campo "descrição" é obrigatório.';
}

if (!empty($erros)) {
    http_response_code(422);
    echo json_encode([
        'status' => 'erro',
        'mensagem' => implode(' ', $erros)
    ]);
    exit;
}

//Preenchimento
$relato = [
    'nome' => htmlspecialchars(trim($dados['nome'])),
    'descricao' => htmlspecialchars(trim($dados['descricao'])),
    'local' => htmlspecialchars(trim($dados['local']     ?? 'Local não informado')),
    'usuario' => htmlspecialchars(trim($dados['usuario']   ?? 'Anônimo')),
    'data' => htmlspecialchars(trim($dados['data']      ?? '')),
    'categoria' => htmlspecialchars(trim($dados['categoria'] ?? '')),
    'foto' => $dados['foto'] ?? null,
    'recebido_em' => date('Y-m-d H:i:s'),
];

$arquivo = __DIR__ . '/relatos.json';
$lista = [];

if (file_exists($arquivo)) {
    $conteudo = file_get_contents($arquivo);
    $lista = json_decode($conteudo, true) ?? [];
}

$relato['id'] = count($lista) + 1;
$lista[] = $relato;

file_put_contents($arquivo, json_encode($lista, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// Resposta de sucesso 
http_response_code(201);
echo json_encode([
    'status' => 'sucesso',
    'mensagem' => 'Relato recebido com sucesso!',
    'id' => $relato['id'],
    'nome' => $relato['nome'],
]);