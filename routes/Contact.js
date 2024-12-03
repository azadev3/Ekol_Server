const express = require("express");
const router = express.Router();
const upload = require("../config/MulterConfig");
const Contact = require("../models/ContactModel");
const checkUser = require("../middlewares/checkUser");
const checkPermissions = require("../middlewares/checkPermissions");

router.post(
  "/contact",
  checkUser,
  checkPermissions("create_contact"),
  upload.fields([{ name: "telephone_logo" }, { name: "faks_logo" }, { name: "location_logo" }, { name: "email_logo" }]),
  async (req, res) => {
    try {
      const telephoneLogo = req.files["telephone_logo"] ? `/public/${req.files["telephone_logo"][0].filename}` : "";
      const faksLogo = req.files["faks_logo"] ? `/public/${req.files["faks_logo"][0].filename}` : "";
      const locationLogo = req.files["location_logo"] ? `/public/${req.files["location_logo"][0].filename}` : "";
      const emailLogo = req.files["email_logo"] ? `/public/${req.files["email_logo"][0].filename}` : "";

      const contactData = {
        map: req.body.iframemap,
        telephones: [
          {
            title: {
              az: req.body.telephone_title_az,
              en: req.body.telephone_title_en,
              ru: req.body.telephone_title_ru,
            },
            value: req.body.telephone_value,
            logo: telephoneLogo,
          },
        ],
        faks: {
          title: {
            az: req.body.faks_title_az,
            en: req.body.faks_title_en,
            ru: req.body.faks_title_ru,
          },
          value: req.body.faks_value,
          logo: faksLogo,
        },
        location: {
          title: {
            az: req.body.location_title_az,
            en: req.body.location_title_en,
            ru: req.body.location_title_ru,
          },
          value: req.body.location_value,
          logo: locationLogo,
        },
        email: {
          title: {
            az: req.body.email_title_az,
            en: req.body.email_title_en,
            ru: req.body.email_title_ru,
          },
          value: req.body.email_value,
          logo: emailLogo,
        },
      };

      const saveContact = new Contact(contactData);
      await saveContact.save();
      return res.status(201).json({ message: "Contact information saved successfully!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  }
);

router.get("/contact", checkUser, checkPermissions("list_contact"), async (req, res) => {
  try {
    const datas = await Contact.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }
    return res.status(200).json(datas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/contact/:editid", async (req, res) => {
  try {
    const { editid } = req.params;

    const datasForId = await Contact.findById(editid).lean().exec();
    if (!datasForId) {
      return res.status(404).json({ error: "Not found editid" });
    }

    return res.status(200).json(datasForId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error.message, t: "error is edit contact" });
  }
});

// router.put("/contact/:editid", upload.single("imgback"), async (req, res) => {
//   try {
//     const { editid } = req.params;
//     const { title_az, title_en, title_ru, description_az, description_en, description_ru } = req.body;

//     const updatedContact = await Contact.findByIdAndUpdate(
//       editid,
//       {
//         $set: {
//           title: {
//             az: title_az,
//             en: title_en,
//             ru: title_ru,
//           },
//           description: {
//             az: description_az,
//             en: description_en,
//             ru: description_ru,
//           },
//           image: req.file ? `/public/${req.file.filename}` : "",
//           map: req.body.iframemap,
//         },
//       },
//       { new: true }
//     )
//       .lean()
//       .exec();

//     if (!updatedContact) {
//       return res.status(404).json({ error: "Not found editid" });
//     }

//     return res.status(200).json(updatedContact);
//   } catch (error) {
//     console.error("Error updating data:", error);
//     return res.status(500).json({ error: error.message });
//   }
// });

router.put(
  "/contact/:editid",
  checkUser,
  checkPermissions("update_contact"),
  upload.single("imgback"),
  async (req, res) => {
    try {
      const { editid } = req.params;
      const { title_az, title_en, title_ru, description_az, description_en, description_ru, iframemap } = req.body;

      const existingContact = await Contact.findById(editid).exec();
      if (!existingContact) {
        return res.status(404).json({ error: "Not found: editid" });
      }

      const updateData = {
        title: {
          az: title_az,
          en: title_en,
          ru: title_ru,
        },
        description: {
          az: description_az,
          en: description_en,
          ru: description_ru,
        },
        map: iframemap,
      };

      if (req.file) {
        updateData.image = `/public/${req.file.filename}`;
      }

      const updatedContact = await Contact.findByIdAndUpdate(editid, { $set: updateData }, { new: true }).lean().exec();

      if (!updatedContact) {
        return res.status(404).json({ error: "Not found: editid" });
      }

      return res.status(200).json(updatedContact);
    } catch (error) {
      console.error("Error updating data:", error);
      return res.status(500).json({ error: error.message });
    }
  }
);

router.delete("/contact/:deleteid", checkUser, checkPermissions("delete_contact"), async (req, res) => {
  try {
    const { deleteid } = req.params;
    const deleteData = await Contact.findByIdAndDelete(deleteid);

    if (!deleteData) {
      return res.status(404).json({ message: "Data not found or another error occurred" });
    }

    return res.status(200).json({ message: "Successfully deleted data" });
  } catch (error) {
    console.error("Error deleting data:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/contactfront", async (req, res) => {
  try {
    const acceptLanguage = req.headers["accept-language"];
    const preferredLanguage = acceptLanguage.split(",")[0].split(";")[0];

    const datas = await Contact.find();
    if (!datas || datas.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const filteredData = datas.map((data) => ({
      _id: data._id,
      map: data.map,
      telephones: data.telephones.map((telephone) => ({
        title: telephone.title[preferredLanguage] || telephone.title["en"],
        value: telephone.value,
        logo: telephone.logo,
      })),
      faks: {
        title: data.faks.title[preferredLanguage] || data.faks.title["en"],
        value: data.faks.value,
        logo: data.faks.logo,
      },
      location: {
        title: data.location.title[preferredLanguage] || data.location.title["en"],
        value: data.location.value,
        logo: data.location.logo,
      },
      email: {
        title: data.email.title[preferredLanguage] || data.email.title["en"],
        value: data.email.value,
        logo: data.email.logo,
      },
    }));
    return res.status(200).json(filteredData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
