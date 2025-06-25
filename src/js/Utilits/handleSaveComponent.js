import ApiUrl from "../ApiUrl.js";


// Отправляем данные на сервер для редактирования базы данных
// selectedManufacturer наименование производителя 
// selectedUnit наименование единицы измерения 
// manufacturer массив  данных производителей 
// unitMeasurement  массив с данными о единицах измерения


export const handleSaveComponent = async (vendorCode, name, selectedManufacturer, selectedUnit, manufacturer, unitMeasurement) => {

    // Сопоставим данные и вытащим guidId
    const selectedManuf = manufacturer.find(item => item.nameManufacturer === selectedManufacturer);
    const guidIdManufact = selectedManuf ? selectedManuf.guidIdManufacturer : null;
    const selectedUn = unitMeasurement.find(item => item.nameUnitMeasurement === selectedUnit);  
    const guidIdUnit = selectedUn ? selectedUn.guidIdUnitMeasurement : null;

    try {
        const response = await fetch(ApiUrl+"/api/AddComponent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                vendorCodeComponent: vendorCode,
                nameComponent: name,
                guidIdManufacturer: guidIdManufact,
                guidIdUnitMeasurement: guidIdUnit
            }),
        });

        console.log( JSON.stringify({
            vendorCodeComponent: vendorCode,
            nameComponent: name,
            guidIdManufacturer: guidIdManufact,
            guidIdUnitMeasurement: guidIdUnit
        }),);

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