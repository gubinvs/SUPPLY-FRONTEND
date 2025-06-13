
import { useState, useEffect } from "react";
import ApiUrl from "../js/ApiUrl.js";
import "./allOffersForSelected.css";
import NavigationBarMin from "../NavigationBar/NavigationBarMin.jsx";
import NavigationBarMax from "../NavigationBar/NavigationBarMax.jsx";
import HeaderApplicationPanel from "../ApplicationPanel/Header/HeaderApplicationPanel.jsx";

const AllOffersForSelected = ({role, title}) => {

    const [isNavMaxVisible, setIsNavMaxVisible] = useState(false);
    const handleShowMax = () => setIsNavMaxVisible(true);
    const handleHideMax = () => setIsNavMaxVisible(false);
    const [analyzedComponents, setAnalyzedComponents] = useState([]);
    const [offersByComponent, setOffersByComponent] = useState({});
    const [loadingArticles, setLoadingArticles] = useState({}); // 👈 индикаторы загрузки по артикулам

    useEffect(() => {
        const analyzeData = JSON.parse(localStorage.getItem("analyzeData") || "{}");
        const selected = analyzeData.selectedComponents || [];
        setAnalyzedComponents(selected);

        const fetchSequentially = async () => {
            for (const comp of selected) {
                setLoadingArticles(prev => ({ ...prev, [comp.vendorCodeComponent]: true }));

                try {
                    const response = await fetch(`${ApiUrl}/api/ReturnPriceProviderArticle/${encodeURIComponent(comp.vendorCodeComponent)}`);
                    if (!response.ok) throw new Error("Ошибка загрузки предложений");

                    const data = await response.json();
                    setOffersByComponent(prev => ({
                        ...prev,
                        [comp.vendorCodeComponent]: data.offers || [],
                    }));
                } catch (error) {
                    console.error(`Ошибка для артикула ${comp.vendorCodeComponent}:`, error);
                    setOffersByComponent(prev => ({
                        ...prev,
                        [comp.vendorCodeComponent]: [],
                    }));
                } finally {
                    setLoadingArticles(prev => ({ ...prev, [comp.vendorCodeComponent]: false }));
                }
            }
        };

        if (selected.length > 0) {
            fetchSequentially();
        }
    }, []);

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
                    ) : (
                        analyzedComponents.map((component) => {
                            const vendorCode = component.vendorCodeComponent;
                            const offers = offersByComponent[vendorCode] || [];
                            const isLoading = loadingArticles[vendorCode];

                            return (
                                <div key={component.id} className="mb-5">
                                    <h5>{vendorCode} — {component.nameComponent}</h5>

                                    {isLoading ? (
                                        <div className="custom-spinner-container">
                                            <div className="custom-spinner"></div>
                                        </div>
                                    ) : offers.length > 0 ? (
                                        <table className="table table-bordered all-offers-selected__table">
                                            <thead>
                                                <tr>
                                                    <th>Компания поставщик</th>
                                                    <th>Цена</th>
                                                    <th>Срок поставки</th>
                                                    <th>Актуальность</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {offers.map((offer, index) => (
                                                    <tr key={index}>
                                                        <td>{offer.nameProvider}</td>
                                                        <td>{offer.priceComponent.toLocaleString('ru-RU')} ₽</td>
                                                        <td>{offer.deliveryTimeComponent}</td>
                                                        <td>{new Date(offer.saveDataPrice).toLocaleDateString('ru-RU')}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="text-muted">Нет предложений по этому компоненту.</p>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
};

export default AllOffersForSelected;
