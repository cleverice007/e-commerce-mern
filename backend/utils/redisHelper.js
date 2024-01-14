const serialize = (obj) => {
  console.log('Serializing:', obj);
  const serialized = Object.entries(obj).reduce((acc, [key, value]) => {
    acc.push(key, JSON.stringify(value));
    return acc;
  }, []);
  console.log('Serialized data:', serialized);
  return serialized;
};

const deserialize = (obj) => {
  console.log('Deserializing:', obj);
  const deserializedObj = {};
  for (const [key, value] of Object.entries(obj)) {
    try {
      deserializedObj[key] = JSON.parse(value);
    } catch (error) {
      console.error(`Error deserializing key ${key}:`, error);
      deserializedObj[key] = value;
    }
  }
  console.log('Deserialized object:', deserializedObj);
  return deserializedObj;
};


  export { serialize, deserialize };