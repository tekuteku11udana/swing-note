import React from 'react';
import TodoList from './components/TodoList';

// import './App.css';

function App() {
  

  return (
    <div className={"flex flex-row w-full"}>
      <p className={"p-2 bg-gray-400"}>left</p>
      <TodoList />
      <p className={"p-2 bg-gray-400"}>right</p>
    </div>
    
  );
}

export default App;
