import ApiUrl from "../ApiUrl";

///
/// Запрос API на получение полного списка товаров в базе данных
///

async function ReturnListDataComponent() {
    try {
        const response = await fetch(ApiUrl + "/api/ReturnListDataComponent", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Проверяем, есть ли массив component в ответе
        if (data.component && Array.isArray(data.component)) {
            return data.component;
        } else {
            console.warn("Ответ не содержит поля 'component'.");
            return [];
        }
    } catch (error) {
        console.error("Ошибка получения данных:", error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
}

export default ReturnListDataComponent;
