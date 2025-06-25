import ApiUrl from "../ApiUrl";

///
/// Запрос API на добавление наименования производителя в базу данных
///

export async function addCompanyManufacturer(name, setStatusMessage) {
    if (!name.trim()) {
        setStatusMessage("Наименование не может быть пустым.");
        return;
    }

    try {
        const url = ApiUrl + "/api/AddCompanyManufacturer/" + encodeURIComponent(name);
        const response = await fetch(url, {
            method: "POST"
        });

        const result = await response.json();

        if (response.ok) {
            setStatusMessage("Производитель успешно добавлен.");
        } else {
            setStatusMessage(result.message || "Ошибка при добавлении производителя.");
        }

    } catch (error) {
        setStatusMessage("Произошла ошибка: " + error.message);
    }
}
