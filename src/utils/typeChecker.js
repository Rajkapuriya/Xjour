function isTypeValid(type, value) {
  let valueCopy = value;
  let typesArray = [];
  let result;

  const types = {
    boolean: (value) => {
      if (typeof value === "boolean") {
        return true;
      }
      return false;
    },
    string: (value) => {
      if (typeof value === "string") {
        return true;
      }
      return false;
    },
    number: (value) => {
      if (typeof value === "number") {
        return true;
      }
      return false;
    },
    array: (value) => {
      if (typeof value === "object" && typeof value?.length !== "undefined") {
        return true;
      }
      return false;
    },
    object: (value) => {
      if (typeof value === "object") {
        return true;
      }
      return false;
    },
    function: () => {
      if (typeof valueCopy === "function") {
        return true;
      }
      return false;
    },
    null: () => {
      if (typeof valueCopy === "object" && Boolean(valueCopy) === false) {
        return true;
      }
      return false;
    },
  };

  if (types["array"](type)) {
    typesArray = type.map((item) => {
      return types[item](valueCopy);
    });

    if (typesArray.every((element) => element === false)) {
      result = false;
    } else {
      result = true;
    }
  } else {
    result = types[type](valueCopy);
  }

  return result;
}

export default isTypeValid;
