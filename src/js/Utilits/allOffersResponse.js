import ApiUrl from "../ApiUrl";



// Принимаем массив данных с артикулами и запрашиваем стоимость данной номенклатуры
const allOffersResponse = async (components) => {
    
    const articleList = components
    .map((comp) => comp.vendorCodeComponent)
    .filter((a) => a && a.trim().length > 0);

    // Запросили данные о ценах поставщика
    try {
        const response = await fetch(`${ApiUrl}/api/ReturnPriceProviderListArticle`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Articles: articleList }),
        });

        if (!response.ok) throw new Error("Ошибка загрузки данных");
        const data = await response.json();

        // Собрали данные с сервера
        const allOffersApi = [];
            data.found.forEach((component) => {
                component.offers.forEach((offer) => {
                    allOffersApi.push({
                        ...offer,
                        vendorCode: component.article,
                        nameComponent: component.nameComponent,
                    });
            });
        });

        // Фильтруем по артикулу и лучшей цене
        const bestOffersByArticle = new Map();
        allOffersApi.forEach((offer) => {
          const currentBest = bestOffersByArticle.get(offer.vendorCode);
          if (offer.priceComponent !== 0 && (!currentBest || offer.priceComponent < currentBest.priceComponent)) {
            bestOffersByArticle.set(offer.vendorCode, offer);
          }
        });

      

    } catch (error) {
        console.error("Ошибка:", error);
    }
};

export default allOffersResponse;