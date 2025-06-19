import { useState, useEffect } from "react";
import ApiUrl from "../ApiUrl";

// 
// костомный хук данные о всех компаниях поставщиках в системе из таблицы SupplyProvider 
//



export function useProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProviders() {
      try {
        const response = await fetch(ApiUrl + "/api/ReturnListProvider");
        const result = await response.json();
        setProviders(result.providers);
      } catch (err) {
        console.error("Ошибка загрузки поставщиков:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProviders();
  }, []);

  return { providers, loading, error };
}




// Реализация в компоненте
// const Component = () => {
//  const { providers, loading, error } = useProviders();

// if (loading) return <p>Загрузка...</p>;
//  if (error) return <p>Ошибка: {error.message}</p>;

//  return (
//    <ul>
//      {providers.map(p => <li key={p.id}>{p.name}</li>)}
//    </ul>
//  );
// };