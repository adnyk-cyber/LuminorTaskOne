const ValidationModule = (function () {
  const validators = {
    min_char: (value, limit) => value.length >= parseInt(limit),
    max_char: (value, limit) => value.length <= parseInt(limit),
    min_age: (value, limit) => parseInt(value) >= parseInt(limit),
    max_age: (value, limit) => parseInt(value) <= parseInt(limit),
  };

  const defaultMessages = {
    min_char: "{field_name} must be at least {min_char} characters",
    max_char: "{field_name} must be at most {max_char} characters",
    min_age: "{field_name} must be at least {min_age}",
    max_age: "{field_name} must be at most {max_age}",
  };

  function formatMessage(template, fieldName, params) {
    return template
      .replace(/{field_name}/g, fieldName)
      .replace(/{(\w+)}/g, (fullMatch, key) => params[key] || "");
  }

  function parseConditions(str) {
    if (!str) return {};
    if (str.startsWith("{")) str = str.slice(1, -1); 
    const obj = {};
    str.split(/[\s,]+/).forEach(pair => {   // ["min_char:3", "max_char:6"]
      const [key, val] = pair.split(/[:=]/);
      if (key && val) obj[key.trim()] = val.trim();
    });
    return obj; //{ min_char: "3", max_char: "6" }
  }

  function validateForm(form) {
    const fields = form.querySelectorAll("[data-validation-condition]");
    const errors = [];
 
    fields.forEach(field => {
      const fieldName = field.name; //firstName
      const conditions = parseConditions(field.dataset.validationCondition); //{ min_char= "3"  max_char= "6" }
      const value = field.value; //15

      for (const key in conditions) {
        const param = conditions[key]; //18
        const validator = validators[key]; 
        if (!validator || !validator(value, param)) {
          const message = formatMessage(defaultMessages[key], fieldName, {
            [key]: param,
            field_name: fieldName,
          });
          errors.push(message);
        }
      }
    });

    return errors;
  }

  function registerValidator(name, fn, message) {
    validators[name] = fn;
    defaultMessages[name] = message;
  }


  return {
    validateForm,
    registerValidator,
  };
})();
