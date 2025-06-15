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
  const [bestOffersByProvider, setBestOffersByProvider] = useState({});
  const [loading, setLoading] = useState(false);
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

      const articleList = selected
        .map((comp) => comp.vendorCodeComponent)
        .filter((a) => a && a.trim().length > 0);

      if (articleList.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${ApiUrl}/api/ReturnPriceProviderListArticle`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Articles: articleList }),
        });

        if (!response.ok) throw new Error("Ошибка загрузки данных");

        const data = await response.json();

        // Формируем плоский массив всех предложений с данными компонента
        const allOffers = [];

        data.found.forEach((component) => {
          component.offers.forEach((offer) => {
            allOffers.push({
              ...offer,
              vendorCode: component.article,
              nameComponent: component.nameComponent,
            });
          });
        });

        setCombinedOffers(allOffers);

        // Находим лучшие предложения по каждому артикулу (минимальная цена)
        const bestOffersByArticle = new Map();
        allOffers.forEach((offer) => {
          const currentBest = bestOffersByArticle.get(offer.vendorCode);
          if (!currentBest || offer.priceComponent < currentBest.priceComponent) {
            bestOffersByArticle.set(offer.vendorCode, offer);
          }
        });

        // Группируем лучшие предложения по поставщикам
        const bestGroupedByProvider = {};
        bestOffersByArticle.forEach((offer) => {
          if (!bestGroupedByProvider[offer.nameProvider]) {
            bestGroupedByProvider[offer.nameProvider] = [];
          }
          bestGroupedByProvider[offer.nameProvider].push(offer);
        });

        setBestOffersByProvider(bestGroupedByProvider);
      } catch (error) {
        console.error("Ошибка:", error);
      } finally {
        setLoading(false);
      }
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
        <NavigationBarMin onShowMax={handleShowMax} onHideMax={handleHideMax} isNavMaxVisible={isNavMaxVisible} />
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
              <div className="mb-4 all-offers-selected__button-block">
                <div className="aos-button-block__selectet-buton">
                  <button
                    className={`btn btn-sm ml-2 ${showBestByProvider ? "btn-custom" : "btn-custom-outline"}`}
                    onClick={() => setShowBestByProvider(!showBestByProvider)}
                  >
                    {showBestByProvider ? "Вернуться к полному списку" : "Лучшие предложения поставщиков"}
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
                      {Array.from({ length: Math.ceil(getFilteredOffers().length / rowsPerPage) }, (_, i) => (
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
                            <td colSpan="2">
                              <b>Итого</b>
                            </td>
                            <td>
                              <b>{totalPrice.toLocaleString("ru-RU")} ₽</b>
                            </td>
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
