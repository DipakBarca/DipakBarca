// Shop details shown on the website.
// Anything left as "" is hidden on the site until you fill it in.

export const SHOP = {
  name: { en: "Dipak Pharmacy", ne: "दीपक फार्मेसी" },
  tagline: {
    en: "Trusted medicines and care for our village",
    ne: "हाम्रो गाउँका लागि भरपर्दो औषधि र सेवा",
  },

  // Photo of the shop front: put the file in site/images/ and write its path,
  // e.g. "images/shop.jpg". Keep it small (under 200 KB). Leave "" for no photo.
  photo: "",

  // Phone number shown on the site and used for the Call button.
  phone: "+977 9844070470",
  // WhatsApp number: country code + number, digits only (no +, spaces or dashes).
  whatsapp: "9779844070470",

  address: { en: "", ne: "" }, // e.g. { en: "Ward No. 5, Village, District", ne: "वडा नं. ५, गाउँ, जिल्ला" }
  landmark: { en: "", ne: "" }, // e.g. { en: "Next to the health post", ne: "स्वास्थ्य चौकीको छेउमा" }
  // Open the shop location in Google Maps, tap Share, and paste the link here.
  mapsUrl: "",

  // Opening hours in Nepal time. null means "hours vary": the site asks
  // customers to call before coming instead of showing open/closed times.
  // For fixed hours, use 24-hour times per day (0 = Sunday … 6 = Saturday),
  // with null for a closed day, e.g.:
  //   hours: { 0: ["07:00", "20:00"], 1: ["07:00", "20:00"], …, 6: null },
  hours: null,

  pharmacist: { en: "Raj Kumar Mahato", ne: "राज कुमार महतो" },
  npcRegNo: "",
  ddaLicenseNo: "",

  nearestHospital: {
    name: { en: "", ne: "" },
    phone: "",
  },
};

// Google accounts allowed to open the stock screen (admin.html).
// Keep this list the same as the one in firestore.rules — the rules file is
// what actually protects the data; this list only shows a friendly message.
export const ADMIN_EMAILS = ["mahato.d8877@gmail.com"];
