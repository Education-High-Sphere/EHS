<?php
session_start();

if (isset($_POST['email']) && isset($_POST['pswd'])) {
    $email = $_POST['email'];
    $senha = $_POST['pswd'];

    require_once('config.php');

    if ($conexao->connect_error) {
        die("Erro na conexão com o banco de dados: " . $conexao->connect_error);
    }

    $sql = "SELECT * FROM user WHERE Email = '$email'";
    $result = $conexao->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        if (password_verify($senha, $user['Senha'])) {
            $_SESSION['email'] = $email;
            $_SESSION['nome'] = $user['Nome'];
            $_SESSION['cargo'] = $user['Cargo'];
            header('Location: ../user.php');
            exit;
        } else {
            echo "Senha incorreta.";
        }
    } else {        
        echo "Usuário não encontrado.";
    }

    $conexao->close();
}
?>