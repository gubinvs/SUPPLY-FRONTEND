import ApiUrl from "../ApiUrl.js";


// Функция отправляет данные на API сервер для удаления по артикулу методом DELETE

export const handleDeleteComponent = async (selectedComponent, vendorCode, setSelectedComponent) => {
    if (!selectedComponent) return;

    const confirmDelete = window.confirm("Вы уверены, что хотите удалить этот компонент?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(ApiUrl+`/api/AddComponent/${vendorCode}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Компонент успешно удалён.");

            // как передать на верх?
            setSelectedComponent(null);

            // Обнулим ключ в браузере
            localStorage.setItem("edit-article", "");


            // Можно либо обновить components вручную, либо перезагрузить:
            window.location.reload();
        } else {
            const err = await response.json();
            alert("Ошибка при удалении: " + (err.message || response.status));
        }
    } catch (error) {
        alert("Сетевая ошибка: " + error.message);
    }

};