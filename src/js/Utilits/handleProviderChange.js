import ApiUrl from "../ApiUrl.js"; 
 
 
 export const handleProviderChange = (e, setGuidIdProvider, setCollaboratorInfo, setCollaboratorProvider) => {
      // Записали в переменную идентификатор компании
      setGuidIdProvider(e);

      // Отправили запрос к api для получения информации о менеджерах компании
      const fetchData = async () => {
          
        try {
           const response = await fetch(`${ApiUrl}/api/ReturnInfoCollaboratorProvider?guid=${e}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            });
      
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
      
            const data = await response.json();

            // Метод .map() создаст новый массив с нужной структурой объектов
            const formattedData = data.map(element => ({
              nameCollaboratorProvider: element.nameCollaboratorProvider || " ",
              phoneCollaboratorProvider: element.phoneCollaboratorProvider || " ",
              emailCollaboratorProvider: element.emailCollaboratorProvider || " "
            }));

            // Сохраняем получившийся массив в состояние
            setCollaboratorProvider(formattedData);
                  
          } catch (error) {
            console.error("Ошибка при авторизации:", error);
          }
        };
      
      fetchData();

      // Сделали видимым окно вывода информации о компании
      setCollaboratorInfo(true);
  };