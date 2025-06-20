import {token} from "../../token.js";

///
/// Запрос API (https://dadata.ru/api/find-party/) для получение информации о компании поставщике по его ИНН
///


async function returnDataPrivider(innProvider) {

    try {
        const response = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party", {
            method: "POST", // 🔧 ОБЯЗАТЕЛЬНО!
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + token 
            },
            body: JSON.stringify({ query: innProvider })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();


        // Можно вернуть саму компанию
        if (data.suggestions && data.suggestions.length > 0) {
            return data.suggestions[0]; // первая найденная организация
        } else {
            console.warn("Организация не найдена по ИНН");
            return null;
        }

    } catch (error) {
        console.error("Ошибка получения данных:", error);
        return null;
    }
}

export default returnDataPrivider;