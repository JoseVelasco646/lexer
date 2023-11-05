const fs = require("fs");

fs.readFile("query.txt", "utf8", (err1, data1) => {
  if (err1) {
    console.error(err1);
    return;
  }
  fs.readFile("sqlkeywords.txt", "utf8", (err2, data2) => {
    if (err2) {
      console.error(err2);
      return;
    }

    const query = data1;

    const palabrasIniciales = [
      "SELECT",
      "DELETE",
      "WHERE",
      "CREATE",
      "UPDATE",
      "ALTER",
      "INSERT",
      "FROM",
      "LIMIT",
      "JOIN",
      "ORDER BY",
      "GROUP BY",
    ];
    const operadores = [
      "=",
      "!=",
      ">",
      "<",
      ">=",
      "<=",
      "AND",
      "OR",
      "IN",
      "*",
      "NOT IN",
      "LIKE",
    ];
    const delimitadores = ["(", ")", "[", "]", "{", "}", ";", ","];

    const tokens = [];

    let currentToken = "";
    let insideString = false;

    for (let i = 0; i < query.length; i++) {
      const char = query[i]; //char recibe las palabras de query

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
      tokens.push(currentToken);
    }

    // Verificar si la primera palabra no es una palabra reservada
    if (tokens.length === 0 || !palabrasIniciales.includes(tokens[0])) {
      console.log( "La primera palabra debe ser una palabra reservada. No es un léxico válido." );
    } else {
      const clasificarPalabra = [];

      // Clasificar y mostrar tokens
      for (let i = 0; i < tokens.length; i++) {
        if (
          (tokens[i] === "ORDER" && tokens[i + 1] === "BY") ||
          (tokens[i] === "GROUP" && tokens[i + 1] === "BY")
        ) {
          clasificarPalabra.push({
            tipo: "Palabra reservada",
            valor: `${tokens[i]} ${tokens[i + 1]}`,
          });
          i++; // Saltar el siguiente token ya que se ha incluido en la categoría "Palabra reservada".
        } else if (tokens[i] === "NOT" && tokens[i + 1] === "IN") {
          clasificarPalabra.push({ tipo: "Operador", valor: "NOT IN" });
          i++;
        } else if (tokens[i].includes(" ")) {
          const palabrasSeparadas = tokens[i].split(" ");
          for (const palabra of palabrasSeparadas) {
            if (palabrasIniciales.includes(palabra)) {
              clasificarPalabra.push({
                tipo: "Palabra reservada",
                valor: palabra,
              });
            } else {
              clasificarPalabra.push({ tipo: "Identificador", valor: palabra });
            }
          }
        } else if (palabrasIniciales.includes(tokens[i])) {
          clasificarPalabra.push({
            tipo: "Palabra reservada",
            valor: tokens[i],
          });
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

    const tokenizar = data2.split("\n"); 

    // Función para buscar y mostrar la posición de un token en "sqlkeywords.txt"
    function buscarPosicionToken(tokenBuscado) {
      const posiciones = [];
      const token = tokenBuscado.trim();

      for (let i = 0; i < tokenizar.length; i++) {
        if (tokenizar[i].endsWith(`: "${token}",`)) {
          posiciones.push(i + 1);
        }
      }

      return posiciones; // Devuelve el array de posiciones
    }

    

    // Luego, puedes llamar a la función buscarPosicionToken para cada token y almacenar todas las posiciones en un solo array.
    const posicionesTotales = [];

    for (const token of tokens) {
      const posicionesToken = buscarPosicionToken(token);
      posicionesTotales.push(...posicionesToken); // Agrega todas las posiciones al array posicionesTotales
    }

    console.log(posicionesTotales); // Imprime el array completo con todas las posiciones

    // Busca y muestra la posición de cada token en "sqlkeywords.txt"
    for (const token of tokens) {
      buscarPosicionToken(token);
    }
    function validarqueryy(tokenizar) {
        for (let i = 0; i < tokenizar.length; i++) {
          if (tokenizar[i] === 587 && tokenizar[i + 1] === 7 && tokenizar [i+2]===241) {
            return true; // Se encontró 587 seguido de 7
          }
        }
        return false; // No se encontró 587 seguido de 7
      }
  
      if (validarqueryy(posicionesTotales)) {
        console.log("El array es correcto");
      } else {
        console.log("El array es incorrecto");
      }
    
    
  });
});
