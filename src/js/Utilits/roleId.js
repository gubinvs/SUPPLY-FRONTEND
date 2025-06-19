import { useState, useEffect } from "react";

// 
// костомный хук проверки пользователя на принадлежность его роли в системе 
//

export function useRoleId() {
      const roleId = localStorage.getItem("roleId");

      const [roleCustomer, setRoleCustomer] = useState(false);
      const [roleProvider, setRoleProvider] = useState(false);
      const [roleAdmin, setRoleAdmin] = useState(false);
      const [roleUser, setRoleUser] = useState(false);
      const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRoleId() {
      try {
        // Если заказчик
        if (roleId === "52910536-2b8a-47e7-9d5a-8cca0a0b865a") {
            setRoleCustomer(true);
        } else {
            setRoleCustomer(false);
        }
        // Если поставщик
        if (roleId === "a5219e2b-12f3-490e-99f5-1be54c55cc6d") {
            setRoleProvider(true);
        } else {
            setRoleProvider(false);
        }
        // Если администатор
        if (roleId === "b5aff5b0-c3ac-4f1e-9467-fe13a14f6de3") {
            setRoleAdmin(true);
        } else {
            setRoleAdmin(false);
        }
        // Если пользователь
        if (roleId === "ba246092-47bf-4bcc-9e97-5b59969c8976") {
            setRoleUser(true);
        } else {
            setRoleUser(false);
        }
        
      } catch (err) {
        console.error("Ошибка определения роли:", err);
        setError(err);
      } 
    }

    fetchRoleId();
  }, [roleId]);

  return { roleCustomer, roleProvider, roleAdmin, roleUser, error };
}




// Реализация в компоненте

//  const { roleCustomer, roleProvider, roleAdmin, roleUser, error } = useRoleId();

//  if (error) return <p>Ошибка: {error.message}</p>;
