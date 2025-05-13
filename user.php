<?php
    session_start();
        if(!isset($_SESSION['email'])){
            header('Location: register.html');
        exit;
    }

    $nome = $_SESSION['nome'];
    


?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel do Usuário</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        body {
            background-color: #1a1e27;
            color: #FFFBFC;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            padding: 20px;
            flex-direction: column;
        }

        h3 {
            font-size: 28px;
            margin-bottom: 20px;
            text-align: center;
        }

        
        .title-blue {
            color: #007bff;
        }

        .container {
            display: flex;
            gap: 100px;
            max-width: 1000px;
            width: 100%;
        }

        .card {
            background: white;
            color: black;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        .left-card {
            width: 500px;
            height: 375px;
        }

        .right-card {
            width: 400px;
            height: 375px;
            text-align: center;
        }

        .course {
            margin-bottom: 15px;
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background-color: #ddd;
            border-radius: 5px;
            position: relative;
        }

        .progress {
            height: 100%;
            background-color: black;
            border-radius: 5px;
        }

        .certificates p {
            font-size: 16px;
            margin-bottom: 10px;
        }

        .right-card h3 {
            font-size: 22px;
            margin-bottom: 20px;
        }

      
        .medal {
            font-size: 40px;
            margin-bottom: 10px;
        }


        #sair{
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
        }

    </style>
</head>
<body>
    <header>
        <button id="sair" onclick="window.location.href = '.config/logout.php'">Sair</button>

    </header>


    <h3>O que vamos aprender hoje, <?php echo $nome; ?>?</h3>

    <div class="container">
        
        <div class="card left-card">
            <h3>Meus Cursos</h3>
            
            <div class="course">
                <p>Gestão Ágil com Scrum e Kanban</p>
                <div class="progress-bar">
                    <div class="progress" style="width: 30%;"></div>
                </div>
            </div>

            <div class="course">
                <p>Design Thinking para Resolução de Problemas na TI</p>
                <div class="progress-bar">
                    <div class="progress" style="width: 90%;"></div>
                </div>
            </div>

            <div class="course">
                <p>Inteligência Artificial para Líderes e Gestores</p>
                <div class="progress-bar">
                    <div class="progress" style="width: 10%;"></div>
                </div>
            </div>
        </div>

    
        <div class="card right-card">
        
            <span class="medal">&#127941;</span>
            <h3>Meus certificados</h3>
            <div class="certificates">
                <p>Ética e Responsabilidade no Uso de IA</p>
                <p>Análise de Dados com IA</p>
            </div>
        </div>
    </div>

    <script>

    </script>

</body>
</html>
