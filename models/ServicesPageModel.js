const mongoose = require('mongoose');

// Tarihi "DD.MM.YYYY" formatında döndüren fonksiyon
const formatDate = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Aylar 0'dan başlar, +1 eklenmeli
  const year = now.getFullYear();
  return `${day}.${month}.${year}`;
};

const ServicesPageSchema = mongoose.Schema({
  title: {
    az: { type: String, required: false, default: '' },
    en: { type: String, required: false, default: '' },
    ru: { type: String, required: false, default: '' },
  },
  slogan: {
    az: { type: String, required: false, default: '' },
    en: { type: String, required: false, default: '' },
    ru: { type: String, required: false, default: '' },
  },
  description: {
    az: { type: String, required: false, default: '' },
    en: { type: String, required: false, default: '' },
    ru: { type: String, required: false, default: '' },
  },
  image: { type: String, required: false, default: '' },
  statusActive: {
    type: Boolean,
    default: true,
    required: false,
  },
  created_at: {
    type: String,
    default: formatDate, 
  },
});

const ServicesPageModel = mongoose.model('servicespagemodel', ServicesPageSchema);

module.exports = ServicesPageModel;
