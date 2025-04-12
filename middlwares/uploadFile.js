const multer = require('multer');
<<<<<<< HEAD
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files');
  },
  filename: function (req, file, cb) {
    const uploadPath = 'public/files';
    const originalName = file.originalname;
    const fileExtension = path.extname(originalName);
    let fileName = originalName;

    // Éviter les doublons : fichier (1), fichier (2), etc.
    let fileIndex = 1;
    while (fs.existsSync(path.join(uploadPath, fileName))) {
      const baseName = path.basename(originalName, fileExtension);
      fileName = `${baseName}_${fileIndex}${fileExtension}`;
      fileIndex++;
    }

    cb(null, fileName);
  },
});

const uploadFile = multer({ storage: storage });

module.exports = uploadFile;
=======

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier où les fichiers seront stockés
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Nom unique pour chaque fichier
  },
});

const upload = multer({ storage });
module.exports = upload;
>>>>>>> d93939d ( création du projet backend)
