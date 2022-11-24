import { useState, useEffect } from "react";
import axios from "axios";

const Country = (props) => {
  return (
    <div>
      <h1>{props.country.name.common}</h1>
      <p>Capital: {props.country.capital}<br/>Area: {props.country.area}</p>
      <h4>Languages:</h4>
      <ul>
        {Object.values(props.country.languages).map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <br />
      <img
        src={props.country.flags.svg}
        height={150}
        alt="Flag was not found"
      ></img>
      <Weather countryName={props.country.name.common} lat={props.country.latlng[0]} long={props.country.latlng[1]} />
    </div>
  );
};

const CountryFilter = (props) => {
  const handleShowButton = (event) => {
    props.setFilterCountry(event.target.value);
  };

  const countryData = props.countries.filter((country) =>
    country.name.common
      .toLowerCase()
      .includes(props.filterCountry.toLowerCase())
  );

  if (countryData.length > 9)
    return <p>Too many matches, specify another filter</p>;
  else if (countryData.length < 2) {
    return (
      <div>
        {countryData.map((country) => (
          <Country key={country.name.common} country={country} />
        ))}
      </div>
    );
  } else {
    return (
      <div>
        {countryData.map((country) => (
          <li key={country.name.common}>
            {country.name.common}
            <button value={country.name.common} onClick={handleShowButton}>
              Show
            </button>
          </li>
        ))}
      </div>
    );
  }
};

const Weather = (props) => {
  const [weatherData, setWeatherData] = useState();
  const API_KEY = process.env.REACT_APP_API_KEY;
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${props.lat}&lon=${props.long}&appid=${API_KEY}`;

  useEffect(() => {
    axios.get(apiURL).then((response) => {
      setWeatherData(response.data);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (weatherData === undefined){
    return <p>Loading weather data...</p>
  }
  else {
    const icon = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    const temp =(weatherData.main.temp-273.15).toFixed(2);
    const windSpeed = weatherData.wind.speed;
    return(
      <form>
        <h2>Weather in {props.countryName}</h2>
        <p>Temperature: {temp} C&deg;</p>
        <img src={icon} alt="Loading..." />
        <br/>
        <p>Wind: {windSpeed} m/s</p>
      </form>
    )
  }
};

function App() {
  const [countries, setCountries] = useState([]);
  const [filterCountry, setFilterCountry] = useState("");

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      console.log(response.data);
      setCountries(response.data);
    });
  }, []);

  const handleCountryChange = (event) => {
    setFilterCountry(event.target.value);
  };

  return (
    <div>
      <form>
        <div>
          Find countries <input onChange={handleCountryChange} />
        </div>
      </form>
      <CountryFilter
        filterCountry={filterCountry}
        countries={countries}
        setFilterCountry={setFilterCountry}
      />
    </div>
  );
}

export default App;
