import "./selectUnitMeasurement.css";


const SelectUnitMeasurement =() => {
    return (
        <>
            <select
                className="form-select aca-input-form__unit"
                value={selectedUnit}
                onChange={(e) => {
                    setSelectedUnit(e.target.value);
                    localStorage.setItem("lastUnit", e.target.value);
                }}
            >
                <option value="">Ед. изм.</option>
                {unitMeasurement.map((item, index) => (
                    <option key={index} value={item.guidIdUnitMeasurement}>
                        {item.nameUnitMeasurement}
                    </option>
                ))}
            </select>
        
        </>
    );

};