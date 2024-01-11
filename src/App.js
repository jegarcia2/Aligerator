import logo from './logo.svg';
import './App.css';
import MagnetComponent from '../components/Magnet';

function App() {
  return (
    MagnetComponent("https://www.datocms-assets.com/65346/1700234419-finnhorse_variation1.png?auto=compress%2Cformat&h=700&w=1000");
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
