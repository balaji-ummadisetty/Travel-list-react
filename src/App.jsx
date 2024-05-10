import { useState } from 'react';
import './App.css'
// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: false },
//   { id: 2, description: "Socks", quantity: 12, packed: false },
//   { id: 3, description: "Bag", quantity: 5, packed: true },
// ];
const Logo = () => {
  return (
    <h1>🏝️ Far Away 🧳</h1>
  );
}

const Form = ({ onAddItems }) => {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);


  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;
    const newItem = { description, quantity, packed: false, id: Date.now() };
    onAddItems(newItem);
    setDescription('');
    setQuantity(1);
  }
  return (
    <form className='add-form' onSubmit={(e) => {
      handleSubmit(e)
    }
    }>
      <h3>What do you need for Your Trip</h3>
      <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>

      <input type="text" placeholder="Item..." value={description} onChange={(e) => setDescription(e.target.value)}></input>
      <button>Add</button>
    </form>
  );
}


const PackingList = ({ items, onDeleteItem ,OnToogle,OnClear}) => {
  const [sortby,setSortby] = useState("input");

  let sortedItems;
  if(sortby ==='input') sortedItems=items;
  if(sortby==='description') sortedItems = items.slice().sort((a,b)=> a.description.localeCompare(b.description));
  if(sortby === 'packed') sortedItems = items.slice().sort((a,b)=> Number(a.packed)-Number(b.packed));
  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => {
          return <Item item={item} key={item.id} onDeleteItem={onDeleteItem} OnToogle={OnToogle}/>
        })}
      </ul>

      <div className='actions'>
        <select value={sortby} onChange={(e)=>{setSortby(e.target.value)}}>
          <option value='input'> Sort by Input Order</option>
          <option value='description'> Sort by Description</option>
          <option value='packed'> Sort by Packed status</option>
        </select>
        <button onClick={OnClear}>
          Clearing List
        </button>
      </div>
    </div>
  );
}
const Item = ({ item, onDeleteItem ,OnToogle}) => {
  return (
    <li>
      <input type='checkbox' value={item.packed} onChange={() => OnToogle(item.id)}></input>
      <span style={{ textDecoration: item.packed ? "line-through" : "none" }}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}

const Stats = ({items}) => {
  const noOfItems = items.length;
  if(!noOfItems){
    return (
      <p className='stats'>
        <em> Start adding some items to your packing list</em>
      </p>
    )
  }
  const noOfItemschecked = items.filter(item => item.packed).length;
  const checkedPercentage = noOfItems > 0 ?parseInt(noOfItemschecked)/parseInt(noOfItems):0;
  return (
    <footer className='stats'>
      <em> You have {noOfItems} items on Your list, and you already Packed {noOfItemschecked} ({(checkedPercentage.toFixed(2))}%) </em>
    </footer>
  )
}


function App() {
  const [items, setItems] = useState([]);
  function handleAddItem(item) {
    setItems((items) => [...items, item]);
  }
  function handleDeleteItem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }
  function handleToggleItem(id) {
    setItems((items) => items.map((item) =>
      item.id === id ? { ...item, packed: !item.packed } : item
    )
    );
  }
  function handleClearItems(id) {
    const confirm = window.confirm("Are You sure to clear all items?");
    if(confirm)setItems([]);
    
  }
  return (
    <div className='app'>
      <Logo />
      <Form onAddItems={handleAddItem} />
      <PackingList items={items} onDeleteItem={handleDeleteItem} OnToogle={handleToggleItem} OnClear={handleClearItems}/>
      <Stats items={items}/>

    </div>
  )
}

export default App
