import React, { useState } from 'react';

const ExcelPasteInput = () => {
  const [data, setData] = useState([]);

  const handlePaste = (e) => {
    e.preventDefault();

    const clipboardData = e.clipboardData.getData('text');
    const rows = clipboardData.trim().split('\n').map(row => row.split('\t'));
    setData(rows);
  };

  return (
    <div>
      <h3>Вставьте данные из Excel:</h3>
      <textarea
        onPaste={handlePaste}
        placeholder="Вставьте сюда (Ctrl+V)..."
        rows={6}
        style={{ width: '100%', border: '1px solid #ccc' }}
      />

      {data.length > 0 && (
        <>
          <h4>Результат:</h4>
          <table style={{ borderCollapse: 'collapse', marginTop: '10px' }}>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                      style={{
                        border: '1px solid #aaa',
                        padding: '5px',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ExcelPasteInput;
