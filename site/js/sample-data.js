// Example medicines used only in DEMO MODE so there is something to try.
// The real list is added from the stock screen (admin.html → सूचना tab →
// "Setup tools" → paste the list from the paper register).

const SAMPLE = `
Paracetamol 500mg tablet | fever
Paracetamol syrup 125mg/5ml | fever
Ibuprofen 400mg tablet | fever
Diclofenac gel | fever
Cetirizine 10mg tablet | cold
Levocetirizine 5mg tablet | cold
Cough syrup (dry cough) | cold
Cough syrup (wet cough) | cold
Saline nasal drops | cold
Menthol vapour rub | cold
ORS (Jeevan Jal) | stomach
Zinc 20mg tablet | stomach
Omeprazole 20mg capsule | stomach
Pantoprazole 40mg tablet | stomach
Antacid syrup | stomach
Domperidone 10mg tablet | stomach
Metronidazole 400mg tablet | stomach
Albendazole 400mg tablet | stomach
Famotidine 20mg tablet | stomach
Amlodipine 5mg tablet | bp
Losartan 50mg tablet | bp
Telmisartan 40mg tablet | bp
Atenolol 50mg tablet | bp
Aspirin 75mg tablet | bp
Atorvastatin 10mg tablet | bp
Metformin 500mg tablet | diabetes
Glimepiride 2mg tablet | diabetes
Gliclazide 80mg tablet | diabetes
Glucose test strips | diabetes
Amoxicillin 500mg capsule | antibiotic
Azithromycin 500mg tablet | antibiotic
Ciprofloxacin 500mg tablet | antibiotic
Cefixime 200mg tablet | antibiotic
Doxycycline 100mg capsule | antibiotic
Vitamin B-complex tablet | vitamins
Calcium + Vitamin D3 tablet | vitamins
Iron + Folic acid tablet | vitamins
Vitamin C 500mg tablet | vitamins
Multivitamin syrup | vitamins
Clotrimazole cream | skin
Povidone-iodine ointment | skin
Calamine lotion | skin
Silver sulfadiazine cream (burns) | skin
Permethrin cream | skin
Ciprofloxacin eye drops | eye_ear
Lubricating eye drops | eye_ear
Ear wax drops | eye_ear
Paracetamol paediatric drops | baby
Gripe water | baby
Baby diapers (medium) | baby
Sanitary pads | women
Folic acid 5mg tablet | women
Pregnancy test kit | women
Cotton roll | firstaid
Crepe bandage | firstaid
Adhesive bandages | firstaid
Antiseptic liquid | firstaid
Gauze pads | firstaid
Surgical tape | firstaid
Digital thermometer | firstaid
Face masks | other
Hand sanitiser | other
`;

const OUT_OF_STOCK = new Set(["Cefixime 200mg tablet", "Gliclazide 80mg tablet", "Permethrin cream", "Gripe water"]);

export const SAMPLE_ITEMS = SAMPLE.trim()
  .split("\n")
  .map((line) => {
    const [name, group] = line.split("|").map((s) => s.trim());
    return { name, group, available: !OUT_OF_STOCK.has(name) };
  });

export const SAMPLE_NOTICE = "New stock of BP and sugar medicines has arrived.";
