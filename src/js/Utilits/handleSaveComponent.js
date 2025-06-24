    import ApiUrl from "../js/ApiUrl.js";
    
    
    // Отправляем данные на сервер для редактирования базы данных
    export const handleSaveComponent = async () => {

        try {
            const response = await fetch(ApiUrl+"/api/AddComponent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vendorCodeComponent: vendorCode,
                    nameComponent: name,
                }),
            });

            if (response.ok) {
                alert("Компонент успешно записан.");
                window.location.reload();
                
            } else {
                const err = await response.json();
                alert("Ошибка при сохранении: " + (err.message || response.status));
            }
        } catch (error) {
            alert("Сетевая ошибка: " + error.message);
        }
    };