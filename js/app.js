// Define the Pokémon data
const pokemonData = [
    {
        id: 1,
        name: 'Charizard',
        type: 'Fire',
        hp: 120,
        sp: 70,
        attack: 35,
        defense: 20,
        image: '/images/charizard.jpeg',
    },
    {
        id: 2,
        name: 'Blastoise',
        type: 'Water',
        hp: 130,
        sp: 65,
        attack: 30,
        defense: 25,
        image: '/images/blastoise.jpeg',
    },
    {
        id: 3,
        name: 'Venusaur',
        type: 'Grass',
        hp: 110,
        sp: 80,
        attack: 40,
        defense: 15,
        image: '/images/venusaur.jpeg',
    },
    // Add more Pokémon data here
];

// Constants for player and enemy
const PLAYER = 'player';
const ENEMY = 'enemy';

// Battle parameters
let playerPokemon;
let enemyPokemon;
let playerStats;
let enemyStats;

// Function to attempt to catch the enemy Pokémon
function tryToCatch() {
    const catchSuccess = Math.random() < 0.5; // 50% chance of success (adjust as needed)

    let message = '';
    if (catchSuccess) {
        message = 'You caught the Pokémon!';
    } else {
        message = 'The Pokémon escaped!';
    }

    // Show the result message on the results page
    document.getElementById('result-message').textContent = message;
    hidePage('battle-page');  // Hide the battle page
    showPage('results-page'); // Show the results page
}

// Function to attempt to catch the enemy Pokémon
function tryToCatch() {
    const catchSuccess = Math.random() < 0.5; // 50% chance of success (adjust as needed)

    let message = '';
    if (catchSuccess) {
        message = 'You caught the Pokémon!';
    } else {
        message = 'The Pokémon escaped!';
    }

    // Show the result message on the results page
    document.getElementById('result-message').textContent = message;
    hidePage('battle-page');  // Hide the battle page
    showPage('results-page'); // Show the results page

    // Simulate the enemy's turn after the catch attempt
    setTimeout(() => {
        enemyTurn();
        hidePage('battle-page');  // Hide the battle page
        showPage('results-page'); // Show the results page
    }, 1000); // Adjust the delay as needed
}



// Function to return to the main page (Pokemon selection)
function returnToMain() {
    clearCookies(); // Clear the player's Pokémon cookie
    hidePage('battle-page');
    hidePage('results-page');
    showMainPage(); // Show the main page
}


// Function to end the battle with a message
function endBattle(message) {
    document.getElementById('result-message').textContent = message;
    hidePage('battle-page');  // Hide the battle page
    showPage('results-page'); // Show the results page

    // Clear the player's Pokémon cookie
    Cookies.remove('playerPokemon');
}


// Function to handle the use spell action
function useSpell() {
    if (!canUseAction(playerStats, 10)) {
        alert('Not enough SP to use this action.');
        return;
    }

    // Implement spell usage logic here
    const spellDamage = 25;
    enemyStats.hp -= spellDamage;

    playerStats.sp -= 10;

    updateStats(PLAYER, playerStats);
    updateStats(ENEMY, enemyStats);

    if (enemyStats.hp <= 0) {
        enemyStats.hp = 0;
        endBattle('You won the battle!');
    }
}


// Function to handle the use item action
function useItem() {
    if (!canUseAction(playerStats, 10)) {
        alert('Not enough SP to use this action.');
        return;
    }

    // Implement item usage logic (e.g., restore some HP) here
    playerStats.hp += 20;

    playerStats.sp -= 10;

    updateStats(PLAYER, playerStats);
}

// Function to handle the defend action
function useDefend() {
    if (!canUseAction(playerStats, 10)) {
        alert('Not enough SP to use this action.');
        return;
    }

    // Implement defense logic (e.g., increase player's defense) here
    playerStats.defense += 10;

    playerStats.sp -= 10;

    updateStats(PLAYER, playerStats);
}

// Function to calculate damage
function calculateDamage(attacker, target) {
    // Implement damage calculation logic here

    const baseDamage = attacker.attack;
    const defense = target.defense;

    const damage = Math.max(1, baseDamage - defense);

    return damage;
}

