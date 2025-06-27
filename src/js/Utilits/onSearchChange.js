
// Функция поиска по массиву номенклатуры при вводе данных в input
export const onSearchChange = (e, components, setSearchQuery, setFilteredComponents, setCurrentPage) => {

    const value = e.target.value;
    localStorage.setItem('searchQuery', value); // ← сохраняем в localStorage
    
    setSearchQuery(value);

    const filtered = components.filter(c =>
        c.vendorCodeComponent?.toLowerCase().includes(value.toLowerCase()) ||
        c.nameComponent?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredComponents(filtered);
    setCurrentPage(1);
};