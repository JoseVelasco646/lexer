const query = "DELETE * FROM usuarios  employes WHERE nombre = 'jose'";
const palabrasIniciales = ["SELECT", "DELETE", "WHERE", "CREATE", "UPDATE", "ALTER", "INSERT", "FROM", "LIMIT", "JOIN", "ORDER BY"];
const operadores = ["=", "!=", ">", "<", ">=", "<=", "AND", "*", "OR", "IN", "NOT IN", "LIKE"];
const delimitadores = ["(", ")", "[", "]", "{", "}", ";", ","];

const tokens = [];

let currentToken = "";
let insideString = false;

for (let i = 0; i < query.length; i++) {
  const char = query[i];

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

if (currentToken) {
  tokens.push(currentToken);
}

// Verificar si la primera palabra no es una palabra reservada
if (tokens.length === 0 || !palabrasIniciales.includes(tokens[0].toUpperCase())) {
  console.log("La primera palabra debe de ser una palabra reservada. No es un léxico válido.");
} else {
  const clasificarPalabra = [];

  // Clasificar y mostrar tokens
  for (const token of tokens) {
    if (palabrasIniciales.includes(token.toUpperCase())) {
      clasificarPalabra.push({ tipo: "Palabra reservada", valor: token });
    } else if (operadores.includes(token)) {
      clasificarPalabra.push({ tipo: "Operador", valor: token });
    } else if (token.startsWith("'") && token.endsWith("'")) {
      clasificarPalabra.push({ tipo: "Valor", valor: token });
    } else if (!isNaN(Number(token))) {
      clasificarPalabra.push({ tipo: "Valor", valor: token });
    } else {
      clasificarPalabra.push({ tipo: "Identificador", valor: token });
    }
  }

  // Imprimir tokens clasificados
  for (const token of clasificarPalabra) {
    console.log(`${token.valor}: ${token.tipo}`);
  }
}
