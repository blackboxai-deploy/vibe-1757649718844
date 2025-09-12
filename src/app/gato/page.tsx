export default function GatoPage() {
  return (
    <div dangerouslySetInnerHTML={{
      __html: `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Juego de Gato vs Computadora</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #333;
        }

        .game-container {
            background: white;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            text-align: center;
            max-width: 500px;
            width: 90%;
        }

        h1 {
            color: #4a90e2;
            margin-bottom: 1rem;
            font-size: 2.5rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .subtitle {
            color: #666;
            margin-bottom: 2rem;
            font-size: 1.1rem;
        }

        .game-board {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-gap: 10px;
            margin: 2rem auto;
            max-width: 300px;
            background: #f0f0f0;
            padding: 15px;
            border-radius: 15px;
        }

        .cell {
            aspect-ratio: 1;
            background: white;
            border: none;
            border-radius: 10px;
            font-size: 3rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .cell:hover:not(:disabled) {
            background: #e3f2fd;
            transform: scale(1.05);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
        }

        .cell:disabled {
            cursor: not-allowed;
            opacity: 0.8;
        }

        .cell.X {
            color: #e91e63;
            background: #fce4ec;
        }

        .cell.O {
            color: #2196f3;
            background: #e3f2fd;
        }

        .game-status {
            font-size: 1.5rem;
            margin: 1.5rem 0;
            min-height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .status-playing {
            color: #4a90e2;
            font-weight: 600;
        }

        .status-win {
            color: #4caf50;
            font-weight: bold;
            font-size: 1.8rem;
            animation: bounce 0.6s ease-in-out;
        }

        .status-lose {
            color: #f44336;
            font-weight: bold;
            font-size: 1.8rem;
            animation: shake 0.6s ease-in-out;
        }

        .status-draw {
            color: #ff9800;
            font-weight: bold;
            font-size: 1.6rem;
        }

        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-20px);
            }
            60% {
                transform: translateY(-10px);
            }
        }

        @keyframes shake {
            0%, 100% {
                transform: translateX(0);
            }
            10%, 30%, 50%, 70%, 90% {
                transform: translateX(-5px);
            }
            20%, 40%, 60%, 80% {
                transform: translateX(5px);
            }
        }

        .controls {
            margin-top: 2rem;
        }

        .btn {
            background: linear-gradient(45deg, #4a90e2, #357abd);
            color: white;
            border: none;
            padding: 12px 30px;
            font-size: 1.1rem;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 0 10px;
        }

        .btn:hover {
            background: linear-gradient(45deg, #357abd, #2c5aa0);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .btn:active {
            transform: translateY(0);
        }

        .btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }

        .score-board {
            display: flex;
            justify-content: space-around;
            margin: 1rem 0;
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 10px;
        }

        .score-item {
            text-align: center;
        }

        .score-label {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 0.5rem;
        }

        .score-value {
            font-size: 1.5rem;
            font-weight: bold;
        }

        .score-player {
            color: #e91e63;
        }

        .score-computer {
            color: #2196f3;
        }

        .score-draws {
            color: #ff9800;
        }

        .difficulty-selector {
            margin: 1rem 0;
        }

        .difficulty-selector label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #555;
        }

        .difficulty-selector select {
            padding: 8px 15px;
            border-radius: 8px;
            border: 2px solid #ddd;
            font-size: 1rem;
            background: white;
            cursor: pointer;
        }

        .game-info {
            background: #e3f2fd;
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1rem;
            font-size: 0.95rem;
            color: #1976d2;
        }

        .emoji {
            font-size: 2rem;
            margin: 0 0.5rem;
        }

        /* Responsive design */
        @media (max-width: 480px) {
            h1 {
                font-size: 2rem;
            }
            
            .cell {
                font-size: 2.5rem;
            }
            
            .game-status {
                font-size: 1.3rem;
            }
            
            .btn {
                padding: 10px 20px;
                font-size: 1rem;
                margin: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="game-container">
        <h1>Juego de Gato</h1>
        <p class="subtitle">Tú (X) vs Computadora (O)</p>

        <div class="difficulty-selector">
            <label for="difficulty">Dificultad:</label>
            <select id="difficulty">
                <option value="easy">Fácil</option>
                <option value="medium" selected>Normal</option>
                <option value="hard">Difícil</option>
            </select>
        </div>

        <div class="score-board">
            <div class="score-item">
                <div class="score-label">Tú ganaste</div>
                <div class="score-value score-player" id="playerScore">0</div>
            </div>
            <div class="score-item">
                <div class="score-label">Empates</div>
                <div class="score-value score-draws" id="drawScore">0</div>
            </div>
            <div class="score-item">
                <div class="score-label">PC ganó</div>
                <div class="score-value score-computer" id="computerScore">0</div>
            </div>
        </div>

        <div class="game-board" id="gameBoard"></div>

        <div class="game-status" id="gameStatus">
            <span class="status-playing">Tu turno - ¡Elige una casilla!</span>
        </div>

        <div class="controls">
            <button class="btn" id="newGameBtn" onclick="newGame()">Nueva Partida</button>
            <button class="btn" id="resetScoreBtn" onclick="resetScore()">Reiniciar Puntuación</button>
        </div>
    </div>

    <script>
        // Variables globales del juego
        let board = ['', '', '', '', '', '', '', '', ''];
        let currentPlayer = 'X'; // X = Jugador, O = Computadora
        let gameActive = true;
        let scores = {
            player: 0,
            computer: 0,
            draws: 0
        };

        // Cargar puntuaciones desde localStorage
        function loadScores() {
            const savedScores = localStorage.getItem('gatoScores');
            if (savedScores) {
                scores = JSON.parse(savedScores);
                updateScoreDisplay();
            }
        }

        // Guardar puntuaciones en localStorage
        function saveScores() {
            localStorage.setItem('gatoScores', JSON.stringify(scores));
        }

        // Patrones ganadores
        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontales
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticales
            [0, 4, 8], [2, 4, 6]             // Diagonales
        ];

        // Inicializar el juego
        function initGame() {
            createBoard();
            loadScores();
        }

        // Crear el tablero
        function createBoard() {
            const gameBoard = document.getElementById('gameBoard');
            gameBoard.innerHTML = '';
            
            for (let i = 0; i < 9; i++) {
                const cell = document.createElement('button');
                cell.className = 'cell';
                cell.setAttribute('data-cell', i);
                cell.onclick = () => handleCellClick(i);
                gameBoard.appendChild(cell);
            }
        }

        // Manejar click en celda
        function handleCellClick(index) {
            if (board[index] !== '' || !gameActive || currentPlayer !== 'X') {
                return;
            }

            makeMove(index, 'X');
            
            if (gameActive && !board.includes('')) {
                // Tablero lleno, empate
                endGame('draw');
            } else if (gameActive) {
                // Turno de la computadora
                currentPlayer = 'O';
                updateStatus('La computadora está pensando...');
                
                setTimeout(() => {
                    computerMove();
                }, Math.random() * 1000 + 500); // Delay aleatorio para parecer más real
            }
        }

        // Realizar movimiento
        function makeMove(index, player) {
            board[index] = player;
            const cell = document.querySelector('[data-cell="' + index + '"]');
            cell.textContent = player;
            cell.classList.add(player);
            cell.disabled = true;

            if (checkWin(player)) {
                endGame(player === 'X' ? 'player' : 'computer');
            }
        }

        // Movimiento de la computadora
        function computerMove() {
            if (!gameActive) return;

            const difficulty = document.getElementById('difficulty').value;
            let move;

            switch (difficulty) {
                case 'easy':
                    move = getRandomMove();
                    break;
                case 'medium':
                    move = Math.random() < 0.7 ? getBestMove() : getRandomMove();
                    break;
                case 'hard':
                    move = getBestMove();
                    break;
            }

            if (move !== -1) {
                makeMove(move, 'O');
                currentPlayer = 'X';
                
                if (gameActive) {
                    updateStatus('Tu turno - ¡Elige una casilla!');
                }
            }
        }

        // Obtener movimiento aleatorio
        function getRandomMove() {
            const availableMoves = board.map((cell, index) => cell === '' ? index : null)
                                       .filter(index => index !== null);
            
            return availableMoves.length > 0 
                ? availableMoves[Math.floor(Math.random() * availableMoves.length)]
                : -1;
        }

        // Obtener el mejor movimiento (IA)
        function getBestMove() {
            // 1. Intentar ganar
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    if (checkWin('O')) {
                        board[i] = '';
                        return i;
                    }
                    board[i] = '';
                }
            }

            // 2. Bloquear al jugador
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    if (checkWin('X')) {
                        board[i] = '';
                        return i;
                    }
                    board[i] = '';
                }
            }

            // 3. Tomar el centro si está disponible
            if (board[4] === '') {
                return 4;
            }

            // 4. Tomar las esquinas
            const corners = [0, 2, 6, 8];
            const availableCorners = corners.filter(corner => board[corner] === '');
            if (availableCorners.length > 0) {
                return availableCorners[Math.floor(Math.random() * availableCorners.length)];
            }

            // 5. Cualquier movimiento disponible
            return getRandomMove();
        }

        // Verificar si hay ganador
        function checkWin(player) {
            return winningConditions.some(condition => 
                condition.every(index => board[index] === player)
            );
        }

        // Terminar juego
        function endGame(result) {
            gameActive = false;
            let message = '';
            
            switch (result) {
                case 'player':
                    message = 'Dayanara fea😛';
                    scores.player++;
                    updateStatus(message, 'status-win');
                    break;
                case 'computer':
                    message = 'Dayanara aún más fea😛';
                    scores.computer++;
                    updateStatus(message, 'status-lose');
                    break;
                case 'draw':
                    message = 'Empate';
                    scores.draws++;
                    updateStatus(message, 'status-draw');
                    break;
            }

            // Deshabilitar todas las celdas
            document.querySelectorAll('.cell').forEach(cell => {
                cell.disabled = true;
            });

            updateScoreDisplay();
            saveScores();

            // Mostrar botón de nueva partida después de un momento
            setTimeout(() => {
                updateStatus(message, 
                           result === 'player' ? 'status-win' : 
                           result === 'computer' ? 'status-lose' : 'status-draw');
            }, 2000);
        }

        // Actualizar estado del juego
        function updateStatus(message, className = 'status-playing') {
            const statusElement = document.getElementById('gameStatus');
            statusElement.innerHTML = message;
            statusElement.className = 'game-status ' + className;
        }

        // Actualizar display de puntuaciones
        function updateScoreDisplay() {
            document.getElementById('playerScore').textContent = scores.player;
            document.getElementById('computerScore').textContent = scores.computer;
            document.getElementById('drawScore').textContent = scores.draws;
        }

        // Nueva partida
        function newGame() {
            board = ['', '', '', '', '', '', '', '', ''];
            currentPlayer = 'X';
            gameActive = true;
            
            // Limpiar tablero
            document.querySelectorAll('.cell').forEach(cell => {
                cell.textContent = '';
                cell.disabled = false;
                cell.className = 'cell';
            });

            updateStatus('Tu turno - ¡Elige una casilla!');
        }

        // Reiniciar puntuación
        function resetScore() {
            if (confirm('¿Reiniciar puntuación?')) {
                scores = { player: 0, computer: 0, draws: 0 };
                updateScoreDisplay();
                saveScores();
                alert('Puntuación reiniciada');
            }
        }

        // Inicializar cuando carga la página
        window.addEventListener('load', initGame);


    </script>
</body>
</html>
      `
    }} />
  );
}