const query ="SELECT * FROM usuarios WHERE nombre = 'Juan'";
const palabrasIniciales = ["SELECT", "DELETE", "WHERE", "CREATE", "UPDATE", "ALTER", "INSERT", "FROM", "LIMIT", "JOIN", "ORDER BY", "GROUP BY"];
const operadores = ["=", "!=", ">", "<", ">=", "<=", "AND", "OR", "IN", "NOT IN", "LIKE"];
const delimitadores = ["(", ")", "[", "]", "{", "}", ";", ","];

const tokens = [];

let currentToken = "";
let insideString = false;

for (let i = 0; i < query.length; i++) {
  const char = query[i];  //char recibe las palabras de query

  if (insideString) {
    if (char === "'" || char === '"') {
      insideString = false;
      currentToken += char;
    } else {
      currentToken += char;
    }
  } else {
    if (char === "'" || char === '"') {
      insideString = true;
      currentToken = char;
    } else if (char === " " || char === "\t" || char === "\n") {
      if (currentToken) {
        tokens.push(currentToken);
      }
      currentToken = "";
    } else if (operadores.includes(char) || delimitadores.includes(char)) {
      if (currentToken) {
        tokens.push(currentToken);
      }
      currentToken = char;
    } else {
      currentToken += char;
    }
  }
}


if (currentToken.trim() !== "") {
  tokens.push(currentToken.trim().toUpperCase());
}

// Verificar si la primera palabra no es una palabra reservada
if (tokens.length === 0 || !palabrasIniciales.includes(tokens[0])) {
  console.log("La primera palabra debe ser una palabra reservada. No es un léxico válido.");
} else {
  const clasificarPalabra = [];

  // Clasificar y mostrar tokens
  for (let i = 0; i < tokens.length; i++) {
    if ((tokens[i] === "ORDER" && tokens[i + 1] === "BY") || (tokens[i] === "GROUP" && tokens[i + 1] === "BY")) {
      clasificarPalabra.push({ tipo: "Palabra reservada", valor: `${tokens[i]} ${tokens[i + 1]}` });
      i++; // Saltar el siguiente token ya que se ha incluido en la categoría "Palabra reservada".
    } else if (tokens[i].includes(" ")) {
      const palabrasSeparadas = tokens[i].split(" ");
      for (const palabra of palabrasSeparadas) {
        if (palabrasIniciales.includes(palabra)) {
          clasificarPalabra.push({ tipo: "Palabra reservada", valor: palabra });
        } else {
          clasificarPalabra.push({ tipo: "Identificador", valor: palabra });
        }
      }
    } else if (palabrasIniciales.includes(tokens[i])) {
      clasificarPalabra.push({ tipo: "Palabra reservada", valor: tokens[i] });
    } else if (operadores.includes(tokens[i])) {
      clasificarPalabra.push({ tipo: "Operador", valor: tokens[i] });
    } else if (tokens[i].startsWith("'") && tokens[i].endsWith("'")) {
      clasificarPalabra.push({ tipo: "Valor", valor: tokens[i] });
    } else if (!isNaN(Number(tokens[i]))) {
      clasificarPalabra.push({ tipo: "Valor", valor: tokens[i] });
    } else if (delimitadores.includes(tokens[i])) {
      clasificarPalabra.push({ tipo: "Delimitador", valor: tokens[i] });
    } else {
      clasificarPalabra.push({ tipo: "Identificador", valor: tokens[i] });
    }
  }

  for (const token of clasificarPalabra) {
    console.log(`${token.valor}: ${token.tipo}`);
  }
}
