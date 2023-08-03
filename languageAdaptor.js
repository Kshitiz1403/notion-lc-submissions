const getLanguageAdaptor = (language) => {
  let languageAdaptor;
  switch (language) {
    case "python3":
      languageAdaptor = "python";
      break;
    case "cpp":
      languageAdaptor = "c++";
      break;
    case "mysql":
      languageAdaptor = "sql";
      break;
    case "golang":
      languageAdaptor = "go";
      break;
    case "javascript":
      languageAdaptor = "javascript";
      break;
    default:
      languageAdaptor = language;
  }
  return languageAdaptor;
};

module.exports = { getLanguageAdaptor };
