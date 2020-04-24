/** Class for generating table of contents from HTML text */
class TOC {
  /**
   * It extracts the headings from the article text and returns the headings as a html list
   * The table of contents list contains links to article headings
   * The article text is also updated so all headings have an id
   *
   * @param {string} articleText - The article text
   * @returns {Object} tocData The table of contents list and updated article text
   */
  Generate(articleText) {
    /** The given text is checked if it contains no headings */
    var hasHeadings    = this.CheckForHeadings(articleText);
    /** The extracted headings */
    var headings       = "";
    /** The table of contents in html format */
    var tocList        = "";
    /** The updated article data containing heading ids and heading count */
    var articleData    = {"updatedText": "", "headingCount": 0};
    /** The error message returned by the function */
    var errorMsg       = "";

    /** If the given article text has headings */
    if (hasHeadings) {
      /** The headings are extracted from the article text */
      headings    = this.ExtractHeadings(articleText, 1);
      /** The headings are formatted as html list */
      tocList     = this.GenerateTocList(headings);
      /** The article text is updated so the headings contain ids */
      articleData = this.AddIdsToHeadings(articleText, tocList);
    }
    else {
      errorMsg = "The given article text has no headings !";
    }

    var tocData = {
      "tocList": tocList,
      "updatedText": articleData.updatedText,
      "headingCount": articleData.headingCount,
      "errorMsg": errorMsg
    };

    return tocData;
  }

  /**
   * It adds ids to the article headings
   *
   * @param {string} articleText - The article text
   * @param {string} tocList - The toc in html list format
   * @return {Object} articleData The updated article text with ids and the number of headings
   */
  AddIdsToHeadings(articleText, tocList) {
    /** The required updated article data */
    var articleData        = {"updatedText": "", "headingCount": 0};

    /** The updated article text */
    var updatedArticleText = articleText;
    /** The regular expression for parsing the heading ids and text */
    var pattern            = "<a href='#(.+?)'>(.+?)</a>";
    var regex              = new RegExp(pattern, "g");
    /** A single match */
    var match              = "";
    /** The heading count */
    var headingCount       = 0;
    /** Each link text is checked in the article text */
    while(match = regex.exec(tocList)) {
      /** The link text */
      let text           = match[2];
      /** The link id */
      let id             = match[1];
      /** The regular expression used to search for headings. The special regex characters are removed from the text */
      let searchRegex    = new RegExp("<h(\\d)(.*?)>(.*)" + text + "(.*)</h\\d>");
      /** The replacement expression */
      let replacement    = "<h$1$2 id='" + id + "'>$3" + text + "$4</h$1>";
      /** The text is replaced within the article text */
      updatedArticleText = updatedArticleText.replace(searchRegex, replacement);
      /** The heading count is increased by 1 */
      headingCount++;
    }

    articleData.updatedText  = updatedArticleText;
    articleData.headingCount = headingCount;

    return articleData;
  }

  /**
   * It formats the given headings into html format
   *
   * @param {Object} headings - The article headings
   * @return {string} tocList The headings in html format
   */
  GenerateTocList(headings) {
    /** The required toc list */
    var tocList = "<ul>";
    /** Each heading is formatted as html list */
    for (let hText in headings) {
      /** The subheadings */
      let subHeadings = headings[hText];
      /** The hyperlinks are removed from the heading text */
      hText           = hText.replace(/(<([^>]+)>)/ig,"");
      /** The header id is generated */
      let hTextId     = hText.toLowerCase();
      hTextId         = hTextId.replace(/[^a-z]/g, "-");
      /** The header text is converted to link */
      hText           = "<a href='#" + hTextId + "'>" + hText + "</a>";
      /** The heading text is enclosed in <li> tags */
      tocList         += ("<li>" + hText);
      /** If the sub headings are present */
      if (Object.keys(subHeadings).length > 0) {
        /** The toc is generated from sub headings */
        tocList += this.GenerateTocList(subHeadings);
      }
      /** The <li> tag is closed */
      tocList += "</li>";
    }
    /** The toc tag is closed */
    tocList += "</ul>";

    return tocList;
  }

