// Game Class: Manages the overall game state and logic
class Game {
    constructor() {
        this.score = 0;
        this.timeLeft = 30;
        this.gameOver = false;
        this.tiles = [];
        this.moleInterval = null;
        this.plantInterval = null;
        this.countdownInterval = null;
        this.currMoleTile = null;
        this.currPlantTile = null;
    }

    // Initialize the game
    start() {
        this.setGame();
        this.setupTimer();
    }

    // Set up the game board and create the tiles
    setGame() {
        const board = document.getElementById("board");
        board.innerHTML = ""; // Clear existing tiles
        for (let i = 0; i < 9; i++) {
            let tile = new Tile(i.toString());
            this.tiles.push(tile);
            board.appendChild(tile.element);
            tile.element.addEventListener("click", () => this.selectTile(tile));
        }
        // Set intervals for moles and plants
        this.moleInterval = setInterval(() => this.setMole(), 1000);
        this.plantInterval = setInterval(() => this.setPlant(), 2000);
    }

    // Timer setup
    setupTimer() {
        this.countdownInterval = setInterval(() => {
            if (!this.gameOver && this.timeLeft > 0) {
                this.timeLeft--;
                document.getElementById("timer").innerText = "Time Left: " + this.timeLeft;
            } else if (this.timeLeft === 0 && !this.gameOver) {
                this.endGame("TIME UP!");
            }
        }, 1000);
    }

    // Handle tile selection (mole or plant click)
    selectTile(tile) {
        if (this.gameOver) return;

        if (tile === this.currMoleTile) {
            this.score += 10;
            document.getElementById("score").innerText = "Score: " + this.score;
        } else if (tile === this.currPlantTile) {
            this.endGame("GAME OVER!");
        }
    }

    // End the game and display the final score
    endGame(message) {
        this.gameOver = true;
        document.getElementById("score").innerText = `${message} Final Score: ${this.score}`;
        clearInterval(this.countdownInterval);
        clearInterval(this.moleInterval);
        clearInterval(this.plantInterval);
    }

    // Restart the game
    restart() {
        this.score = 0;
        this.timeLeft = 30;
        this.gameOver = false;
        document.getElementById("score").innerText = "Score: 0";
        document.getElementById("timer").innerText = "Time Left: 30";

        this.tiles.forEach(tile => tile.clear());
        clearInterval(this.countdownInterval);
        clearInterval(this.moleInterval);
        clearInterval(this.plantInterval);

        this.setGame();
        this.setupTimer();
    }

    // Set a random mole on the board
    setMole() {
        if (this.gameOver) return;
        if (this.currMoleTile) this.currMoleTile.clear();

        let moleTile;
        do {
            moleTile = this.getRandomTile();
        } while (moleTile === this.currPlantTile);

        this.currMoleTile = moleTile;
        this.currMoleTile.placeMole();
    }

    // Set a random plant on the board
    setPlant() {
        if (this.gameOver) return;
        if (this.currPlantTile) this.currPlantTile.clear();

        let plantTile;
        do {
            plantTile = this.getRandomTile();
        } while (plantTile === this.currMoleTile);

        this.currPlantTile = plantTile;
        this.currPlantTile.placePlant();
    }

    // Get a random tile from the game board
    getRandomTile() {
        const randomIndex = Math.floor(Math.random() * this.tiles.length);
        return this.tiles[randomIndex];
    }
}

// Tile Class: Represents each tile on the game board
class Tile {
    constructor(id) {
        this.id = id;
        this.mole = false;
        this.plant = false;
        this.element = document.createElement("div");
        this.element.id = id;
        this.element.classList.add("tile");
    }

    placeMole() {
        this.mole = true;
        const mole = document.createElement("img");
        mole.src = "./monty-mole.png";
        this.element.appendChild(mole);
    }

    placePlant() {
        this.plant = true;
        const plant = document.createElement("img");
        plant.src = "./piranha-plant.png";
        this.element.appendChild(plant);
    }

    clear() {
        this.mole = false;
        this.plant = false;
        this.element.innerHTML = "";
    }
}

// Redirect to the Banana game and fetch bonus
async function useBananaBonus() {
    // Redirect to the Banana game
    window.open("https://marcconrad.com/uob/banana/index.php", "_blank");

    // Fetch the bonus score after a delay
    setTimeout(async () => {
        try {
            const response = await fetch("https://marcconrad.com/uob/banana/api.php");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            const bonus = data.solution;

            alert(`Congratulations! You've earned a bonus of ${bonus} points!`);
            game.score += parseInt(bonus);
            document.getElementById("score").innerText = `Score: ${game.score}`;
        } catch (error) {
            console.error("Error fetching Banana API bonus:", error);
            alert("Failed to retrieve the Banana bonus.");
        }
    }, 10000); // Simulate a 10-second delay for playing the Banana game
}

// When the page loads, start the game
const game = new Game();
window.onload = function () {
    game.start();

    // Attach event listeners
    document.getElementById("restart-button").addEventListener("click", () => game.restart());
    document.getElementById("banana-bonus-button").addEventListener("click", () => useBananaBonus());
};
