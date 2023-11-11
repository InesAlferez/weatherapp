import React, { useState, useCallback, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import search_icon from '../Assets/search.png';
import clear_icon from '../Assets/clear.png';
import cloud_icon from '../Assets/cloud.png';
import drizzle_icon from '../Assets/drizzle.png';
import rain_icon from '../Assets/rain.png';
import wind_icon from '../Assets/wind.png';
import snow_icon from '../Assets/snow.png';
import thermometer_icon from '../Assets/thermometer.png';
import barometer_icon from '../Assets/barometer.png';
import precipitation_icon from '../Assets/precipitation.png';
import sunset_icon from '../Assets/sunset.png';
import sunrise_icon from '../Assets/sunrise.png';

const WeatherApp = () => {
  const api_key = process.env.REACT_APP_API_KEY; // Replace with your OpenWeatherMap API key

  const [wiconm, setWicon] = useState(clear_icon);
  const [temperature, setTemperature] = useState('');
  const [cityName, setCityName] = useState('');
  const [weatherDescription, setWeatherDescription] = useState('');
  const [humidity, setHumidity] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [tempMin, setTempMin] = useState('');
  const [tempMax, setTempMax] = useState('');
  const [pressure, setPressure] = useState('');
  const [feelsLike, setFeelsLike] = useState('');
  const [sunrise, setSunrise] = useState('');
  const [sunset, setSunset] = useState('');
  const [visibility, setVisibility] = useState('');
  const [clouds, setClouds] = useState('');
  const [hourlyData, setHourlyData] = useState([]);
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 2,
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const fetchWeatherData = useCallback(async () => {
    if (zipCode === '') {
      return;
    }

    setLoading(true);

    try {
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?zip=${zipCode}&appid=${api_key}&units=imperial`;
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${api_key}&units=imperial`;

      const [forecastResponse, weatherResponse] = await Promise.all([
        fetch(forecastUrl),
        fetch(weatherUrl),
      ]);
      

      if (weatherResponse.ok && forecastResponse.ok) {
        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();


        // Process and set weather data
        if (weatherData && weatherData.main && weatherData.main.humidity && weatherData.wind && weatherData.wind.speed && weatherData.main.temp && weatherData.name) {
          setTemperature(`${Math.floor(weatherData.main.temp)} °F`);
          setCityName(weatherData.name);
          setHumidity(`${weatherData.main.humidity} %`);
          setWindSpeed(`${Math.floor(weatherData.wind.speed)} mph`);
          setTempMin(`${Math.floor(weatherData.main.temp_min)} °F`);
          setTempMax(`${Math.floor(weatherData.main.temp_max)} °F`);
          setPressure(`${weatherData.main.pressure} hPa`);
          setFeelsLike(`${Math.floor(weatherData.main.feels_like)} °F`);
          setSunrise(formatTime(weatherData.sys.sunrise));
          setSunset(formatTime(weatherData.sys.sunset));
          setVisibility(`${(weatherData.visibility / 1609.34).toFixed(2)} miles`);
          setClouds(`${weatherData.clouds.all}%`);
          setWeatherDescription(weatherData.weather[0].description);
          if (weatherData.weather[0].icon === '01d' || weatherData.weather[0].icon === '01n') {
            setWicon(clear_icon);
          } else if (weatherData.weather[0].icon === '02d' || weatherData.weather[0].icon === '02n') {
            setWicon(cloud_icon);
          } else if (weatherData.weather[0].icon === '03d' || weatherData.weather[0].icon === '03n') {
            setWicon(drizzle_icon);
          } else if (weatherData.weather[0].icon === '04d' || weatherData.weather[0].icon === '04n' || weatherData.weather[0].icon === '50n') {
            setWicon(cloud_icon);
          } else if (weatherData.weather[0].icon === '09d' || weatherData.weather[0].icon === '09n') {
            setWicon(rain_icon);
          } else if (weatherData.weather[0].icon === '10d' || weatherData.weather[0].icon === '10n') {
            setWicon(rain_icon);
          } else if (weatherData.weather[0].icon === '13d' || weatherData.weather[0].icon === '13n') {
            setWicon(snow_icon);
          } else {
            setWicon(clear_icon);
          }

          // Filter the forecast data for the next 24 hours
          const currentTime = new Date().getTime();
          const filteredData = forecastData.list.filter((hourlyItem) => {
            const forecastTime = new Date(hourlyItem.dt * 1000);
            return forecastTime > currentTime && forecastTime <= currentTime + 24 * 60 * 60 * 1000;
          }); 
          setHourlyData(filteredData);
        } else {
          setError('Data is missing expected properties');
        }
      } else {
        setError('Error fetching weather data');
      }
    } finally {
      setLoading(false);
    }
  }, [zipCode, api_key]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]); // Fetch weather data on initial render  
 

  const handleSearch = () => {
    fetchWeatherData();
  };

  const handleEnterKey = (e) => {
    if (e.key === 'Enter') {
      fetchWeatherData();
    }
  };

  return (
    <div className='container'>
      <div className='top-bar'>
        <input
          type='text'
          className='zipCode'
          placeholder='Search for Zip Code'
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          onKeyUp={handleEnterKey}
        />
        <button className='search_button' onClick={handleSearch}>
          <img src={search_icon} alt='Search' />
        </button>
      </div>
      {loading && <div className='loading'>Loading...</div>}
      <div className='weather-image'>
        <img src={wiconm} alt='Weather Icon' />
      </div>
      <div className='weather-temp'>{temperature}</div>
      <div className='weather-location'>{cityName}</div>
      <div className='feels-like'>{feelsLike} - Feels like</div>
      <div className='weather-description'>{weatherDescription}</div>
      <div className='hourly-forecast'>
        <Slider {...sliderSettings}>
          {hourlyData.map((hourlyItem, index) => {
            const { dt_txt, main } = hourlyItem;
            const time = new Date(dt_txt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            });
            const temperature = Math.floor(main.temp);
            return (
              <div key={index} className='hourly-data'>
                <img src={thermometer_icon} alt='Thermometer' className='icon' />
                <div className='text'>{time}</div>
                <div className='text'>{temperature}°F</div>
              </div>
            );
          })}
        </Slider>
      </div>
      <div>{error && <div className='error'>{error}</div> /* Display error message if error */}</div>
      <div className='data-container'>
        <div className='card'>
          <div className='element'>
            <img src={precipitation_icon} alt='Humidity' className='icon' />
            <div className='data'>
              <div className='humidity-percent'>{humidity}</div>
              <div className='text'>Humidity</div>
            </div>
          </div>
          <div className='element'>
            <img src={wind_icon} alt='Wind' className='icon' />
            <div className='data'>
              <div className='wind-speed'>{windSpeed}</div>
              <div className='text'>Wind Speed</div>
            </div>
          </div>
          <div className='element'>
            <img src={barometer_icon} alt='Barometer' className='icon' />
            <div className='data'>
              <div className='temperature'>{pressure}</div>
              <div className='text'>Pressure</div>
            </div>
          </div>
        </div>
        <div className='card'>
          <div className='element'>
            <img src={sunrise_icon} alt='Sunrise' className='icon' />
            <div className='data'>
              <div className='sunset'>{sunrise}</div>
              <div className='text'>Sunrise</div>
            </div>
          </div>
          <div className='element'>
            <img src={sunset_icon} alt='Sunset' className='icon' />
            <div className='data'>
              <div className='pressure'>{sunset}</div>
              <div className='text'>Sunset</div>
            </div>
          </div>
          <div className='element'>
            <img src={wind_icon} alt='Visibility' className='icon' />
            <div className='data'>
              <div className='visibility'>{visibility}</div>
              <div className='text'>Visibility</div>
            </div>
          </div>
        </div>
        <div className='card'>
          <div className='element'>
            <img src={thermometer_icon} alt='Max Temp' className='icon' />
            <div className='data'>
              <div className='wind-direction'>{tempMax}</div>
              <div className='text'>Max Temp</div>
            </div>
          </div>
          <div className='element'>
            <img src={thermometer_icon} alt='Min Temp' className='icon' />
            <div className='data'>
              <div className='precipitation'>{tempMin}</div>
              <div className='text'>Min Temp</div>
            </div>
          </div>
          <div className='element'>
            <img src={wind_icon} alt='Clouds' className='icon' />
            <div className='data'>
              <div className='clouds'>{clouds}</div>
              <div className='text'>Clouds</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
