import React, { useState, useRef, useEffect } from 'react';
import "./informationPal.css";
import "../applicationPanel.css";
import "./dataCollaborator.css";
import "./informationCompanyCard.css";
import ApiUrl from "../../js/ApiUrl";
import InformationCompanyCard from "./InformationCompanyCard.jsx";
import DataCollaborator from "./DataCollaborator.jsx";
import { SpinnersMin } from "../../ElementApplication/Spinners.jsx";
import {useProviders} from "../../js/Utilits/loadProviders.js";
import Component from './Component.jsx';
import {handleSelectManufacturerChange} from "../../js/Utilits/handleSelectManufacturerChange.js";
  
  
// Компонент списка производителей с поиском по тексту
const Manufacturer = ({setGuidIdManufacturer, setProviderManufacturerInfo, setProviderManufacturerList}) => {
    // Состояния для работы с данными
    const [manufacturer, setManufacturer] = useState([]); // Массив из БД
    const [searchTerm, setSearchTerm] = useState('');     // Текст поиска
    const [isOpen, setIsOpen] = useState(false);           // Открытие списка
    const [selectedName, setSelectedName] = useState('');  // Имя выбранного производителя
    const dropdownRef = useRef(null);                      // Ссылка для закрытия по клику извне

    // 1. Загрузка данных с бэкенда при монтировании компонента
    useEffect(() => {
      const loadManufacturers = async () => {
        try {
          const response = await fetch(ApiUrl + "/api/ReturnListManufacturer");
          if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
          
          const data = await response.json();
          // Записываем массив в стейт
          setManufacturer(data.manufacturer || []); 
        } catch (error) {
          console.error("Ошибка загрузки производителей:", error);
        }
      };

      loadManufacturers();
    }, []);

    // 2. Фильтрация списка на основе введенного текста
    const filteredManufacturers = manufacturer.filter(p =>
      p.nameManufacturer?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 3. Обработка выбора производителя
    const handleSelectManufacturer = (guid, name) => {
      setSelectedName(name);      // Отображаем имя в поле
      setSearchTerm('');          // Сбрасываем текст в поиске
      setIsOpen(false);           // Закрываем выпадающий список
      handleSelectManufacturerChange(guid, setGuidIdManufacturer, setProviderManufacturerInfo, setProviderManufacturerList); // Вызываем вашу функцию (передаем ID бэкенду)
    };

    // 4. Закрытие списка при клике в любое другое место экрана
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className="position-relative w-100" ref={dropdownRef}>
        {/* Кастомное поле, имитирующее селект */}
        <div 
          className="form-select text-start d-flex justify-content-between align-items-center" 
          onClick={() => setIsOpen(!isOpen)}
          style={{ cursor: 'pointer' }}
        >
          <span className={selectedName ? "text-dark" : "text-muted"}>
            {selectedName || "Выберите производителя"}
          </span>
        </div>

        {/* Окно поиска и выпадающий список */}
        {isOpen && (
          <div 
            className="position-absolute bg-white border rounded shadow mt-1 p-2 w-100" 
            style={{ zIndex: 1050 }}
          >
            {/* Поле ввода текста */}
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Поиск производителя..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />

            {/* Список отфильтрованных элементов с ограничением высоты */}
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {filteredManufacturers.length > 0 ? (
                filteredManufacturers.map(p => (
                  <div
                    key={p.guidIdManufacturer}
                    className="dropdown-item p-2 rounded"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSelectManufacturer(p.guidIdManufacturer, p.nameManufacturer)}
                  >
                    {p.nameManufacturer}
                  </div>
                ))
              ) : (
                <div className="text-muted p-2 text-center" style={{ fontSize: '14px' }}>
                  Производитель не найден
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
};

export default Manufacturer;