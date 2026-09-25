// ============================================================================
// Sandpixels - Core Simulation Engine v1.0 (Demo)
// Developer Framework & Particle Loop
// ============================================================================

// Grid and Canvas constraints
const width = 150;
const height = 150;
const pixelSize = 4; // Render scale factor

// Initialize canvas element
const canvas = document.createElement("canvas");
canvas.width = width * pixelSize;
canvas.height = height * pixelSize;
document.getElementById("game-container").appendChild(canvas);
const ctx = canvas.getContext("2d");

// Generate initial empty simulation grid
let grid = Array(width).fill().map(() => Array(height).fill("empty"));

// Mouse input mapping for canvas drawing
let isDrawing = false;
canvas.addEventListener("mousedown", () => isDrawing = true);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pixelSize);
    const y = Math.floor((e.clientY - rect.top) / pixelSize);
    
    // Bounds check before matrix injection
    if (x >= 0 && x < width && y >= 0 && y < height) {
        grid[x][y] = currentElement;
    }
});

// UI Controls Context - Element Toolbar Generation
const uiContainer = document.createElement("div");
uiContainer.style.textAlign = "center";
uiContainer.style.marginTop = "10px";
document.getElementById("game-container").appendChild(uiContainer);

// Map human-readable elements to toolbar buttons
["sand", "water", "wall", "empty"].forEach(elKey => {
    const btn = document.createElement("button");
    btn.innerText = elKey.toUpperCase(); // Developer standard visual formatting
    btn.style.margin = "5px";
    btn.style.padding = "8px 15px";
    btn.style.cursor = "pointer";
    btn.style.backgroundColor = "#222";
    btn.style.color = "#fff";
    btn.style.border = "1px solid #444";
    btn.style.borderRadius = "4px";
    btn.addEventListener("click", () => currentElement = elKey);
    uiContainer.appendChild(btn);
});

// Physics Matrix update ticks (Evaluated bottom-to-top)
function updatePhysics() {
    let nextGrid = Array(width).fill().map((_, x) => [...grid[x]]);

    for (let y = height - 1; y >= 0; y--) {
        for (let x = 0; x < width; x++) {
            const current = grid[x][y];
            
            // Bypass static structures to save processing cycles
            if (elements[current].fixed) continue;

            // Granular Solid Physics Handler (Sand)
            if (current === "sand") {
                if (y + 1 < height && grid[x][y + 1] === "empty") {
                    nextGrid[x][y] = "empty";
                    nextGrid[x][y + 1] = "sand";
                } else if (y + 1 < height) {
                    // Slide down diagonally if bottom vector is obstructed
                    let dir = Math.random() < 0.5 ? -1 : 1;
                    if (x + dir >= 0 && x + dir < width && grid[x + dir][y + 1] === "empty") {
                        nextGrid[x][y] = "empty";
                        nextGrid[x + dir][y + 1] = "sand";
                    }
                }
            }

            // Liquid Hydrodynamics Handler (Water)
            if (current === "water") {
                if (y + 1 < height && grid[x][y + 1] === "empty") {
                    nextGrid[x][y] = "empty";
                    nextGrid[x][y + 1] = "water";
                } else {
                    // Spread laterally upon baseline collision
                    let dir = Math.random() < 0.5 ? -1 : 1;
                    if (x + dir >= 0 && x + dir < width && grid[x + dir][y] === "empty") {
                        nextGrid[x][y] = "empty";
                        nextGrid[x + dir][y] = "water";
                    }
                }
            }
        }
    }
    grid = nextGrid;
}

// Canvas Frame Buffer Rendering
function draw() {
    ctx.fillStyle = "#111111"; // Absolute fallback dark background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const el = grid[x][y];
            if (el !== "empty") {
                ctx.fillStyle = elements[el].color;
                ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
    }
}

// Engine Animation Frame Loop
function loop() {
    updatePhysics();
    draw();
    requestAnimationFrame(loop);
}

// Bootstrapper initialization call
loop();
console.log("Sandpixels Engine Hooked: Runtime pipeline active.");
