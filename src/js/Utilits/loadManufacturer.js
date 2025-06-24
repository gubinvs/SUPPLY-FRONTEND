import ApiUrl from "../ApiUrl";

// Загрузка списка наименований производителей

export async function loadManufacturer(setManufacturer) {
    try {
        const responseManufacturer = await fetch(ApiUrl + "/api/ReturnListManufacturer");
        const allManufacturer = await responseManufacturer.json();
        setManufacturer(allManufacturer.manufacturer);
    } catch (error) {
        console.error("Ошибка загрузки поставщиков:", error);
    }
}