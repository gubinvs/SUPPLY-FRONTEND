import React, { useState, useRef, useEffect } from 'react';
import Select from 'react-select';
import "./informationPal.css";
import "../applicationPanel.css";
import "./dataCollaborator.css";
import "./informationCompanyCard.css";
import ApiUrl from "../../js/ApiUrl.js";
import InformationCompanyCard from "./InformationCompanyCard.jsx";
import DataCollaborator from "./DataCollaborator.jsx";
import { SpinnersMin } from "../../ElementApplication/Spinners.jsx";
import {useProviders} from "../../js/Utilits/loadProviders.js";  
  
  
  
  
  // Список поставщиков
  const Component = () => {
    const { providers, loading, error } = useProviders();
    // Вставьте этот код внутрь вашего компонента вместо старого <select>
    const [searchTerm, setSearchTerm] = useState('');      // Текст в поиске
    const [isOpen, setIsOpen] = useState(false);            // Показ списка
    const [selectedName, setSelectedName] = useState('');   // Имя выбранного поставщика
    const dropdownRef = useRef(null);                       // Ссылка для закрытия по клику вне элемента

    // 1. Фильтруем массив поставщиков на основе ввода пользователя
    const filteredProviders = providers.filter(p =>
      p.nameProvider?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Логика при выборе поставщика из списка
    const handleSelectProvider = (guid, name) => {
      setSelectedName(name);   // Сохраняем имя для отображения в инпуте
      setSearchTerm('');       // Сбрасываем текст поиска
      setIsOpen(false);        // Закрываем меню
      handleProviderChange(guid); // Вызываем вашу функцию (передаем ID бэкенду) 
    };

    // 3. Закрытие выпадающего списка, если кликнули в любое другое место экрана
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 1. Фильтрация списка на основе ввода пользователя
    const filteredManufacturers = manufacturer.filter(p =>
      p.nameManufacturer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (guid, name) => {
      setSelectedName(name);
      setSearchTerm(''); // Очищаем поиск после выбора
      setIsOpen(false);  // Закрываем список
      
      // Здесь можно вызвать функцию отправки id наверх, например: onChange(guid)
      //console.log("Выбран ID:", guid);
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>Ошибка: {error.message}</p>;

    return (
      <div className="position-relative w-100" ref={dropdownRef}>
        {/* Имитация селекта: клик открывает поиск */}
        <div 
          className="form-select text-start d-flex justify-content-between align-items-center" 
          onClick={() => setIsOpen(!isOpen)}
          style={{ cursor: 'pointer' }}
        >
          <span className={selectedName ? "text-dark" : "text-muted"}>
            {selectedName || "Выберите поставщика"}
          </span>
        </div>

        {/* Выпадающий блок с поисковой строкой и результатами */}
        {isOpen && (
          <div 
            className="position-absolute bg-white border rounded shadow mt-1 p-2 w-100" 
            style={{ zIndex: 1050 }}
          >
            {/* Поле для ввода поискового запроса */}
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Начните вводить название..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus // Фокус установится автоматически при открытии
            />

            {/* Список отфильтрованных поставщиков */}
            <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {filteredProviders.length > 0 ? (
                filteredProviders.map(p => (
                  <div
                    key={p.guidIdProvider}
                    className="dropdown-item p-2 rounded"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSelectProvider(p.guidIdProvider, p.nameProvider)}
                  >
                    {p.nameProvider}
                  </div>
                ))
              ) : (
                <div className="text-muted p-2 text-center" style={{ fontSize: '14px' }}>
                    Поставщик не найден
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
export default Component;