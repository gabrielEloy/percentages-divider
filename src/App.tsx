import React from 'react';
import './App.css';

interface IItem {
  id: string;
  label: string;
  value: number;
}

function App() {
  const [totalValueLimit, setTotalValueLimit] = React.useState(100);

  const [items, setItems] = React.useState<IItem[]>([]);
  const [currentItemLabel, setCurrentItemLabel] = React.useState('');

  const updateItemsOnTotalValueChange = () => {
    const oldTotal = items.reduce((acc, item) => acc + item.value, 0);
    
    if(isNaN(totalValueLimit)){
      setTotalValueLimit(oldTotal);
      return;
    }

    const newItems = items.map(item => {
      const percentageFromTotal = item.value / oldTotal;
      return {...item, value: percentageFromTotal * totalValueLimit};
    });

    setItems(newItems);
  }
  
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

  console.log({items, totalValueLimit})
  return (
    <div className="App">
      <input value={currentItemLabel} onChange={(e) => setCurrentItemLabel(e.currentTarget.value)} />
      <button onClick={handleInsertItem}>insert new item</button>

      <span>splittedValue</span>
      <input value={totalValueLimit} onBlur={updateItemsOnTotalValueChange} onChange={e => setTotalValueLimit(Number(e.currentTarget.value))}></input>

      <div>
        <ul>
          {items.map(item => (<li key={item.id}><span>{item.label}</span>
          <input type="range" min={0} max={totalValueLimit} onChange={e => onUpdateItem(item.id,e.currentTarget.value)} value={item.value}/><span>{item.value.toFixed(2)}</span></li>))}
        </ul>
      </div>
    </div>
  );
}

export default App;
