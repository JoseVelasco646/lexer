const fs = require("fs");

fs.readFile("query.txt", "utf8", (err1, data1) => {
    if (err1) {
        console.error(err1);
        return;
    }

    const palabras_reservadas = ["SELECT", "DELETE", "WHERE", "CREATE", "UPDATE", "ALTER", "INSERT", "FROM", "LIMIT", "JOIN", "ORDER BY", "GROUP BY"];
    const operadores = ["=", "!=", ">", "<", ">=", "<=", "AND", "OR", "IN", "*", "NOT IN", "LIKE"];
    const delimitadores = ["(", ")", "[", "]", "{", "}", ";", ","];

    var tokens = [];

    const query = data1;

    function recorrido_query() {
       
    const palabras = query.split(" ");

        // Iterar sobre las palabras y agregarlas a los tokens
        for (let i = 0; i < palabras.length; i++) {
            let palabra = palabras[i].trim(); // Eliminar espacios en blanco alrededor de cada palabra

            console.log(palabra);
        }
        
    }

    recorrido_query();

    
});
