import React from 'react';
import './index.scss';
import { PhoneBook } from '../PhoneBook';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        PhoneBook
      </header>
      <div className="App-body">
        <PhoneBook/>
      </div>
      <footer className="App-footer">
        Powered by Pure Stardust
      </footer>
    </div>
  );
}

export default App;
