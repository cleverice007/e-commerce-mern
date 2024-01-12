const serialize = (obj) => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      acc.push(key, JSON.stringify(value));
      return acc;
    }, []);
  };
  
  const deserialize = (array) => {
    const obj = {};
    for (let i = 0; i < array.length; i += 2) {
      obj[array[i]] = JSON.parse(array[i + 1]);
    }
    return obj;
  };
  
  export { serialize, deserialize };