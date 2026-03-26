const app = require('./src/app');
const mongoose = require('mongoose');
require('dotenv').config(); // .env dosyasını okumak için

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Veritabanına bağlanıyoruz
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB bağlantısı başarılı!');
    
    // Veritabanına bağlandıktan sonra sunucuyu dinlemeye başla
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda çalışıyor.`);
    });
  })
  .catch((err) => {
    console.error('MongoDB bağlantı hatası:', err);
  });