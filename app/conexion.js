// En tu archivo main.js
const { app, BrowserWindow } = require('electron');
const { MongoClient } = require('mongodb'); // O require('mongoose')

const url = "mongodb+srv://ialfper:ialfper21@alumnos.zoinj.mongodb.net/alumnos?retryWrites=true&w=majority"; // O tu cadena de conexión
const client = new MongoClient(url);

async function connectToMongo() {
  try {
    await client.connect();
    console.log("Conectado a MongoDB exitosamente");
    const db = client.db("MaquinaElectron"); // Selecciona tu base de datos
    // Ahora puedes usar `db` para interactuar con la base de datos
    return {
      productos: db.collection('productos')
    };
    
  } catch (e) {
    console.error("Error al conectar a MongoDB:", e);
  }
}

app.on('ready', async () => {
  await connectToMongo();
  // Código para crear la ventana de la aplicación
});
