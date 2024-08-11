const mongoose = require("mongoose");
const { Schema } = mongoose;

// DepartmentType Schema
const DepartmentTypeSchema = new Schema({
  category: { type: String, required: true },
  title: {
    az: { type: String, required: true },
    en: { type: String, required: true },
    ru: { type: String, required: true },
  },
});

// DepartamentStructure Schema
const DepartamentStructureSchema = new Schema({
  departments: DepartmentTypeSchema
});

// Model oluşturma
const StructuresModel = mongoose.model("structuremodel", DepartamentStructureSchema);

// Export the model
module.exports = StructuresModel;
