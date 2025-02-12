//modules
const express = require('express');
const ConnectDB = require('./config/Config');
// const path = require("path");
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
dotenv.config();

//routes import
const Hero = require('./routes/Hero');
const OurWorks = require('./routes/OurWorks');
const Statistics = require('./routes/Statistics');
const Services = require('./routes/Services');
const Blog = require('./routes/Blog');
const BlogImages = require('./routes/DescriptionBlogImage');
const NewBlog = require('./routes/NewBlogs');
const Contact = require('./routes/Contact');
const Socials = require('./routes/Socials');
const Logo = require('./routes/Logo');
const Translate = require('./routes/Translate');
const WhoAreWe = require('./routes/WhoAreWe');
const Management = require('./routes/Management');
// const Structures = require("./routes/Structures");
const Partners = require('./routes/Partners');
const GalleryDropdown = require('./routes/GalleryDropdown');
const Imagespage = require('./routes/Imagespage');
const OurWorksInner = require('./routes/OurworksInner');
const OurWorksImagesRoute = require('./routes/OurWorksImages');
const CareerOpportunitiesBackground = require('./routes/CareerOpportunitiesBackground');
const WhyEcol = require('./routes/Whyecol');
const RecruitmentProcess = require('./routes/RecruitmentProcess');
const Vacations = require('./routes/Vacations');
const ApplyVacation = require('./routes/ApplyVacation');
const Equipments = require('./routes/Equipments');
const ServicesPage = require('./routes/ServicesPage');
const RichtTextUpload = require('./routes/RichTextUpload');
const SocialLifeCarousel = require('./routes/SocialLifeCarousel');
const SocialLife = require('./routes/SocialLife');
const Purchase = require('./routes/Purchase');
const Certificates = require('./routes/Certificates');
const LisansePage = require('./routes/LisansePage');
const Location = require('./routes/Location');
const Appeals = require('./routes/Appeals');
const Videos = require('./routes/Videos');
const User = require('./routes/User');
const Emails = require('./routes/Emails');
const PurchaseAnnouncement = require('./routes/PurchaseAnnouncement');
const PurchaseRules = require('./routes/PurchaseRules');
const PurchaseLegalForm = require('./routes/PurchaseLegalForm');
const PurchaseNaturalForm = require('./routes/PurchaseNaturalForm');
const PurchaseCountries = require('./routes/PurchaseCountries');
const YearlyCalculations = require('./routes/YearlyCalculation');
const QuarterlyCalculations = require('./routes/Calculations');
// const StructureCategories = require("./routes/StructureCategory");
const EqInnerDescription = require('./routes/EqInnerDescription');
const ToolsInnerRoute = require('./routes/ToolsInnerRoute');
const ToolsInnerImagesRoute = require('./routes/ToolsInnerImages');
const ShowHiddenRehberlik = require('./routes/ShowHiddenRehberlik');
const ShowHiddenPurchase = require('./routes/ShowHiddenPurchase');
const ShowHiddenCarier = require('./routes/ShowHiddenCarier');
const ShowHiddenSocial = require('./routes/ShowHiddenSocial');
const ShowHiddenHero = require('./routes/ShowHiddenHero');
const ShowHiddenOurWorksHome = require('./routes/ShowHiddenOurWorksHome');
const ShowHiddenMedia = require('./routes/ShowHiddenMedia');
const ShowHiddenAbout = require('./routes/ShowHiddenAbout');
const ShowHiddenActivity = require('./routes/ShowHiddenActivity');
const ShowHiddenContact = require('./routes/ShowHiddenContactRoute');
const StructureImgRoute = require('./routes/StructureRoute');
const PageRoute = require('./routes/Page');
// ROLES PERMISSIONS
const RoleRoute = require('./routes/RoleRoute');
const PermissionRoute = require('./routes/PermissionRoute');
const CreateUserRoute = require('./routes/CreateUserRoute');
const EnterpriseRoute = require('./routes/EnterpriseRoute');
const StageRoute = require('./routes/StageRoute');
const ProcedureRoute = require('./routes/ProcedureRoute');
const NewBlogImages = require('./routes/DescriptionNewBlogImage');
// SEO
const MetaTagsHome = require('./routes/MetaTagsHomeRoute');
const MetaTagsBizKimik = require('./routes/MetaBizKimikRoute');
const MetaTagsRehberlik = require('./routes/MetaRehberlik');
const MetaTagsStruktur = require('./routes/MetaStruktur');
const MetaTagsSertifikatlar = require('./routes/MetaSertifikatlar');
const MetaTagsPartnyorlar = require('./routes/MetaPartnyorlar');
const MetaTagsGorduyumuzIsler = require('./routes/MetaGorduyumuzIsler');
const MetaTagsHesabatlar = require('./routes/MetaHesabatlar');
const MetaTagsAvadanliqlar = require('./routes/MetaAvadanliqlar');
const MetaTagsXidmetler = require('./routes/MetaXidmetler');
const MetaTagsSatinalmaElanlari = require('./routes/MetaSatinalma');
const MetaTagsSatinalmaQaydalari = require('./routes/MetaSatinalmaQaydalari');
const MetaTagsSatinalmaElaqe = require('./routes/MetaSatinalmaElaqe');
const MetaTagsXeberler = require('./routes/MetaXeberler');
const MetaTagsQalereya = require('./routes/MetaQalereya');
const MetaTagsSosialHeyat = require('./routes/MetaSosialHeyat');
const MetaTagsBloqlar = require('./routes/MetaBloqlar');
const MetaTagsKaryeraImkanlariUmumiMelumat = require('./routes/MetaKaryeraMelumat');
const MetaTagsKaryeraImkanlariVakansiyalar = require('./routes/MetaKaryeraVakansiyalar');
const MetaTagsElaqe = require('./routes/MetaElaqe');
const MetaTagsBloqlarDaxili = require('./routes/MetaBloqlarDaxili');
const MetaTagsXeberlerDaxili = require('./routes/MetaXeberlerDaxili');
const MetaFavicon = require('./routes/MetaFaviconRoute');
const MailConfigRoute = require('./routes/MailConfigRoute');
const DynamicCategories = require('./routes/DynamicCategory');
const DynamicCategoriesContents = require('./routes/DynamicCategoryContent');
const AddIconFooterRoute = require('./routes/AddIconFooter');

