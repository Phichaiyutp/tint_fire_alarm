export function jsonToCsv(jsonArray) {
    // Collect all unique keys in the JSON array
    const keys = new Set();
    jsonArray.forEach((obj) => {
      for (const key in obj) {
        keys.add(key);
      }
    });
  
    // Convert the keys set to an array
    const keysArray = Array.from(keys);
  
    // Generate the CSV header
    const header = keysArray.join(",");
  
    // Generate the CSV rows
    const rows = jsonArray.map((obj) => {
      return keysArray.map((key) => (obj[key] !== undefined ? `"${obj[key]}"` : "")).join(",");
    });
  
    // Combine the header and rows
    const csv = [header, ...rows].join("\n");
  
    return csv;
  }
  

export  function convertImageToBase64(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};