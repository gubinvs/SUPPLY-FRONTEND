import ApiUrl from "../ApiUrl.js";

export async function loadUnitMeasurement(setUnitMeasurement) {
    try {
        const responseUnit = await fetch(ApiUrl + "/api/ReturnListUnitMeasurement");
        const allUnit = await responseUnit.json();
        setUnitMeasurement(allUnit.unitMeasurement);
    } catch (error) {
        console.error("Ошибка загрузки поставщиков:", error);
    }
}