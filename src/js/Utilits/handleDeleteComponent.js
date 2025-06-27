import ApiUrl from "../ApiUrl.js";


// Функция отправляет данные на API сервер для удаления по артикулу методом DELETE

export const handleDeleteComponent = async (selectedComponent, vendorCode, setSelectedComponent) => {
    if (!selectedComponent) return;

    const confirmDelete = window.confirm("Вы уверены, что хотите удалить этот компонент?");
    if (!confirmDelete) return;

    try {
        const encodedVendorCode = encodeURIComponent(vendorCode);
        
        const response = await fetch(ApiUrl + `/api/AddComponent/${encodedVendorCode}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Компонент успешно удалён.");
            setSelectedComponent(null);
            localStorage.setItem("edit-article", "");
            window.location.reload();
        } else {
            let errMessage = response.status;

            try {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const err = await response.json();
                    errMessage = err.message || response.status;
                }
            } catch (e) {
                // Просто оставим статус, если не получилось прочитать JSON
            }

            alert("Ошибка при удалении: " + errMessage);
        }

    } catch (error) {
        alert("Сетевая ошибка: " + error.message);
    }

};