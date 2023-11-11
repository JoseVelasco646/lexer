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
/////////for para recorrer el query y asignarle el valor a la variable char, char recibe los tokens que encuentra 
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
          i++;// Saltar el siguiente token ya que se ha incluido en la categoría "operador".
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

    

    
    const posicionesTotales = []; //array para guardar las posiciones de cada token

    for (const token of tokens) {//este bucle recorre cada elemento en el array tokens, en cada iteracion token toma el valor del elemento actual del array
      const posicionesToken = buscarPosicionToken(token);
      posicionesTotales.push(...posicionesToken); // Agrega todas las posiciones al array posicionesTotales
    }

    console.log(posicionesTotales); // Imprime el array completo con todas las posiciones

    // Busca y muestra la posición de cada token en "sqlkeywords.txt"
    for (const token of tokens) {
      buscarPosicionToken(token);
    }


    ///////funcion para validar el query, de SELECT * FROM TABLA; valida los tokens haciendo un recorrido a tokenizar en busca del array 
    function validarqueryy(tokenizar) {
        for (let i = 0; i < tokenizar.length; i++) {
          if (tokenizar[i] === 587 && tokenizar[i + 1] === 7 && tokenizar [i+2]===241  &&tokenizar[i+4]===6) {
            return true; 
          }
        }
        return false;
      }
  
      if (validarqueryy(posicionesTotales)) {
        console.log("El array es correcto");
      } else {
        console.log("El array es incorrecto");
      }
     
    
    
  });
});
