//modules
const express = require("express");
const ConnectDB = require("./config/Config");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
dotenv.config();

//routes import
const Hero = require("./routes/Hero");
const OurWorks = require("./routes/OurWorks");
const Statistics = require("./routes/Statistics");
const Services = require("./routes/Services");
const Blog = require("./routes/Blog");
const NewBlog = require("./routes/NewBlogs");
const Contact = require("./routes/Contact");
const Socials = require("./routes/Socials");
const Logo = require("./routes/Logo");
const Translate = require("./routes/Translate");
const WhoAreWe = require("./routes/WhoAreWe");
const Management = require("./routes/Management");
const Structures = require("./routes/Structures");
const Partners = require("./routes/Partners");
const GalleryDropdown = require("./routes/GalleryDropdown");
const Imagespage = require("./routes/Imagespage");
const OurWorksInner = require("./routes/OurworksInner");
const CareerOpportunitiesBackground = require("./routes/CareerOpportunitiesBackground");
const WhyEcol = require("./routes/Whyecol");
const RecruitmentProcess = require("./routes/RecruitmentProcess");
const Vacations = require("./routes/Vacations");
const ApplyVacation = require("./routes/ApplyVacation");
const Equipments = require("./routes/Equipments");
const ServicesPage = require("./routes/ServicesPage");
const RichtTextUpload = require("./routes/RichTextUpload");
const SocialLifeCarousel = require("./routes/SocialLifeCarousel");
const SocialLife = require("./routes/SocialLife");
const Purchase = require("./routes/Purchase");
const Certificates = require("./routes/Certificates");
const LisansePage = require("./routes/LisansePage");
const Location = require("./routes/Location");
const Appeals = require("./routes/Appeals");
const Videos = require("./routes/Videos");
const User = require("./routes/User");
const Emails = require("./routes/Emails");
const PurchaseAnnouncement = require("./routes/PurchaseAnnouncement");
const PurchaseRules = require("./routes/PurchaseRules");
const PurchaseLegalForm = require("./routes/PurchaseLegalForm");
const PurchaseNaturalForm = require("./routes/PurchaseNaturalForm");
const PurchaseCountries = require("./routes/PurchaseCountries");
const YearlyCalculations = require("./routes/YearlyCalculation");
const QuarterlyCalculations = require("./routes/Calculations");
//connect Database
ConnectDB();

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "PATCH"] }));
app.use(express.json());

app.use("/public", express.static("/var/data"));

// routes
const apis = [
  Hero,
  OurWorks,
  Statistics,
  Services,
  Blog,
  NewBlog,
  Contact,
  Socials,
  Logo,
  Translate,
  WhoAreWe,
  Management,
  Structures,
  Partners,
  GalleryDropdown,
  Imagespage,
  OurWorksInner,
  CareerOpportunitiesBackground,
  WhyEcol,
  RecruitmentProcess,
  Vacations,
  ApplyVacation,
  Equipments,
  ServicesPage,
  RichtTextUpload,
  SocialLifeCarousel,
  SocialLife,
  Purchase,
  Certificates,
  LisansePage,
  Location,
  Appeals,
  Videos,
  User,
  Emails,
  PurchaseAnnouncement,
  PurchaseRules,
  PurchaseLegalForm,
  PurchaseNaturalForm,
  PurchaseCountries,
  YearlyCalculations,
  QuarterlyCalculations,
];

apis.forEach((api) => {
  app.use("/api", api);
});

//get api length count
app.get("/api/apilength", async (req, res) => {
  res.json({ apiLength: apis.length });
});

//get db collection count
app.get("/api/collectionlength", async (req, res) => {
  try {
    const db = await mongoose.connection.db.listCollections().toArray();
    res.json({ collectionLength: db.length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
