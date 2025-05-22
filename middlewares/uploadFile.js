const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files'); // Dossier de stockage
  },
  filename: function (req, file, cb) {
    const uploadPath = 'public/files';

    // 🧼 Nettoyer le nom du fichier
    const originalName = file.originalname;
    const cleanedName = originalName
      .replace(/\s+/g, '-') // remplacer les espaces par des tirets
      .replace(/[^a-zA-Z0-9.\-_]/g, ''); // supprimer les caractères spéciaux

    const fileExtension = path.extname(cleanedName);
    let baseName = path.basename(cleanedName, fileExtension);
    let fileName = cleanedName;

    // 🔁 Éviter les doublons (fichier_1.jpg, fichier_2.jpg, etc.)
    let fileIndex = 1;
    while (fs.existsSync(path.join(uploadPath, fileName))) {
      fileName = `${baseName}_${fileIndex}${fileExtension}`;
      fileIndex++;
    }

    cb(null, fileName);
  },
});

const uploadFile = multer({ storage });

module.exports = uploadFile;
