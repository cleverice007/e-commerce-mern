const serialize = (obj) => {
  const serialized = {};
  for (const [key, value] of Object.entries(obj)) {
    if ((typeof value === 'object' && value !== null) || Array.isArray(value)) {
      // if the value is an object or array, stringify it
      serialized[key] = JSON.stringify(value);
    } else {
      // store the value as a string
      serialized[key] = value;
    }
  }
  return serialized;
};



const deserialize = (obj) => {
  const deserializedObj = {};
  for (const [key, value] of Object.entries(obj)) {
    if (!isNaN(value) && value.trim() !== '') {
      // turn numeric strings back into numbers
      deserializedObj[key] = parseFloat(value);
    } else if (value === 'true' || value === 'false') {
      // turn boolean strings back into booleans
      deserializedObj[key] = value === 'true';
    } else {
      try {
        // if the value is a stringified object or array, parse it
        deserializedObj[key] = JSON.parse(value);
      } catch (e) {
        // if the value is not a stringified object or array, store it as a string
        deserializedObj[key] = value;
      }
    }
  }
  return deserializedObj;
};

const serializeOrder = (order) => {
  const serialized = {};
  for (const [key, value] of Object.entries(order)) {
    if (value instanceof Date) {
      // turn dates into ISO strings
      serialized[key] = value.toISOString();
    } else if (typeof value === 'object' && value !== null) {
      // stringify objects and arrays
      serialized[key] = JSON.stringify(value);
    } else if (value === undefined) {
      // store undefined values as the string "undefined"
      serialized[key] = "undefined";
    } else {
      // store the value as a string
      serialized[key] = value.toString();
    }
  }
  return serialized;
};



const deserializeOrder = (serializedOrder) => {
  const deserialized = {};
  for (const [key, value] of Object.entries(serializedOrder)) {
    try {
      if (value === "undefined") {
        // turn the string "undefined" back into undefined
        deserialized[key] = undefined;
      } else {
        // parse JSON strings
        deserialized[key] = JSON.parse(value);
      }
    } catch (e) {
      if (!isNaN(value) && value.trim() !== '') {
        deserialized[key] = parseFloat(value);
      } else if (value === 'true' || value === 'false') {
        deserialized[key] = value === 'true';
      } else {
        deserialized[key] = value;
      }
    }
  }
  return deserialized;
};


export default deserializeOrder;



  export { serialize, deserialize, serializeOrder, deserializeOrder};