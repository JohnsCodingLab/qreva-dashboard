import { useState, useEffect } from 'react';

export const useProfileData = (id, fetchFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await fetchFunction(id);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (id) fetchData();
}, [id]);

  return { data, loading, error, setData };
};