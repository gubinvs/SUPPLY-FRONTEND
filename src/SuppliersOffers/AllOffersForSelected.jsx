import { useState, useEffect } from "react";
import ApiUrl from "../js/ApiUrl.js";
import "./allOffersForSelected.css";
import NavigationBarMin from "../NavigationBar/NavigationBarMin.jsx";
import NavigationBarMax from "../NavigationBar/NavigationBarMax.jsx";
import HeaderApplicationPanel from "../ApplicationPanel/Header/HeaderApplicationPanel.jsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import FullDataCompanyAndCollaborators from "./FullDataCompanyAndCollaborators.jsx";

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


        // Добавляем количество из константы: "selected "
        const allOffers = [];
        allOffersApi.forEach((item) => {
          selected.forEach((itemSelected)=> {
            if (item.vendorCode === itemSelected.vendorCodeComponent) {
              allOffers.push(
                {
                  ...item,
                  quantity: itemSelected.quantity,
                });}
          })
        });


        // Сохраняем все предложения
        setCombinedOffers(allOffers);

        // Фильтруем по артикулу и лучшей цене
        const bestOffersByArticle = new Map();
        allOffers.forEach((offer) => {
          const currentBest = bestOffersByArticle.get(offer.vendorCode);
          if (offer.priceComponent !== 0 && (!currentBest || offer.priceComponent < currentBest.priceComponent)) {
            bestOffersByArticle.set(offer.vendorCode, offer);
          }
        });

        // Группируем предложения по поставщику
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

    if (selected.length > 0) fetchData();
  }, []);

  // 
  // Соберем всю информацию о компаниях поставщиках и их представителях, для всплывающей карточки компании
  // запрос на API сервер по ИНН, запрашиваем списком .если есть в системе прикрепленные колабораторы тоже подтягиваем
  //


  const toggleVendorSelection = (vendorCode) => {
    setSelectedVendorCodes((prev) => {
      const newSet = new Set(prev);
      newSet.has(vendorCode) ? newSet.delete(vendorCode) : newSet.add(vendorCode);
      return newSet;
    });
  };

  const getFilteredOffers = () => {
    return selectedVendorCodes.size > 0
      ? combinedOffers.filter((o) => selectedVendorCodes.has(o.vendorCode))
      : combinedOffers;
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

      // Пример установки ширины колонок (ширина в "знаках")
      ws['!cols'] = [
        { wch: 20 }, // Артикул
        { wch: 60 }, // Наименование — можно ограничить по желанию
        { wch: 20 }, // Компания
        { wch: 11 }, // Цена
        { wch: 15 }, // Срок
        { wch: 15 }, // Актуальность
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Предложения");
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, "Предложения.xlsx");
  };

  const exportBestByProviderToExcel = () => {
      const wb = XLSX.utils.book_new();

      Object.entries(bestOffersByProvider).forEach(([provider, offers]) => {
        const sortedOffers = offers.sort((a, b) => a.priceComponent - b.priceComponent);
        const wsData = sortedOffers.map((offer) => ({
          Артикул: offer.vendorCode,
          Наименование: offer.nameComponent,
          Количество: offer.quantity,
          Цена: offer.priceComponent,
          Срок: offer.deliveryTimeComponent,
          Актуальность: new Date(offer.saveDataPrice).toLocaleDateString("ru-RU"),
        }));

        const ws = XLSX.utils.json_to_sheet(wsData);

        // Пример установки ширины колонок, адаптируй по своему набору полей
        ws['!cols'] = [
          { wch: 20 }, // Артикул
          { wch: 60 }, // Наименование
          { wch: 15 }, // Количество
          { wch: 11 }, // Цена
          { wch: 15 }, // Срок
          { wch: 15 }, // Актуальность
        ];

        XLSX.utils.book_append_sheet(wb, ws, provider.substring(0, 31));
      });

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, "ЛучшиеПредложенияПоПоставщикам.xlsx");
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
              <div className="mb-4 all-offers-selected__button-block d-flex justify-content-between align-items-center">
                <div>
                    <button
                      className="btn btn-sm btn-outline-success mx-2"
                      onClick={exportToExcel}
                    >
                      Скачать все предложения (Excel)
                    </button>
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={exportBestByProviderToExcel}
                    >
                      Скачать файл заказа поставщикам (Excel)
                    </button>
                </div>
                <div>
                  <button
                    className={`btn ml-2 ${showBestByProvider ? "btn-outline-secondary" : "btn-secondary"}`}
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
                        <th className="aos-table__th-article">Артикул</th>
                        <th>Наименование</th>
                        <th className="aos-table__th-company">Компания</th>
                        <th className="aos-table__th-price">Цена</th>
                        <th className="aos-table__th-term">Срок</th>
                        <th className="aos-table__th-data">Актуальность</th>
                      </tr>
                    </thead>
                    <tbody>{renderRows()}</tbody>
                  </table>

                  <div className="d-flex justify-content-between align-items-center mt-3">
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
                      <h6 className="text-primary mb-2"><strong>{provider}</strong> предлагает лучшие цены на:</h6>
                      
                      {/* Это всплывающее окно карточки компании */}
                      {/* <FullDataCompanyAndCollaborators dataCompany={""}/> */}
                      
                      <table className="table table-bordered all-offers-selected__table">
                        <thead className="thead-light">
                          <tr>
                            <th className="aos-table__th-article">Артикул</th>
                            <th>Наименование</th>
                            
                            <th className="aos-table__th-price">Цена</th>
                            <th className="aos-table__th-term">Срок</th>
                            <th className="aos-table__th-data">Актуальность</th>
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
