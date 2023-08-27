// Help to delete files (invoices, images, when they are updated or deleted) in folder. Use in controller

const fs = require("fs");

const deleteFile = (filePath) => {
  // delete name & file to the select file (delete file on the path indicate)
  fs.unlink(filePath, (err) => {
    if (err) {
      throw err;
    }
  });
};

exports.deleteFile = deleteFile;
