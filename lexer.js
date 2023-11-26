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
    console.log("QUERY A EVALUAR: "+ posicionesTotales)
    let indice = 0;
    let fin=false
    if(posicionesTotales[indice]===587){// posicion 0
      console.log("el token 0 es: "+ posicionesTotales[indice])
      indice++;
      if(posicionesTotales[indice]===7 || posicionesTotales[indice]===999){ // posicion 1
        console.log("el token 1 es : "+ posicionesTotales[indice])
        indice++;
        if(posicionesTotales[indice]===3 || posicionesTotales[indice]===241){ // posicion 2
          console.log("el token 2 es: "+posicionesTotales[indice])
          indice++
          if (posicionesTotales[indice] === 999 || posicionesTotales[indice] === 241) { //posicion 3
            console.log("el token 3 es: "+ posicionesTotales[indice])
            indice++
            if(posicionesTotales[indice]===6){
              console.log("el ultimo valor es: "+ posicionesTotales[posicionesTotales.length-1] )
              fin=true
            }
      
          } else {
            console.log("se esperaba un 999 o 241 despues del 3 o 999")
          }
        } else {
          console.log("se esperaba un 3 o un 241 despues del 7 o 999 ")
        }
      }else {
        console.log("se esperaba un 999 o 3 despues del 587")
      }
    } else {
      console.log("se esperaba un 999 en la posicion 0 ")
    }
    if(fin){
      console.log("query terminado, porque el ultimo valor es 6")
    }

  });
});