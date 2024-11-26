document.addEventListener("DOMContentLoaded", () => {
    const diceContainer = document.getElementById("dice-container");
    const rollButton = document.getElementById("roll-button");
    const symbols = ["◯", "■", "✖"]; // Einheitlichere Symbole
    let activeElement = null; // Das aktuell bewegte Element
    let offsetX = 0, offsetY = 0;

    // Funktion zum Würfeln
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

        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        die.textContent = symbol;

        // Zufällige Startposition im Container
        const containerRect = diceContainer.getBoundingClientRect();
        const maxX = containerRect.width - 60; // Würfelbreite
        const maxY = containerRect.height - 60; // Würfelhöhe
        die.style.left = Math.random() * maxX + "px";
        die.style.top = Math.random() * maxY + "px";

        // Unterstützung für Maus und Touch
        addDragAndDrop(die);

        return die;
    }

    // Drag-and-Drop (Maus- und Touch-Events)
    function addDragAndDrop(element) {
        // Starten des Verschiebens
        function startDrag(event) {
            activeElement = element;

            // Position bestimmen (Maus oder Touch)
            const clientX = event.touches ? event.touches[0].clientX : event.clientX;
            const clientY = event.touches ? event.touches[0].clientY : event.clientY;

            const rect = element.getBoundingClientRect();
            offsetX = clientX - rect.left;
            offsetY = clientY - rect.top;

            document.addEventListener(event.type === "mousedown" ? "mousemove" : "touchmove", onDrag);
            document.addEventListener(event.type === "mousedown" ? "mouseup" : "touchend", stopDrag);
        }

        // Verschieben
        function onDrag(event) {
            if (!activeElement) return;

            const clientX = event.touches ? event.touches[0].clientX : event.clientX;
            const clientY = event.touches ? event.touches[0].clientY : event.clientY;

            const containerRect = diceContainer.getBoundingClientRect();
            const maxX = containerRect.width - 60; // Würfelbreite
            const maxY = containerRect.height - 60; // Würfelhöhe

            let newX = clientX - containerRect.left - offsetX;
            let newY = clientY - containerRect.top - offsetY;

            // Begrenzung auf den Container
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            activeElement.style.left = `${newX}px`;
            activeElement.style.top = `${newY}px`;
        }

        // Beenden des Verschiebens
        function stopDrag() {
            activeElement = null;
            document.removeEventListener("mousemove", onDrag);
            document.removeEventListener("mouseup", stopDrag);
            document.removeEventListener("touchmove", onDrag);
            document.removeEventListener("touchend", stopDrag);
        }

        // Event-Listener für Maus und Touch-Start
        element.addEventListener("mousedown", startDrag);
        element.addEventListener("touchstart", startDrag);
    }

    // Button-Ereignis zum Neu-Würfeln
    rollButton.addEventListener("click", rollDice);

    // Initiale Würfeln beim Laden
    rollDice();
});
