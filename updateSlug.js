const mongoose = require('mongoose');
const BlogModel = require('../server/models/BlogModel'); 

const updateSlugs = async () => {
  try {
    await mongoose.connect(process.env.URL, {
      dbName: process.env.DB,
    });

    const result = await BlogModel.updateMany(
      { slug: { $exists: false } }, // Slug alanı olmayanları hedefle
      { $set: { slug: { az: '', en: '', ru: '' } } }, // Slug alanını ekle
    );

    console.log(`Updated ${result.modifiedCount} documents.`);
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating slugs:', error);
    mongoose.connection.close();
  }
};

updateSlugs();
