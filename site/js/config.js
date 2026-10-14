// Shop details shown on the website.
// Replace every placeholder below with your parents' real details.

export const SHOP = {
  name: { en: "Your Pharmacy Name", ne: "तपाईंको फार्मेसीको नाम" },
  tagline: {
    en: "Trusted medicines and care for our village",
    ne: "हाम्रो गाउँका लागि भरपर्दो औषधि र सेवा",
  },

  // Photo of the shop front: put the file in site/images/ and write its path,
  // e.g. "images/shop.jpg". Keep it small (under 200 KB). Leave "" for no photo.
  photo: "",

  // Phone number shown on the site and used for the Call button.
  phone: "+977-9800000000",
  // WhatsApp number: country code + number, digits only (no +, spaces or dashes).
  whatsapp: "9779800000000",

  address: {
    en: "Ward No. 5, Village Name, District, Nepal",
    ne: "वडा नं. ५, गाउँको नाम, जिल्ला, नेपाल",
  },
  landmark: {
    en: "Next to the health post, opposite the school",
    ne: "स्वास्थ्य चौकीको छेउमा, विद्यालयको अगाडि",
  },
  // Open the shop location in Google Maps, tap Share, and paste the link here.
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Nepal",

  // Opening hours in Nepal time, 24-hour format. Use null for a closed day.
  // 0 = Sunday (आइतबार) ... 6 = Saturday (शनिबार)
  hours: {
    0: ["07:00", "20:00"],
    1: ["07:00", "20:00"],
    2: ["07:00", "20:00"],
    3: ["07:00", "20:00"],
    4: ["07:00", "20:00"],
    5: ["07:00", "20:00"],
    6: ["08:00", "12:00"],
  },

  pharmacist: { en: "Pharmacist Name", ne: "फार्मासिस्टको नाम" },
  npcRegNo: "NPC-00000",
  ddaLicenseNo: "DDA-00000",

  nearestHospital: {
    name: { en: "District Hospital", ne: "जिल्ला अस्पताल" },
    phone: "+977-00-000000",
  },
};

// Google accounts allowed to open the stock screen (admin.html).
// Keep this list the same as the one in firestore.rules — the rules file is
// what actually protects the data; this list only shows a friendly message.
export const ADMIN_EMAILS = [
  "parent1@gmail.com",
  "parent2@gmail.com",
  "you@gmail.com",
];
