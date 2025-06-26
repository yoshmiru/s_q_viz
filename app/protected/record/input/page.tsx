'use client';
import React, { useState } from 'react';

interface RecordInputProps {
  // Define any props if needed, e.g., onSubmit handler
  onSubmit: (data: any) => void;
}

type RecordType = 'harvest' | 'purchase';

const RecordInput: React.FC<RecordInputProps> = ({ onSubmit }) => {
  const [recordType, setRecordType] = useState<RecordType>('harvest');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default to today
  const [item, setItem] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [unit, setUnit] = useState<string>('個'); // Default unit
  const [locationOrCost, setLocationOrCost] = useState<string>(''); // Used for location or cost
  const [memo, setMemo] = useState<string>('');
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      recordType,
      date,
      item,
      quantity: parseFloat(quantity), // Convert to number
      unit,
      memo,
      ...(recordType === 'harvest' ? { location: locationOrCost, photo } : { cost: parseFloat(locationOrCost) }),
    };
    onSubmit(formData);
    // Optionally reset form fields here
  };

  return (
    <div className="record-input-container">
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ccc' }}>
        <button>&lt;</button>
        <h2>記録する</h2>
        <div></div> {/* Placeholder for alignment */}
      </header>

      {/* Record Type Selection */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <button
          onClick={() => setRecordType('harvest')}
          style={{ padding: '10px 20px', marginRight: '10px', backgroundColor: recordType === 'harvest' ? '#007bff' : '#f0f0f0', color: recordType === 'harvest' ? 'white' : 'black', border: 'none', borderRadius: '5px' }}
        >
          収穫を記録
        </button>
        <button
          onClick={() => setRecordType('purchase')}
          style={{ padding: '10px 20px', backgroundColor: recordType === 'purchase' ? '#007bff' : '#f0f0f0', color: recordType === 'purchase' ? 'white' : 'black', border: 'none', borderRadius: '5px' }}
        >
          購入を記録
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="date">日付:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="item">品目:</label>
          <input
            type="text" // This would ideally be a searchable dropdown
            id="item"
            placeholder="例: トマト"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
          <label htmlFor="quantity" style={{ marginRight: '10px' }}>数量:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginLeft: '10px' }}
          >
            <option value="個">個</option>
            <option value="g">g</option>
            <option value="kg">kg</option>
          </select>
        </div>

        {recordType === 'harvest' && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="location">場所 (任意):</label>
              <input
                type="text" // This would ideally be a dropdown/text combo
                id="location"
                placeholder="例: ベランダ菜園"
                value={locationOrCost}
                onChange={(e) => setLocationOrCost(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="photo">写真を追加 (任意):</label>
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
          </>
        )}

        {recordType === 'purchase' && (
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="cost">費用 (任意):</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="number"
                id="cost"
                placeholder="0000"
                value={locationOrCost}
                onChange={(e) => setLocationOrCost(e.target.value)}
                style={{ flex: 1, padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <span style={{ marginLeft: '5px', marginTop: '5px' }}>円</span>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="memo">メモ (任意):</label>
          <textarea
            id="memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
          ></textarea>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          style={{ width: '100%', padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.1em', cursor: 'pointer' }}
        >
          記録する
        </button>
      </form>
    </div>
  );
};

export default RecordInput;