  /**
   * It extracts the headings from the article text
   * The headings are returned as nested associative array
   * The articles should have headings organized in a nested order
   *
   * @param {string} articleText - The article text
   * @param {int} level [1-6] - The heading level
   * @return {array} headingList The list of headings in the article text
   */
  ExtractHeadings(articleText, level = 1) {

    /** If the given text is null, then empty array is returned */
    if (articleText == null) return [];

    /** The new lines are removed from the text */
    let text        = articleText.replace(/\n/g, "");
    text            = text.replace(/\r/g, "");

    /** The header tag */
    let tag         = "h" + level;
    /** The required heading list */
    let headingList = {};
    /** The regular expression for parsing the headings */
    let pattern     = "<" + tag + ".*?>(.+?)</" + tag + ">";
    let regex       = new RegExp(pattern, "g");
    /** The tag is extracted from the article text */
    let matches     = text.matchAll(regex);
    /** The list of all matched headings */
    let headingText = [];
    /** The next match */
    let match       = "";
    /** The text after each heading is extracted */
    while (match = matches.next()) {
      /** If the match is the last one */
      if (match.done) break;
      /** The heading text is updated */
      headingText.push(match);
    }

    /** If no matches were found */
    if (headingText.length == 0 && level < 6) {
      /** The headings for the next level are extracted */
      headingList   = this.ExtractHeadings(text, (level + 1));
    }

    /** The text after each heading is extracted */
    for (let count = 0; count < headingText.length; count++) {
      /** The extracted heading */
      let currentHeading     = headingText[count].value[0];
      let currentHeadingText = headingText[count].value[1];

      /** The next match */
      let nextMatch          =  "";
      /** The next heading */
      let nextHeading        = "";
      /** If the current counter is not the last one */
      if (count < (headingText.length - 1)) {
        /** The next match */
        nextMatch          = headingText[count + 1];
        /** The next heading */
        nextHeading        = nextMatch.value[0];
      }

      /** The regular expression for parsing the headings */
      pattern                = this.EscapeRegex(currentHeading);
      pattern                += "(.+)";
      pattern                += this.EscapeRegex(nextHeading);
      pattern                = pattern.trim();

      regex                  = new RegExp(pattern);

      /** The text between the two headings is extracted */
      let btText             = regex.exec(text);

      /** If the text between the headings could not be parsed */
      if (btText == null) {
        console.log((pattern + "\n\n" + text));
      }

      /** The next text */
      let nextText           = btText[1];
      /** The list of sub headings */
      let subHeadingList     = {};
      /** The sub heading level to check */
      let nextLevel          = level;

      /** The sub headings are extracted */
      do {
        /** The next heading level is checked */
        nextLevel++;
        /** The next level headings are extracted */
        subHeadingList = this.ExtractHeadings(nextText, nextLevel);
      }
      while (Object.keys(subHeadingList).length ==0 && nextLevel < 6);
      /** The sub heading list is added to the main heading */
      headingList[currentHeadingText] = subHeadingList;
    }

    return headingList;
  }

  /**
   * It adds a '\' character before special characters used
   * in the given regular expression
   *
   * @param {string} text - The regular expression to escape
   * @return {string} updatedRegex The escaped regular expression
   */
  EscapeRegex(text) {
    text                = text.replace(/\(/g, "\\(");
    text                = text.replace(/\)/g, "\\)");
    text                = text.replace(/\[/g, "\\[");
    text                = text.replace(/\?/g, "\\?");
    text                = text.replace(/\./g, "\\.");
    text                = text.replace(/\+/g, "\\+");
    var updatedRegex    = text.replace(/\]/g, "\\]");

    return updatedRegex;
  }

  /**
   * It checks if the given text has headings
   *
   * @param {string} text - The article text to check
   * @return {boolean} hasHeadings Indicates if the given text has headings
   */
  CheckForHeadings(text) {

    text                = text.replace(/\r/g, "");
    text                = text.replace(/\n/g, "");

    /** hasHeadings is set to false by default */
    var hasHeadings = false;
    /** The regular expression for checking for headings */
    var pattern     = "<h\\d.*?>(.+?)</h\\d>";
    var regex       = new RegExp(pattern, "g");
    /** The regular expression is matched */
    var matches     = text.matchAll(regex);
    /** The first match is fetched */
    var match       = matches.next();
    /** If there was a match */
    if (!match.done) {
      hasHeadings   = true;
    }

    return hasHeadings;
  }
};

module.exports = new TOC();
