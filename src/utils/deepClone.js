export default function deepClone(obj) {
  let result;
  const isArray = Array.isArray(obj);

  if (isArray) {
    result = cloneArray(obj);
  } else {
    result = cloneObject(obj);
  }

  return result;
}

function cloneArray(array) {
  const arr = [];

  console.log("cloneArray array:", array);
  array.forEach((item) => {
    if (Array.isArray(item)) {
      arr.push(cloneArray(item));
    } else if (typeof item === "object") {
      console.log("object inside forEach:", item);
      arr.push(cloneObject(item));
    } else {
      arr.push(item);
    }
  });

  return arr;
}

function cloneObject(object) {
  const obj = {};

  console.log("object:", object);

  for (const key in object) {
    if (typeof object[key] === "object") {
      obj[key] = cloneObject(object[key]);
    } else if (Array.isArray(object[key])) {
      obj[key] = cloneArray(object[key]);
    } else {
      obj[key] = object[key];
    }
  }

  return obj;
}
