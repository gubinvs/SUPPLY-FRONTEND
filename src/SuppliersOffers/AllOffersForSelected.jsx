import { useState, useEffect } from "react";
import ApiUrl from "../js/ApiUrl.js";
import "./allOffersForSelected.css";
import NavigationBarMin from "../NavigationBar/NavigationBarMin.jsx";
import NavigationBarMax from "../NavigationBar/NavigationBarMax.jsx";
import HeaderApplicationPanel from "../ApplicationPanel/Header/HeaderApplicationPanel.jsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AllOffersForSelected = ({ role, title }) => {
  const [isNavMaxVisible, setIsNavMaxVisible] = useState(false);
  const [analyzedComponents, setAnalyzedComponents] = useState([]);
  const [combinedOffers, setCombinedOffers] = useState([]);
  const [bestOffersByProvider, setBestOffersByProvider] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [priceTabActive] = useState(false);
  const [showBestByProvider, setShowBestByProvider] = useState(false);
  const [selectedVendorCodes, setSelectedVendorCodes] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 14;

  const handleShowMax = () => setIsNavMaxVisible(true);
  const handleHideMax = () => setIsNavMaxVisible(false);

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

      const bestMap = new Map();
      allOffers.forEach((offer) => {
        const key = `${offer.nameProvider}_${offer.vendorCode}`;
        if (!bestMap.has(key) || offer.priceComponent < bestMap.get(key).priceComponent) {
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
      if (newSet.has(vendorCode)) newSet.delete(vendorCode);
      else newSet.add(vendorCode);
      return newSet;
    });
  };

  const getFilteredOffers = () => {
    let offers = combinedOffers;
    if (selectedVendorCodes.size > 0) {
      offers = offers.filter((o) => selectedVendorCodes.has(o.vendorCode));
    }
    // if (priceTabActive) {
    //   offers = offers.filter((o) => o.priceComponent > 0).sort((a, b) => a.priceComponent - b.priceComponent);
    // }
    return offers;
  };

  const renderRows = () => {
    const offers = getFilteredOffers();
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginated = offers.slice(startIndex, startIndex + rowsPerPage);

    let prevVendor = null;
    let prevName = null;

    return paginated.map((offer, index) => {
      const isFirstOccurrence = offer.vendorCode !== prevVendor || offer.nameComponent !== prevName;
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

  const exportToExcel = () => {
    const data = getFilteredOffers().map((offer) => ({
      Артикул: offer.vendorCode,
      Наименование: offer.nameComponent,
      Компания: offer.nameProvider,
      Цена: offer.priceComponent,
      Срок: offer.deliveryTimeComponent,
      Актуальность: new Date(offer.saveDataPrice).toLocaleDateString("ru-RU"),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Предложения");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Предложения.xlsx");
  };

  return (
    <>
      
      <div className="main-application-panel">
        {/* Навигационная панель приложения малая слева */}
        <NavigationBarMin onShowMax={handleShowMax} onHideMax={handleHideMax} isNavMaxVisible={isNavMaxVisible} />
        {isNavMaxVisible && <NavigationBarMax />}
        {/* Навигационная панель приложения большая слева */}
        <HeaderApplicationPanel role={role} title={title} />
      </div>

      <div className="main-application-panel__container">
        <div className="all-offers-selected__container">
          {analyzedComponents.length === 0 ? (
            <p>Нет выбранных компонентов для анализа.</p>
          ) : loading ? (
            <div className="custom-spinner-container"><div className="custom-spinner"></div></div>
          ) : combinedOffers.length === 0 ? (
            <p className="text-muted">Нет предложений.</p>
          ) : (
            <>
              <div className="mb-4 all-offers-selected__button-block">
                <div className="aos-button-block__selectet-buton">
                  {/* <button
                    className={`btn btn-sm all-offers-selected__button-mr10 ${priceTabActive ? "btn-custom" : "btn-custom-outline"}`}
                    onClick={() => setPriceTabActive(!priceTabActive)}
                  >
                    {priceTabActive ? "Показать все предложения" : "Сортировать по лучшей цене"}
                  </button> */}
                  <button
                    className={`btn btn-sm ml-2 ${showBestByProvider ? "btn-custom" : "btn-custom-outline"}`}
                    onClick={() => setShowBestByProvider(!showBestByProvider)}
                  >
                    {showBestByProvider ? "Скрыть" : "Лучшие предложения поставщиков"}
                  </button>
              </div>
            
            </div>
              {!showBestByProvider ? (
                <>
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

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <button className="btn btn-sm btn-outline-secondary all-offers-selected__button-mr10" onClick={exportToExcel}>
                      Скачать Excel
                    </button>
                    <div>
                      {Array.from({
                        length: Math.ceil(getFilteredOffers().length / rowsPerPage),
                      }, (_, i) => (
                        <button
                          key={i}
                          className={`btn btn-sm mx-1 ${currentPage === i + 1 ? "btn-primary" : "btn-outline-primary"}`}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                Object.entries(bestOffersByProvider).map(([provider, offers], index) => {
                  const sortedOffers = offers.sort((a, b) => a.priceComponent - b.priceComponent);
                  const totalPrice = sortedOffers.reduce((sum, o) => sum + o.priceComponent, 0);
                  return (
                    <div key={index} className="mb-5">
                      <h6 className="text-primary mb-2">
                        <strong>{provider}</strong> предлагает лучшие цены по:
                      </h6>
                      <table className="table table-bordered all-offers-selected__table">
                        <thead className="thead-light">
                          <tr>
                            <th>Артикул</th>
                            <th>Наименование</th>
                            <th>Цена</th>
                            <th>Срок</th>
                            <th>Актуальность</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedOffers.map((offer, idx) => (
                            <tr key={idx}>
                              <td>{offer.vendorCode}</td>
                              <td>{offer.nameComponent}</td>
                              <td>{offer.priceComponent.toLocaleString("ru-RU")} ₽</td>
                              <td>{offer.deliveryTimeComponent}</td>
                              <td>{new Date(offer.saveDataPrice).toLocaleDateString("ru-RU")}</td>
                            </tr>
                          ))}
                          <tr className="table">
                            <td colSpan="2"><b>Итого</b></td>
                            <td><b>{totalPrice.toLocaleString("ru-RU")} ₽</b></td>
                            <td colSpan="2"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AllOffersForSelected;
