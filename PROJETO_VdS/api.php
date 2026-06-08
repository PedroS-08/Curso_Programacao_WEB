<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Caminhos dos arquivos de dados
define('ARQ_RELATOS',  __DIR__ . '/relatos.json');
define('ARQ_USUARIOS', __DIR__ . '/usuarios.json');

// Roteamento
$metodo = $_SERVER['REQUEST_METHOD'];

// GET listar relatos
if ($metodo === 'GET') {
    $action = $_GET['action'] ?? '';
    if ($action === 'listar') {
        _listarRelatos();
    } else {
        _erro(400, 'Ação GET inválida.');
    }
    exit;
}

// POST outrs ações
if ($metodo !== 'POST') {
    _erro(405, 'Método não permitido. Use GET ou POST.');
    exit;
}

$corpo = file_get_contents('php://input');
$dados = json_decode($corpo, true);

if (json_last_error() !== JSON_ERROR_NONE || !is_array($dados)) {
    _erro(400, 'JSON inválido ou mal formatado.');
    exit;
}

$action = trim($dados['action'] ?? '');

switch ($action) {
    case 'cadastro': _cadastro($dados); break;
    case 'login': _login($dados);    break;
    case 'relato': _relato($dados);   break;
    case 'joia': _joia($dados);     break;
    default: _erro(400, 'Ação inválida.');
}
exit;


// Açao criar conta/cadastro

function _cadastro(array $d): void
{
    $nome = trim($d['nome'] ?? '');
    $contato = trim($d['contato'] ?? '');
    $senha = $d['senha'] ?? '';

    if (!$nome)    { _erro(422, 'O campo "nome" é obrigatório.');    return; }
    if (!$contato) { _erro(422, 'O campo "contato" é obrigatório.'); return; }
    if (!$senha)   { _erro(422, 'O campo "senha" é obrigatório.');   return; }

    $usuarios = _lerJson(ARQ_USUARIOS);

    // Verifica duplicidade de contato
    foreach ($usuarios as $u) {
        if (strtolower($u['contato']) === strtolower($contato)) {
            _erro(409, 'Usuário já cadastrado com este e-mail ou telefone.');
            return;
        }
    }

    $novo = [
        'id' => count($usuarios) + 1,
        'nome' => htmlspecialchars($nome),
        'contato' => $contato,
        'senha_hash' => password_hash($senha, PASSWORD_DEFAULT),
        'cadastrado_em' => date('Y-m-d H:i:s'),
    ];

    $usuarios[] = $novo;
    _salvarJson(ARQ_USUARIOS, $usuarios);

    http_response_code(201);
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Conta criada com sucesso!',
        'nome' => $novo['nome'],
    ]);
}


// Ação login

function _login(array $d): void
{
    $contato = trim($d['contato'] ?? '');
    $senha   = $d['senha']        ?? '';

    if (!$contato) { _erro(422, 'O campo "contato" é obrigatório.'); return; }
    if (!$senha)   { _erro(422, 'O campo "senha" é obrigatório.');   return; }

    $usuarios = _lerJson(ARQ_USUARIOS);

    // Procura o usuário
    $encontrado = null;
    foreach ($usuarios as $u) {
        if (strtolower($u['contato']) === strtolower($contato)) {
            $encontrado = $u;
            break;
        }
    }

    if ($encontrado === null) {
        _erro(404, 'Conta não encontrada. Verifique o e-mail/telefone ou crie uma conta.');
        return;
    }

    if (!password_verify($senha, $encontrado['senha_hash'])) {
        _erro(401, 'E-mail/telefone ou senha inválido(s).');
        return;
    }

    http_response_code(200);
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Login realizado com sucesso!',
        'nome' => $encontrado['nome'],
    ]);
}


// Ação relato, se logado