// Function to check if the player can use a particular action based on SP (spell points)
function canUseAction(stats, spCost) {
    return stats.sp >= spCost;
}

// Function to handle the attack action
function useAttack() {
    if (!canUseAction(playerStats, 10)) {
        alert('Not enough SP to use this attack.');
        return;
    }

    const playerDamage = calculateDamage(playerStats, enemyStats);
    const enemyDamage = calculateDamage(enemyStats, playerStats);

    playerStats.hp -= enemyDamage;
    enemyStats.hp -= playerDamage;

    playerStats.sp -= 10;

    updateStats(PLAYER, playerStats);
    updateStats(ENEMY, enemyStats);

    if (playerStats.hp <= 0) {
        playerStats.hp = 0;
        endBattle('You lost the battle!');
    } else if (enemyStats.hp <= 0) {
        enemyStats.hp = 0;
        endBattle('You won the battle!');
    }
}

// Function to set the text content of a given HTML element
function setPokemonName(nameId, name) {
    const nameElement = document.getElementById(nameId);
    if (nameElement) {
        nameElement.textContent = name;
    }
}   

// Function to update Pokémon stats on the page
function updateStats(target, stats) {
    document.getElementById(`${target}-hp`).textContent = stats.hp;
    document.getElementById(`${target}-sp`).textContent = stats.sp;
    document.getElementById(`${target}-type`).textContent = stats.type;
}

// Function to set the image source of a given HTML element
function setPokemonImage(imageId, imageUrl) {
    const imgElement = document.getElementById(imageId);
    if (imgElement) {
        imgElement.src = imageUrl;
    }
}

// Function to get a random enemy Pokémon ID
function getRandomEnemyPokemon() {
    return Math.floor(Math.random() * pokemonData.length) + 1;
}

// Function to get Pokémon stats by ID
function getPokemonStats(pokemonId) {
    const selectedPokemonData = pokemonData[pokemonId - 1];
    return { ...selectedPokemonData };
}

// Function to check if the selected Pokémon is valid
function isValidPokemon(selectedPokemon) {
    return selectedPokemon >= 1 && selectedPokemon <= pokemonData.length;
}

// Function to start a battle
function startBattle(selectedPokemon) {
    if (!isValidPokemon(selectedPokemon)) {
        alert('Invalid Pokémon selection.');
        return;
    }

    playerPokemon = selectedPokemon;
    playerStats = { ...getPokemonStats(playerPokemon) };
    enemyPokemon = getRandomEnemyPokemon();
    enemyStats = { ...getPokemonStats(enemyPokemon) };

    // Set the player's Pokémon in a cookie
    Cookies.set('playerPokemon', playerPokemon);

    hidePage('main-page');
    showPage('battle-page');

    setPokemonImage('player-img', playerStats.image);
    setPokemonImage('enemy-img', enemyStats.image);

    updateStats(PLAYER, playerStats);
    updateStats(ENEMY, enemyStats);

    setPokemonName('player-name', `Player's ${playerStats.name}`);
    setPokemonName('enemy-name', `Enemy ${enemyStats.name}`);
}

// Function to show an element by its class name
function showPage(className) {
    const element = document.querySelector(`.${className}`);
    if (element) {
        element.style.display = 'block';
    }
}

// Function to hide an element by its class name
function hidePage(className) {
    const element = document.querySelector(`.${className}`);
    if (element) {
        element.style.display = 'none';
    }
}

// Function to clear cookies
function clearCookies() {
    Cookies.remove('playerPokemon');
}


// Function to show the main page (Pokemon selection) and clear any battle-related data
function showMainPage() {
    playerPokemon = null;
    enemyPokemon = null;
    playerStats = null;
    enemyStats = null;
    
    clearCookies();
    
    showPage('main-page');
}

// Initialize the page by showing the main page initially
showMainPage();

// ... (remaining code)

// Event listener for page load
window.addEventListener('load', () => {
    const playerCookie = Cookies.get('playerPokemon');
    if (playerCookie) {
        const selectedPokemon = parseInt(playerCookie);
        startBattle(selectedPokemon);
    }
});
