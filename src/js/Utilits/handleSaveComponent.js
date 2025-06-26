import ApiUrl from "../ApiUrl.js";


// Отправляем данные на сервер для редактирования базы данных
// selectedManufacturer наименование производителя 
// selectedUnit наименование единицы измерения 
// manufacturer массив  данных производителей 
// unitMeasurement  массив с данными о единицах измерения


export const handleSaveComponent = (
    vendorCode,
    name,
    selectedManufacturer,
    selectedUnit,
    manufacturer,
    unitMeasurement
) => {
    const selectedManuf = manufacturer.find(item => item.nameManufacturer === selectedManufacturer);
    const guidIdManufact = selectedManuf ? selectedManuf.guidIdManufacturer : null;

    const selectedUn = unitMeasurement.find(item => item.nameUnitMeasurement === selectedUnit);
    const guidIdUnit = selectedUn ? selectedUn.guidIdUnitMeasurement : null;

    const requestBody = {
        vendorCodeComponent: vendorCode,
        nameComponent: name,
        guidIdManufacturer: guidIdManufact,
        guidIdUnitMeasurement: guidIdUnit
    };

    //Записываем последнее значение в браузер
    localStorage.setItem("handleSaveComponent", vendorCode);

    fetch(ApiUrl + "/api/AddComponent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (response.ok) {
            alert("Компонент успешно записан.");
            window.location.reload();
        } else {
            return response.json().then(err => {
                alert("Ошибка при сохранении: " + (err.message || response.status));
            });
        }
    })
    .catch(error => {
        alert("Сетевая ошибка: " + error.message);
    });
};
