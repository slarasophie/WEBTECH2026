const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        'MONGODB_URI fehlt. Bitte .env-Datei anlegen (siehe .env.example).'
      );
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB verbunden: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Fehler bei MongoDB-Verbindung: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
