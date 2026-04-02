export const configureHandlebars = () => {
  Handlebars.registerHelper("concat", function () {
    let outStr = "";
    for (const arg in arguments) {
      if (typeof arguments[arg] !== "object") outStr += arguments[arg];
    }
    return outStr;
  });

  Handlebars.registerHelper("ifEq", function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper("add", function (num1, num2) {
    return num1 + num2;
  });
};
