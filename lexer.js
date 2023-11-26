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

    const palabrasIniciales = ["SELECT", "DELETE", "WHERE", "CREATE", "UPDATE", "ALTER", "INSERT", "FROM", "LIMIT", "JOIN", "ORDER BY", "GROUP BY"];
    const operadores = ["=", "!=", ">", "<", ">=", "<=", "AND", "OR", "IN", "*", "NOT IN", "LIKE"];
    const delimitadores = ["(", ")", "[", "]", "{", "}", ";", ","];

    const tokens = [];
    const identificadores = [];

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
            if (!palabrasIniciales.includes(currentToken) && !operadores.includes(currentToken) && !delimitadores.includes(currentToken)) {
              identificadores.push(currentToken);
            }
          }
          currentToken = "";
        } else if (operadores.includes(char) || delimitadores.includes(char)) {
          if (currentToken) {
            tokens.push(currentToken);
            if (!palabrasIniciales.includes(currentToken) && !operadores.includes(currentToken) && !delimitadores.includes(currentToken)) {
              identificadores.push(currentToken);
            }
          }
          currentToken = char;
        } else {
          currentToken += char;
        }
      }
    }

    if (currentToken.trim() !== "") {
      tokens.push(currentToken);
      if (!palabrasIniciales.includes(currentToken) && !operadores.includes(currentToken) && !delimitadores.includes(currentToken)) {
        identificadores.push(currentToken);
      }
    }

    // Verificar si la primera palabra no es una palabra reservada
    if (tokens.length === 0 || !palabrasIniciales.includes(tokens[0])) {
      console.log("La primera palabra debe ser una palabra reservada. No es un léxico válido.");
    } else {
      const clasificarPalabra = [];

      // Clasificar y mostrar tokens
      for (let i = 0; i < tokens.length; i++) {
        if ((tokens[i] === "ORDER" && tokens[i + 1] === "BY") || (tokens[i] === "GROUP" && tokens[i + 1] === "BY")) {
          clasificarPalabra.push({tipo: "Palabra reservada", valor: `${tokens[i]} ${tokens[i + 1]}`});
          i++; // Saltar el siguiente token ya que se ha incluido en la categoría "Palabra reservada".
        } else if (tokens[i] === "NOT" && tokens[i + 1] === "IN") {
          clasificarPalabra.push({ tipo: "Operador", valor: "NOT IN" });
          i++; // Saltar el siguiente token ya que se ha incluido en la categoría "operador".
        } else if (tokens[i].includes(" ")) {
          const palabrasSeparadas = tokens[i].split(" ");
          for (const palabra of palabrasSeparadas) {
            if (palabrasIniciales.includes(palabra)) {
              clasificarPalabra.push({tipo: "Palabra reservada",valor: palabra});
            } else {
              clasificarPalabra.push({ tipo: "Identificador", valor: palabra });
            }
          }
        } else if (palabrasIniciales.includes(tokens[i])) {
          clasificarPalabra.push({tipo: "Palabra reservada",valor: tokens[i]});
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

    // Mostrar identificadores

    const tokenizar = data2.split("\n");

    // Función para buscar y mostrar la posición de un token en "sqlkeywords.txt"
    

    function buscarPosicionToken(tokenBuscado) {
      const posiciones = [];
      const token = tokenBuscado.trim();
      var logText = '';
    
      for (let i = 0; i < tokenizar.length; i++) {
        if (tokenizar[i].endsWith(`: "${token}",`)) {
          posiciones.push(i + 1);
          logText = (`${token} = ${i + 1}`);
          console.log(logText);
          fs.appendFileSync('tokens.txt', logText + '\n', (err) => {
            if (err) throw err; 
           
            
        });
        }
      }
    
      if (posiciones.length === 0) {
        posiciones.push(999);
        logText = `${token} = ${posiciones[0]} `;
        console.log(logText)
        fs.appendFileSync('tokens.txt', logText + '\n');
      }
    
      
     
    
      return posiciones; // Devuelve el array de posiciones
    }
   
    

    const posicionesTotales = []; // Array para guardar las posiciones de cada token

    for (const token of tokens) {
      const posicionesToken = buscarPosicionToken(token);
      posicionesTotales.push(...posicionesToken); // Agrega todas las posiciones al array posicionesTotales
    }
  

  

    var SELECT_perfecto = [ 587, 7,241,999,6 ] || [587,999,3,999,241,999,6];
    var tokenss = posicionesTotales;
    var tokenizar_identificadores = identificadores;
    var reglas = {
      select: [587, 7,241,999,6], // SELECT
      from: [115, 200, 998], // FROM
    };
    console.log("query a evaluar : "+SELECT_perfecto)
    function valida_select() {
      console.log("Evaluar SELECT : " + SELECT_perfecto);
      for (let i = 0; i < tokenss.length; i++) {
        console.log(tokenss[i]);
        if (tokenss[i] != SELECT_perfecto[i]) {
          console.log("Chabal tenies un error, tio");
          return;
        }
      }
      console.log("query correcto " + query);
    }

    if (
      tokenss[0] == reglas.select[0] &&
      tokenss[1] == reglas.select[1] &&
      tokenss[2] == reglas.select[2] &&
      tokenss[3] == reglas.select[3] &&
      tokenss[4] == reglas.select[4] &&
      tokenss[5] == reglas.select[5]
    ) {
      valida_select();
    } else {
      console.log(tokenss)
      console.log("Error de inicio de token " + tokenss[0]);
      return;
    }
    
  });
});