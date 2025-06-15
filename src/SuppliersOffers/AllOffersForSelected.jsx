import { useState, useEffect } from "react";
import ApiUrl from "../js/ApiUrl.js";
import "./allOffersForSelected.css";
import NavigationBarMin from "../NavigationBar/NavigationBarMin.jsx";
import NavigationBarMax from "../NavigationBar/NavigationBarMax.jsx";
import HeaderApplicationPanel from "../ApplicationPanel/Header/HeaderApplicationPanel.jsx";

const AllOffersForSelected = ({ role, title }) => {
  const [isNavMaxVisible, setIsNavMaxVisible] = useState(false);
  const handleShowMax = () => setIsNavMaxVisible(true);
  const handleHideMax = () => setIsNavMaxVisible(false);

  const [analyzedComponents, setAnalyzedComponents] = useState([]);
  const [combinedOffers, setCombinedOffers] = useState([]);
  const [bestOffersByProvider, setBestOffersByProvider] = useState([]);
  const [loading, setLoading] = useState(false);

  const [priceTabActive, setPriceTabActive] = useState(false);
  const [showBestByProvider, setShowBestByProvider] = useState(false);
  const [selectedVendorCodes, setSelectedVendorCodes] = useState(new Set());

  useEffect(() => {
    const analyzeData = JSON.parse(localStorage.getItem("analyzeData") || "{}");
    const selected = analyzeData.selectedComponents || [];
    setAnalyzedComponents(selected);

    const fetchData = async () => {
      setLoading(true);
      let allOffers = [];

      for (const comp of selected) {
        try {
          const response = await fetch(
            `${ApiUrl}/api/ReturnPriceProviderArticle/${encodeURIComponent(comp.vendorCodeComponent)}`
          );
          if (!response.ok) throw new Error("Ошибка загрузки");

          const data = await response.json();
          const offers = data.offers || [];

          allOffers = allOffers.concat(
            offers.map((o) => ({
              ...o,
              vendorCode: comp.vendorCodeComponent,
              nameComponent: comp.nameComponent,
            }))
          );
        } catch (error) {
          console.error("Ошибка:", error);
        }
      }

      setCombinedOffers(allOffers);

      // Формируем лучшие предложения по каждому поставщику и артикулу
      const bestMap = new Map();
      allOffers.forEach((offer) => {
        const key = `${offer.nameProvider}_${offer.vendorCode}`;
        if (
          !bestMap.has(key) ||
          offer.priceComponent < bestMap.get(key).priceComponent
        ) {
          bestMap.set(key, offer);
        }
      });

      const bestGrouped = Array.from(bestMap.values()).reduce((acc, offer) => {
        if (!acc[offer.nameProvider]) acc[offer.nameProvider] = [];
        acc[offer.nameProvider].push(offer);
        return acc;
      }, {});

      setBestOffersByProvider(bestGrouped);
      setLoading(false);
    };

    if (selected.length > 0) {
      fetchData();
    }
  }, []);

  const toggleVendorSelection = (vendorCode) => {
    setSelectedVendorCodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(vendorCode)) {
        newSet.delete(vendorCode);
      } else {
        newSet.add(vendorCode);
      }
      return newSet;
    });
  };

  const getFilteredOffers = () => {
    let offers = combinedOffers;

    if (selectedVendorCodes.size > 0) {
      offers = offers.filter((o) => selectedVendorCodes.has(o.vendorCode));
    }

    if (priceTabActive) {
      offers = offers
        .filter((o) => o.priceComponent > 0)
        .sort((a, b) => a.priceComponent - b.priceComponent);
    }

    return offers;
  };

  const renderRows = () => {
    const offers = getFilteredOffers();

    let prevVendor = null;
    let prevName = null;

    return offers.map((offer, index) => {
      const isFirstOccurrence =
        offer.vendorCode !== prevVendor || offer.nameComponent !== prevName;

      if (isFirstOccurrence) {
        prevVendor = offer.vendorCode;
        prevName = offer.nameComponent;
      }

      return (
        <tr key={index}>
          <td>
            {isFirstOccurrence && (
              <input
                type="checkbox"
                checked={selectedVendorCodes.has(offer.vendorCode)}
                onChange={() => toggleVendorSelection(offer.vendorCode)}
              />
            )}
          </td>
          <td>{isFirstOccurrence ? offer.vendorCode : ""}</td>
          <td>{isFirstOccurrence ? offer.nameComponent : ""}</td>
          <td>{offer.nameProvider}</td>
          <td>{offer.priceComponent.toLocaleString("ru-RU")} ₽</td>
          <td>{offer.deliveryTimeComponent}</td>
          <td>{new Date(offer.saveDataPrice).toLocaleDateString("ru-RU")}</td>
        </tr>
      );
    });
  };

  return (
    <>
      <div className="main-application-panel">
        <NavigationBarMin
          onShowMax={handleShowMax}
          onHideMax={handleHideMax}
          isNavMaxVisible={isNavMaxVisible}
        />
        {isNavMaxVisible && <NavigationBarMax />}
        <HeaderApplicationPanel role={role} title={title} />
      </div>

      <div className="main-application-panel__container">
        <div className="all-offers-selected__container">
          {analyzedComponents.length === 0 ? (
            <p>Нет выбранных компонентов для анализа.</p>
          ) : loading ? (
            <div className="custom-spinner-container">
              <div className="custom-spinner"></div>
            </div>
          ) : combinedOffers.length === 0 ? (
            <p className="text-muted">Нет предложений.</p>
          ) : (
            <>
              <div className="mb-4">
                <button
                  className={`btn btn-sm ${
                    priceTabActive ? "btn-custom" : "btn-custom-outline"
                  }`}
                  onClick={() => setPriceTabActive(!priceTabActive)}
                >
                  {priceTabActive
                    ? "Показать все предложения"
                    : "Сортировать по лучшей цене"}
                </button>

                <button
                  className={`btn btn-sm ml-2 ${
                    showBestByProvider ? "btn-custom" : "btn-custom-outline"
                  }`}
                  onClick={() => setShowBestByProvider(!showBestByProvider)}
                >
                  {showBestByProvider
                    ? "Скрыть лучших по поставщикам"
                    : "Показать лучших по поставщикам"}
                </button>
              </div>

              {!showBestByProvider ? (
                <table className="table table-bordered all-offers-selected__table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Артикул</th>
                      <th>Наименование</th>
                      <th>Компания</th>
                      <th>Цена</th>
                      <th>Срок</th>
                      <th>Актуальность</th>
                    </tr>
                  </thead>
                  <tbody>{renderRows()}</tbody>
                </table>
              ) : (
                <>
                  <h5 className="mt-5 mb-3">Лучшие предложения от поставщиков:</h5>
                  {Object.entries(bestOffersByProvider).map(
                    ([provider, offers], index) => (
                      <div key={index} className="mb-4">
                        <h6 className="text-primary">
                          {provider} предлагает лучшие цены по:
                        </h6>
                        <table className="table table-bordered all-offers-selected__table">
                          <thead>
                            <tr>
                              <th>Артикул</th>
                              <th>Наименование</th>
                              <th>Цена</th>
                              <th>Срок</th>
                              <th>Актуальность</th>
                            </tr>
                          </thead>
                          <tbody>
                            {offers.map((offer, idx) => (
                              <tr key={idx}>
                                <td>{offer.vendorCode}</td>
                                <td>{offer.nameComponent}</td>
                                <td>{offer.priceComponent.toLocaleString("ru-RU")} ₽</td>
                                <td>{offer.deliveryTimeComponent}</td>
                                <td>
                                  {new Date(
                                    offer.saveDataPrice
                                  ).toLocaleDateString("ru-RU")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AllOffersForSelected;
