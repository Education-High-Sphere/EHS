<?php
session_start(); // Inicia a sessão

$nome = $_POST['name'];
$email = $_POST['email'];
$senha = $_POST['pswd'];
$telefone = $_POST['telefone'];
$cargo = $_POST['job'];
$data_nascimento = $_POST['birth'];

$hash = password_hash($senha, PASSWORD_DEFAULT);

require_once('config.php');

// Corrigindo a query SQL com placeholders
$sql = "INSERT INTO user (Nome, Email, Senha, Cargo, Data_Nascimento) VALUES (?, ?, ?, ?, ?)";

$stmt = $conexao->prepare($sql);

// Verifica se a preparação foi bem-sucedida
if (!$stmt) {
    die("Erro na preparação da query: " . $conexao->error);
}

// Associa os parâmetros à query ('sssss' = 5 strings)
$stmt->bind_param("sssss", $nome, $email, $hash, $cargo, $data_nascimento);

// Executa a query e verifica se foi bem-sucedida
if ($stmt->execute()) {
    // Obtém o ID do usuário recém-cadastrado
    $user_id = $stmt->insert_id;

    // Salva os dados na sessão para autenticar automaticamente
    $_SESSION['nome'] = $nome;
    $_SESSION['email'] = $email;
    $_SESSION['cargo'] = $cargo;

    // Redireciona para a área logada
    header('Location: ../user.php'); // Substitua pelo nome da sua página principal
    exit;
    
} else {
    echo "Erro ao cadastrar: " . $stmt->error;
}

$stmt->close();
$conexao->close();
?>
