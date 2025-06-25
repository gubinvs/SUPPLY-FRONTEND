
// Обработчик чек бокс

export const handleCheckboxToggle = (id, setSelectedIds) => {
    setSelectedIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        return newSet;
    });
};