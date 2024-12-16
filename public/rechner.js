document.querySelector("h1").style.color = "orange";

const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const operators = ["+", "-", "*", "/"];

buttons.forEach(button => {
    button.addEventListener("click", function () {
        const value = button.textContent;
        const lastChar = display.value.slice(-1);

        if (!isNaN(value)) {
            display.value += value;
        } else if (operators.includes(value)) {
            if (!operators.includes(lastChar) && lastChar !== "") {
                display.value += value;
            }
        } else if (value === ",") {
            const parts = display.value.split(new RegExp(`[\\${operators.join("\\")}]`));
            const currentPart = parts[parts.length - 1];
            if (!currentPart.includes(",")) {
                display.value += ",";
            }
        } else if (value === "(") {
            if (display.value === "" || operators.includes(lastChar) || lastChar === "(") {
                display.value += value;
            }
        } else if (value === ")") {
            const openBrackets = (display.value.match(/\(/g) || []).length;
            const closeBrackets = (display.value.match(/\)/g) || []).length;

            if (
                openBrackets > closeBrackets &&
                lastChar !== "(" &&
                !operators.includes(lastChar)
            ) {
                display.value += value;
            }
        } else if (value === "C") {
            display.value = "";
        } else if (value === "=") {
            try {
                const sanitizedExpression = display.value.replace(/,/g, "."); // Komma durch Punkt ersetzen
                const result = calculate(sanitizedExpression);
                // Ergebnis auf 10 Dezimalstellen runden und Komma zurücksetzen
                display.value = parseFloat(result.toFixed(10)).toString().replace(/\./g, ",");
            } catch (error) {
                display.value = "Fehler";
            }
        }
    });
});

// Berechnung durchführen
function calculate(expression) {
    const tokens = tokenize(expression);
    const postfix = infixToPostfix(tokens);
    const result = evaluatePostfix(postfix);
    return result;
}

// 1. Tokenisierung
function tokenize(expression) {
    const tokens = [];
    let number = "";

    for (let char of expression) {
        if (!isNaN(char) || char === ".") {
            number += char; // Teil einer Zahl
        } else {
            if (number) {
                tokens.push(number); // Zahl abschließen
                number = "";
            }
            if (char.trim() !== "") {
                tokens.push(char); // Operator oder Klammer
            }
        }
    }
    if (number) tokens.push(number); // Letzte Zahl hinzufügen
    return tokens;
}

// 2. Infix zu Postfix (Shunting-Yard-Algorithmus)
function infixToPostfix(tokens) {
    const precedence = { "+": 1, "-": 1, "*": 2, "/": 2 }; // Operatorprioritäten
    const stack = [];
    const output = [];

    tokens.forEach(token => {
        if (!isNaN(token)) {
            output.push(token); // Zahlen direkt in die Ausgabe
        } else if (token in precedence) {
            while (
                stack.length &&
                precedence[stack[stack.length - 1]] >= precedence[token]
            ) {
                output.push(stack.pop());
            }
            stack.push(token);
        } else if (token === "(") {
            stack.push(token); // Öffnungsklammer
        } else if (token === ")") {
            // Alles bis zur Öffnungsklammer in die Ausgabe schreiben
            while (stack.length && stack[stack.length - 1] !== "(") {
                output.push(stack.pop());
            }
            stack.pop(); // Öffnungsklammer entfernen
        }
    });

    // Verbleibende Operatoren aus dem Stack in die Ausgabe
    while (stack.length) {
        output.push(stack.pop());
    }

    return output;
}

// 3. Postfix-Auswertung
function evaluatePostfix(postfix) {
    const stack = [];

    postfix.forEach(token => {
        if (!isNaN(token)) {
            stack.push(parseFloat(token)); // Zahlen auf den Stack
        } else {
            const b = stack.pop();
            const a = stack.pop();
            switch (token) {
                case "+":
                    stack.push(a + b);
                    break;
                case "-":
                    stack.push(a - b);
                    break;
                case "*":
                    stack.push(a * b);
                    break;
                case "/":
                    stack.push(a / b);
                    break;
            }
        }
    });

    return stack[0]; // Ergebnis
}
