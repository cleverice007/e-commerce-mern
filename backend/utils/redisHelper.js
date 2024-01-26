const serialize = (obj) => {
  console.log('Serializing:', obj);
  const serialized = Object.entries(obj).reduce((acc, [key, value]) => {
    // if string, just return the string, otherwise stringify
    acc.push(key, typeof value === 'string' ? value : JSON.stringify(value));
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
      // if string, just return the string, otherwise parse
      deserializedObj[key] = (value.startsWith('{') || value.startsWith('[')) ? JSON.parse(value) : value;
    } catch (error) {
      console.error(`Error deserializing key ${key}:`, error);
      deserializedObj[key] = value;
    }
  }
  console.log('Deserialized object:', deserializedObj);
  return deserializedObj;
};


  export { serialize, deserialize };