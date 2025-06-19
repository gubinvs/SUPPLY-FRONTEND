export const handleAnalyzeClick = (components, selectedIds, navigate) => {
    const selectedComponents = components.filter(item => selectedIds.has(item.id));
    const analyzeComponents = JSON.parse(localStorage.getItem("analyzeComponents") || "[]");
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");

    const dataToAnalyze = {
        selectedComponents,
        analyzeComponents,
        cartItems
    };

    localStorage.setItem("analyzeData", JSON.stringify(dataToAnalyze));
    navigate("/AllOffersForSelected");
};
