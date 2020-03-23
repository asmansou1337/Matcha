const multer = require('multer');
const path = require('path');
const chalk = require('chalk');

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '-' +file.originalname);
  }
});

// Init Upload (Limit file size to 10mb)
const uploadProfile = multer({
    storage: storage,
    limits:{
      fileSize: 10000000
    },
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    },
}).single('profileImg');


// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  console.log(chalk.blue('path :' + path.extname(file.originalname).toLowerCase()));
  console.log(chalk.blue('mime :' + file.mimetype));

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Only Images Are Allowed!');
  }
}


module.exports = uploadProfile;