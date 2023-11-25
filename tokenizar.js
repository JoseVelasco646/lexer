const fs = require("fs");

fs.readFile("tokens.txt", "utf8", (err1, data1) => {
    if (err1) {
      console.error(err1);
      return;
    }
    function validarQuery(arr) {
        const secuenciaEsperada = [587,7,241,999,6];
        let index = 0;
      
        for (const valor of arr) {
          const expected = secuenciaEsperada[index];
      
          if (Array.isArray(expected)) {
            // Si el elemento esperado es un array de posibles valores
            if (!expected.includes(valor)) {
              return false;
            }
            // Si el valor es parte de los valores esperados, moverse al siguiente índice de la secuencia esperada
            index++;
          } else {
            if (valor !== expected) {
              return false;
            }
            // Si el valor coincide con el esperado, pasar al siguiente índice de la secuencia esperada
            index++;
          }
        }
      
        // Verificar si se recorrió toda la secuencia esperada
        return index === secuenciaEsperada.length;
      }
      
      // Ejemplo de uso con el array proporcionado
      const queryArray = data1;
      console.log(queryArray)
      const esValido = validarQuery(queryArray);
      
      if (esValido) {
        console.log('El query es válido según la secuencia definida.');
      } else {
        console.log('El query no cumple con la secuencia esperada.');
      }
      






});
