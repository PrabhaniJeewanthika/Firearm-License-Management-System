import * as db from './db';

// Simulate API delay for realism (optional, but good for UI transitions)
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

const parseEndpoint = (url: string) => {
  // Remove trailing slashes and query params
  const cleanUrl = url.split('?')[0].replace(/\/$/, '');
  const parts = cleanUrl.split('/');
  // Expected formats: 
  // '/store-name' -> store, null
  // '/store-name/id' -> store, id
  
  // The first part might be empty if the url starts with a slash
  const endpoint = parts[0] === '' ? parts[1] : parts[0];
  const idStr = parts.length > (parts[0] === '' ? 2 : 1) ? parts[parts.length - 1] : null;
  const id = idStr ? parseInt(idStr) : null;
  
  return { storeName: endpoint, id };
};

const processData = async (data: any) => {
  if (data instanceof FormData) {
    const obj: any = {};
    for (const [key, value] of data.entries()) {
      if (value instanceof File) {
        // Convert File to Base64 string
        const buffer = await value.arrayBuffer();
        const base64 = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        obj[key] = `data:${value.type};base64,${base64}`;
      } else {
        obj[key] = value;
      }
    }
    return obj;
  }
  return data;
};

// We create a mock 'api' object that has the same signature as axios
const api = {
  get: async (url: string, config?: any) => {
    await delay();
    if (url === '/dashboard/' || url === '/summary/') {
      // Mock summary
      const records = await db.getAll('records');
      return { 
        data: {
          total_records: records.length,
          recent_additions: records.slice(-5).reverse(),
        } 
      };
    }
    
    if (url === '/auth/login/' || url === '/token/') {
      return { data: { access: 'mock-token', refresh: 'mock-refresh' } };
    }

    const { storeName, id } = parseEndpoint(url);
    if (!storeName) return { data: [] };

    if (id) {
      const data = await db.getById(storeName as any, id);
      return { data };
    } else {
      let data = await db.getAll(storeName as any);
      // Simulate Django Rest Framework pagination format if needed
      return { data: { results: data, count: data.length } };
    }
  },
  
  post: async (url: string, data: any, config?: any) => {
    await delay();
    if (url === '/auth/login/' || url === '/token/') {
      return { data: { access: 'mock-token', refresh: 'mock-refresh' } };
    }

    const { storeName } = parseEndpoint(url);
    if (!storeName) throw new Error('Invalid endpoint');
    
    const processedData = await processData(data);
    const result = await db.add(storeName as any, processedData);
    return { data: result };
  },
  
  put: async (url: string, data: any, config?: any) => {
    await delay();
    const { storeName, id } = parseEndpoint(url);
    if (!storeName || !id) throw new Error('Invalid endpoint or ID');
    
    const processedData = await processData(data);
    const result = await db.update(storeName as any, id, processedData);
    return { data: result };
  },
  
  delete: async (url: string, config?: any) => {
    await delay();
    const { storeName, id } = parseEndpoint(url);
    if (!storeName || !id) throw new Error('Invalid endpoint or ID');
    
    await db.remove(storeName as any, id);
    return { data: { success: true } };
  }
};

export default api;

