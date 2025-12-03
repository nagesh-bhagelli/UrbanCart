import { useEffect, useState } from 'react';

export default function useInventorySSE(sku) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!sku) return;
    const es = new EventSource(`/api/stream/products/${sku}`);
    es.onmessage = e => {
      try {
        const doc = JSON.parse(e.data);
        setProduct(doc);
      } catch (err) {
        console.error('SSE parse error', err);
      }
    };
    es.onerror = (err) => {
      console.warn('SSE error', err);
      // keep connection open / browser will retry
    };
    return () => es.close();
  }, [sku]);

  return product;
}
