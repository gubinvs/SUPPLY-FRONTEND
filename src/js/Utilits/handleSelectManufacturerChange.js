import ApiUrl from "../ApiUrl";



export const handleSelectManufacturerChange = (
    {e, setGuidIdManufacturer, setProviderManufacturerInfo, setProviderManufacturerList }
) => {
    // Записали в переменную идентификатор компании
    setGuidIdManufacturer(e);

    // Отправили запрос к api для получения информации о менеджерах компании
    const fetchData = async () => {
        try {
        const response = await fetch(`${ApiUrl}/api/ReturnListProviderManufacturer`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(e), // Передаем строку-GUID напрямую в body
            });
            
            if (!response.ok) {

            setProviderManufacturerInfo(false);

            throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();

            console.log(data);

            if (data === null || data.length === 0) {
            const formattedData = {
                "id": 0,
                "guidIdProvider": " ",
                "nameProvider": " ",
                "innProvider": " "
            };

            setProviderManufacturerInfo(false);
            };

            // Метод .map() создаст новый массив с нужной структурой объектов
            const formattedData = data.map(element => ({
                id: element.id,
                guidIdProvider: element.guidIdProvider || " ",
                nameProvider: element.nameProvider || " ",
                innProvider: element.innProvider || " ",
            }));


            // Сохраняем получившийся массив в состояние
            setProviderManufacturerList(formattedData);

                
        } catch (error) {
        console.error("Ошибка при авторизации:", error);
        }
    };
    
    fetchData();

    // Сделали видимым окно вывода информации о компании
    setProviderManufacturerInfo(true);

};