//connect Database
ConnectDB();

app.use(cors({ origin: '*' }));
// app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"] }));
app.use(express.json());

// app.use("/public", express.static(path.join(__dirname, "public")));

app.use('/public', express.static('/var/data'));

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
  // Structures,
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
  BlogImages,
  OurWorksImagesRoute,
  // StructureCategories,
  EqInnerDescription,
  ToolsInnerRoute,
  ToolsInnerImagesRoute,
  ShowHiddenRehberlik,
  ShowHiddenHero,
  ShowHiddenAbout,
  ShowHiddenActivity,
  ShowHiddenMedia,
  StructureImgRoute,
  PageRoute,
  // ROLES PERMISSIONS
  RoleRoute,
  PermissionRoute,
  CreateUserRoute,
  ShowHiddenPurchase,
  ShowHiddenCarier,
  ShowHiddenOurWorksHome,
  ShowHiddenContact,
  EnterpriseRoute,
  StageRoute,
  ShowHiddenSocial,
  ProcedureRoute,
  NewBlogImages,
  // SEO
  MetaTagsHome,
  MetaTagsBizKimik,
  MetaTagsRehberlik,
  MetaTagsStruktur,
  MetaTagsSertifikatlar,
  MetaTagsPartnyorlar,
  MetaTagsGorduyumuzIsler,
  MetaTagsHesabatlar,
  MetaTagsAvadanliqlar,
  MetaTagsXidmetler,
  MetaTagsSatinalmaElanlari,
  MetaTagsSatinalmaQaydalari,
  MetaTagsSatinalmaElaqe,
  MetaTagsXeberler,
  MetaTagsQalereya,
  MetaTagsSosialHeyat,
  MetaTagsBloqlar,
  MetaTagsKaryeraImkanlariUmumiMelumat,
  MetaTagsKaryeraImkanlariVakansiyalar,
  MetaTagsElaqe,
  MetaTagsBloqlarDaxili,
  MetaTagsXeberlerDaxili,
  MetaFavicon,
  MailConfigRoute,
  DynamicCategories,
  DynamicCategoriesContents,
  AddIconFooterRoute,
];

apis.forEach((api) => {
  app.use('/api', api);
});

//get api length count
app.get('/api/apilength', async (req, res) => {
  res.json({ apiLength: apis.length });
});

//get db collection count
app.get('/api/collectionlength', async (req, res) => {
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
