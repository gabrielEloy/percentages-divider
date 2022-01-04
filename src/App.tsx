import React from 'react';
import './App.css';

interface IItem {
  id: string;
  label: string;
  value: number;
}

function App() {
  const totalValueLimit = 100;

  const [items, setItems] = React.useState<IItem[]>([]);
  const [currentItemLabel, setCurrentItemLabel] = React.useState('');

  const getNewItemsValue = (newItemsCount: number, newItem: IItem) => {
    const newMedianValue = totalValueLimit/newItemsCount;
    const oldMedianValue = totalValueLimit/(newItemsCount - 1);

    const newItems = items.map(item => {  
      const totalPercentage = item.value / oldMedianValue;
      const newValue = newMedianValue * totalPercentage;
      return {...item, value: newValue}
    })

    newItems.push({...newItem, value: newMedianValue});

    return newItems;
  }
  
  const handleInsertItem = () => {
    const newItem = {
      id: `item-${items.length}_${Math.ceil(Math.random() * 10000)}`,
      label: currentItemLabel,
      value: 0
    }

    const newItems = getNewItemsValue(items.length + 1, newItem);
    console.log({newItems})
    setItems(newItems)
    setCurrentItemLabel('');
  }

  const onUpdateItem = (id: string, newValue: string) => {
    const oldValue = items.find(item => item.id === id)?.value as number;
    const oldDiff = totalValueLimit - oldValue;
    
    const newDiff = totalValueLimit - Number(newValue);

    const newItems = items.map(item => {
      if(item.id === id){
        return {...item, value: Number(newValue)}
      }
      
      const itemPercentage = item.value / oldDiff;
      const newItemValue = newDiff * itemPercentage;

      return {...item, value: newItemValue}
    })

    setItems(newItems);
  }

  console.log(items)
  return (
    <div className="App">
      <input value={currentItemLabel} onChange={(e) => setCurrentItemLabel(e.currentTarget.value)} />
      <button onClick={handleInsertItem}>insert new item</button>

      <div>
        <ul>
          {items.map(item => (<li key={item.id}><span>{item.label}</span>
          <input type="range" onChange={e => onUpdateItem(item.id,e.currentTarget.value)} value={item.value}/><span>{item.value.toFixed(2)}</span></li>))}
        </ul>
      </div>
    </div>
  );
}

export default App;
