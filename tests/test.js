const toc    = require("../index.js");
const fs     = require("fs");
const path   = require("path");
const assert = require("assert");
const dir    = path.join(__dirname, 'data');

/** The data folder is read */
fs.readdir(dir, function (err, files) {
    /** If an error occured */
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    /** Each file is read */
    files.forEach(function (file) {
      /** The file is read */
      fs.readFile(dir + "/" + file, 'utf8', (err, data) => {
          /** If there was an error */
          if (err != null ) {
            console.log("\nCould not read the file: " + file + "\n");
          }
          else {
            /** The table of contents is generated */
            var tocData = toc.Generate(data);
            /** If no headings could be parsed and the error message is empty, then the test fails */
            if (tocData.headingCount == 0 && tocData.errorMsg == "") {
              assert(0, "\nHeadings could not be extracted from the file: " + file + "\n");
              console.log("Error in running extracting headings from " + file + "\n");
            }
            /** The test passes */
            else {
              assert(1);
            }
          }
      });
    });
    console.log(files.length + " files were successfully tested\n");
});
