// script.js
document.addEventListener("DOMContentLoaded", () => {
    const diceContainer = document.getElementById("dice-container");
    const rollButton = document.getElementById("roll-button");
    const symbols = ["○", "□", "✕"];
    let draggedElement = null;

    // Funktion zum Würfeln der Symbole
    function rollDice() {
        diceContainer.innerHTML = ""; // Container leeren
        for (let i = 0; i < 4; i++) {
            const die = createDie();
            diceContainer.appendChild(die);
        }
    }

    // Funktion zur Erstellung eines Würfels
    function createDie() {
        const die = document.createElement("div");
        die.classList.add("die");
        die.draggable = true;

        const symbol = document.createElement("div");
        symbol.classList.add("symbol");
        symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];

        die.appendChild(symbol);

        // Drag-and-Drop-Ereignisse hinzufügen
        die.addEventListener("dragstart", (e) => {
            draggedElement = die; // Das gezogene Element speichern
            e.dataTransfer.effectAllowed = "move"; // Verschieben erlauben
            setTimeout(() => {
                die.style.opacity = "0.5"; // Element halbtransparent machen
            }, 0);
        });

        die.addEventListener("dragend", () => {
            draggedElement.style.opacity = "1"; // Element wieder sichtbar machen
            draggedElement = null; // Referenz aufheben
        });

        return die;
    }

    // Drag-and-Drop-Ereignisse für den Container
    diceContainer.addEventListener("dragover", (e) => {
        e.preventDefault(); // Standardverhalten verhindern
    });

    diceContainer.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedElement) {
            const dropTarget = e.target.closest(".die");
            if (dropTarget && dropTarget !== draggedElement) {
                // Gezogene Würfel vor dem Ziel platzieren
                diceContainer.insertBefore(draggedElement, dropTarget);
            } else {
                // An das Ende des Containers verschieben
                diceContainer.appendChild(draggedElement);
            }
        }
    });

    // Button-Ereignis zum Neu-Würfeln
    rollButton.addEventListener("click", rollDice);

    // Würfel beim Laden der Seite initialisieren
    rollDice();
});



  
  