import "./nomenclatureTable.css";
import { handleCheckboxToggle } from "../js/Utilits/handleCheckboxToggle.js";
import { handleEditClick } from "../js/Utilits/handleEditClick.js";
import { useRoleId } from "../js/Utilits/roleId.js";
import Spinners from "./Spinners.jsx";

const NomenclatureTable = (
    { currentItems, selectedIds, setSelectedIds, offers}
) => {
    const { roleCustomer, roleProvider, roleAdmin, roleUser } = useRoleId();

    if (!offers || Object.keys(offers).length === 0) {
        return <Spinners />;
    }

    return (
        <>
            <table className="table">
                <thead className="table-borderless__theder">
                    <tr>
                        <th scope="col" className="table-borderless__check-coll"></th>
                        <th scope="col" className="table-borderless__article">Артикул</th>
                        <th scope="col" className="table-borderless__name">Наименование</th>
                        <th scope="col" className="table-borderless__price">Лучшая цена</th>
                        <th scope="col" className="table-borderless__manuf">Срок поставки</th>
                        <th scope="col" className="table-borderless__manuf">Производитель</th>
                        <th scope="col" className="table-borderless__um th-table-right">Ед. изм</th>
                        
                        {!roleUser && <th scope="col" className="table-borderless__th-edit">Edit</th>}
                    </tr>
                </thead>
                <tbody className="table-borderless__tbody">
                    {currentItems.map((item) => {
                        const vendorCode = item.vendorCodeComponent;
                        const offer = offers && offers[vendorCode]; // ✅ Это один объект, а не массив

                        return (
                            <tr key={item.id} className="ts-tbody__tr">
                                <td>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={selectedIds.has(item.id)}
                                        onChange={() => handleCheckboxToggle(item.id, setSelectedIds)}
                                    />
                                </td>
                                <td>{vendorCode}</td>
                                <td>{item.nameComponent}</td>

                                {/* 👉 Добавляем цену и срок поставки */}
                                <td className="table-borderless__price">
                                    {offer ? `${new Intl.NumberFormat('ru-RU').format(offer.priceComponent)} ₽` : <div className="spinner-border text-secondary" role="status"><span className="visually-hidden">Loading...</span></div>}
                                </td>
                                <td>
                                    {offer ? offer.deliveryTimeComponent : <div className="spinner-border text-secondary" role="status"><span className="visually-hidden">Loading...</span></div>}
                                </td>
                                <td>{item.manufacturerName}</td>
                                <td className="table-borderless__um">{item.unitMeasurementName}</td>

                                {!roleUser && (
                                    <td className="table-borderless__edit">
                                        <img
                                            className="table-borderless__icon-edit"
                                            src="../images/file-pen-line__table.svg"
                                            alt="Редактировать"
                                            onClick={() => handleEditClick(vendorCode)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </td>
                                )}
                            </tr>
                        );
                    })}


                </tbody>
            </table>
        </>
    );
};

export default NomenclatureTable;
