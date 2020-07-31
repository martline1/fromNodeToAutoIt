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
