import "./nomenclatureTable.css";
import {handleCheckboxToggle} from "../js/Utilits/handleCheckboxToggle.js";
import {handleEditClick} from "../js/Utilits/handleEditClick.js";
import { useRoleId } from "../js/Utilits/roleId.js";




// Таблица выдачи данных о номенклатуре приложения
const NomenclatureTable = (
    {currentItems, selectedIds, setSelectedIds}
) => {

    const { roleCustomer, roleProvider, roleAdmin, roleUser } = useRoleId();
    
    return (
        <>
            <table className="table">
                <thead className="table-borderless__theder">
                    <tr>
                        <th scope="col" className="table-borderless__check-coll"></th>
                        <th scope="col" className="table-borderless__article">Артикул</th>
                        <th scope="col" className="table-borderless__name">Наименование</th>
                        <th scope="col" className="table-borderless__manuf">Производитель</th>
                        <th scope="col" className="table-borderless__um">Ед. изм</th>
                         {/* Если free user то не показываем */}
                        {!roleUser?<th scope="col" className="table-borderless__th-edit">Edit</th>:""}
                    </tr>
                </thead>
                <tbody className="table-borderless__tbody">
                    {/* Заполнение таблицы */}
                    {currentItems.map((item) => (
                        <tr key={item.id} className="ts-tbody__tr">
                            <td>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={selectedIds.has(item.id)}
                                    onChange={() => handleCheckboxToggle(item.id, setSelectedIds)}
                                />
                            </td>
                            <td>{item.vendorCodeComponent}</td>
                            <td>{item.nameComponent}</td>
                            <td>{item.manufacturerName}</td>
                            <td className="table-borderless__um">{item.unitMeasurementName}</td>
                            {/* Если free user то не показываем */}
                            {!roleUser?
                                <>
                            
                                    <td className="table-borderless__edit">
                                        <img
                                            className="table-borderless__icon-edit"
                                            src="../images/file-pen-line__table.svg"
                                            alt="Редактировать"
                                            onClick={() => handleEditClick(item.vendorCodeComponent)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </td>
                                </>:""}
                        </tr>
                    ))}
                </tbody>
            </table>
        
        </>
    );

};

export default NomenclatureTable;