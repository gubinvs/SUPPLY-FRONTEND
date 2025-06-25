
// Функция обработки клика на иконку редактировать компонент
export const handleEditClick = (vendorCode) => {
    localStorage.setItem("edit-article", vendorCode);
    window.location.href = "/EditSupplyComponent";
};