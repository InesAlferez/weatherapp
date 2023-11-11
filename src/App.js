import './App.css';
import './Components/WeatherApp/WeatherApp.css';
import WeatherApp from './Components/WeatherApp/WeatherApp';


function App() {
  return (
    <><div className="App">
      <WeatherApp />
      <div className='footer'>
      <div className='footer-content'>
        <p>Created by: Ines Alferez</p>
        <p>API used: OpenWeather</p>
      </div>
    </div>
    </div>
   </>
  );
}

export default App;
