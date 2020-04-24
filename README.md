# Node.js Table of Contents Generator

A Node.js module for generating table of contents from HTML text

### Installation

```
npm i @pakjiddat/toc --save
```

The above command will download the package to the **node_modules** folder. It will also add an entry to your **package.json file**

### Usage

```
const toc    = require("@pakjiddat/toc/index");

var tocData  = toc.Generate(data);
```

In the above command the data parameter is the article text in HTML format. The tocData variable contains the following:

- **tocList**. The table of contents list. It is formatted as a nested unordered HTML list
- **updatedText**. The updated article text with id attribute added to all the headings
- **headingCount**. The number of headings found in the article
- **errorMsg**. An error message describing the error

### Structure

The only required file is **index.js** in the root project folder. It contains a single exported class called TOC. The class has one public function called Generate which generates table of contents for the given article text.

The article text must be in HTML format. It returns the table of contents formatted as a nested unordered HTML list. Each item in the nested list links to a heading in the main article.

### How it works

The TOC class extracts all HTML tags from h1 to h6. It then creates an unordered HTML list in the same order as the article headings. It also adds an **id** attribute to each **h** tag. This allows the items in the table of contents to link to the headings in the article.

The TOC class uses a divide and conquer approach based on recursion for extracting the headings from the article text. It first extracts all the h1 tags from the article text. It then extracts the text between each successive h1 tag and then extracts the h2 text from this text. It then extracts the text between each successive h2 tag. In this way it continues until all tags from h1 to h6 have been extracted. If a tag for example h1 is not found, then the next higher order tag which is h2 is extracted.

### Limitations

The limitations of the package are:

- It only supports article text in HTML format
- It requires that article headings are arranged in numeric order. i.e high order headings contain lower order headings. For example h1 tags are followed by h2-h6 tags

### Testing

To test the package, extract the file tests/data.zip. This file contains about 150 articles with headings. Copy all articles to the tests/data folder. Next run the command:

```
npm test
```

This will run the test code in tests/test.js. The test code reads each file in the data folder and extracts the headings from the file. It then checks if the headings have been extracted. In case of errors an error is message is logged to the console
