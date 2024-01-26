const serialize = (obj) => {
  console.log('Serializing:', obj);
  const serialized = Object.entries(obj).reduce((acc, [key, value]) => {
    // if the value is an object or array, stringify it
    if ((typeof value === 'object' && value !== null) || Array.isArray(value)) {
      value = JSON.stringify(value);
    } 
    acc.push(key, value);
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
      // Only parse if the value is a stringified object or array
      deserializedObj[key] = (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) ? JSON.parse(value) : value;
    } catch (error) {
      console.error(`Error deserializing key ${key}:`, error);
      deserializedObj[key] = value;
    }
  }
  console.log('Deserialized object:', deserializedObj);
  return deserializedObj;
};



  export { serialize, deserialize };