# Pasar de NODE a AutoIt

Este proyecto muestra de forma sencilla cómo se pueden usar templates para pasar valores de node a AutoIt 
o a cualquier lenguaje

## Estructura y definición

### Nuestro template `./fileTemplate.txt`, tendrá el código fuente del lenguaje que queremos ejecutar y una serie de identificadores:

```autoit
#include <MsgBoxConstants.au3>

MsgBox($MB_ICONINFORMATION, "<<<NODE_title>>>", "<<<NODE_body>>>")
```

En este caso nuestro identificador es "<<<NODE_>>>" para cambiarlo solamente tenemos que asegurarnos que sea único y que esté definido en nuestro script que 
hará el cambio.

### El script que hará el cambio
Este script, insertará la información de un objeto de node hacia el destinatario template. la información que se tiene es estática, pero pudiera ser más compleja 
incluso calcularse o pedirse a una base de datos, para ello, simplemente modificar la función principal:

```js
const fs = require("fs");

const read = dir => new Promise((resolve, reject) => {
	fs.readFile(dir, { encoding : "utf8" }, (err, data) => {
		if (err) {
			reject(err);
		} else {
			resolve(data);
		}
	});
});

const write = (dir, data) => new Promise((resolve, reject) => {
	fs.writeFile(dir, data, { encoding : "utf8" }, (err) => {
		if (err) {
			reject(err);
		} else {
			resolve();
		}
	})
});

const mergeData = (source, data) => {
	for (const [key, value] of Object.entries(data)) {
		const regex = new RegExp(`<<<NODE_${key}>>>`, "g");

		// Remueve todas las apariciones de este identificador y las cambia por 
		// el valor que queremos
		source = source.replace(regex, value);
	}

	return source;
};

module.exports = (async () => {
	// Conseguir la información del template
	const template = await read(`${__dirname}/fileTemplate.txt`);

	// Definir variables que quieres tener en otro lenguaje
	// Esta información puede ser calculada, o incluso venir de una api
	const data = {
		title : "Este es el título",
		body  : "Este es el cuerpo!",
	};

	// Combinar la información que quieres exportar con la del template
	// El template tendrá "<<<NODE_>>>" en donde debería de sustituir
	// Podría tener cualquier cosa que sea única y que lo identifique, yo 
	// decidí que sea "<<<NODE_description>>>" para "description", por ejemplo
	const mergedDataStr = mergeData(template, data);

	// Crear el archivo de autoit con con los caracteres que queremos sustituir
	await write(`${__dirname}/hello_world.au3`, mergedDataStr);

	// Enviar mensaje de éxito
	console.log("[insertData.js] Se ha creado el archivo correctamente!");
})();
```

## ¿Cómo usarse?

Para convertir nuestros valores definidos en *data* dentro de `insertData.js`, simplemente tenemos que hacer:

```sh
$ node ./insertData.js
```

Y listo, esto generará `hello_world.au3`.