function _relato(array $d): void
{
    $nome      = trim($d['nome']      ?? '');
    $descricao = trim($d['descricao'] ?? '');
    $contato   = trim($d['contato']   ?? '');

    if (!$nome)      { _erro(422, 'O campo "nome do problema" é obrigatório.'); return; }
    if (!$descricao) { _erro(422, 'O campo "descrição" é obrigatório.'); return; }

    // Garantir que o contato pertence a um usuário cadastrado
    if ($contato) {
        $usuarios   = _lerJson(ARQ_USUARIOS);
        $cadastrado = false;
        foreach ($usuarios as $u) {
            if (strtolower($u['contato']) === strtolower($contato)) {
                $cadastrado = true;
                break;
            }
        }
        if (!$cadastrado) {
            _erro(403, 'Usuário não autenticado. Faça login novamente.');
            return;
        }
    }

    $relatos = _lerJson(ARQ_RELATOS);

    $novo = [
        'id' => count($relatos) + 1,
        'nome' => htmlspecialchars(trim($d['nome'])),
        'descricao' => htmlspecialchars(trim($d['descricao'])),
        'local' => htmlspecialchars(trim($d['local']     ?? 'Local não informado')),
        'usuario' => htmlspecialchars(trim($d['usuario']   ?? 'Anônimo')),
        'contato' => $contato,
        'data' => htmlspecialchars(trim($d['data']      ?? '')),
        'categoria' => htmlspecialchars(trim($d['categoria'] ?? '')),
        'foto' => $d['foto'] ?? null,
        'joias' => 0,
        'joiados_por' => [],
        'recebido_em' => date('Y-m-d H:i:s'),
    ];

    $relatos[] = $novo;
    _salvarJson(ARQ_RELATOS, $relatos);

    http_response_code(201);
    echo json_encode([
        'status' => 'sucesso',
        'mensagem' => 'Relato recebido com sucesso!',
        'id' => $novo['id'],
        'nome' => $novo['nome'],
    ]);
}

// Ação joia/like

function _joia(array $d): void
{
    $id = (int)($d['id'] ?? 0);
    $contato = trim($d['contato'] ?? '');
    $tipo = trim($d['tipo'] ?? 'adicionar'); // Add / remover

    if (!$id || !$contato) { _erro(422, 'Parâmetros inválidos.'); return; }

    $relatos  = _lerJson(ARQ_RELATOS);
    $alterado = false;

    foreach ($relatos as &$r) {
        if ((int)$r['id'] !== $id) continue;

        if (!isset($r['joiados_por'])) $r['joiados_por'] = [];

        $pos = array_search($contato, $r['joiados_por'], true);

        if ($tipo === 'adicionar' && $pos === false) {
            $r['joiados_por'][] = $contato;
            $r['joias'] = count($r['joiados_por']);
            $alterado = true;
        } elseif ($tipo === 'remover' && $pos !== false) {
            array_splice($r['joiados_por'], $pos, 1);
            $r['joias'] = count($r['joiados_por']);
            $alterado = true;
        }
        break;
    }
    unset($r);

    if ($alterado) _salvarJson(ARQ_RELATOS, $relatos);

    http_response_code(200);
    echo json_encode(['status' => 'sucesso']);
}


// Ação get listar relatos
function _listarRelatos(): void
{
    $relatos = _lerJson(ARQ_RELATOS);

    // Remove dados sensíveis antes de expor
    $publicos = array_map(function (array $r): array {
        unset($r['contato'], $r['joiados_por']);
        return $r;
    }, $relatos);

    // Ordena do mais recente ao mais antigo
    usort($publicos, fn($a, $b) => ($b['id'] ?? 0) <=> ($a['id'] ?? 0));

    http_response_code(200);
    echo json_encode([
        'status'  => 'sucesso',
        'relatos' => $publicos,
    ]);
}

// Utilitarios
function _lerJson(string $arquivo): array
{
    if (!file_exists($arquivo)) return [];
    $conteudo = file_get_contents($arquivo);
    $decoded  = json_decode($conteudo, true);
    return is_array($decoded) ? $decoded : [];
}

function _salvarJson(string $arquivo, array $dados): void
{
    file_put_contents(
        $arquivo,
        json_encode($dados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
        LOCK_EX
    );
}

function _erro(int $code, string $mensagem): void
{
    http_response_code($code);
    echo json_encode(['status' => 'erro', 'mensagem' => $mensagem]);
}