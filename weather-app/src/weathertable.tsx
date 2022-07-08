import React from "react";

interface WeatherTableProps {
  coordinates: google.maps.LatLng;
}

interface KeyValueFormat {
  [key: string]: number;
}

interface WeatherProps {
  name: string;
  weather: { description: string }[];
  main: KeyValueFormat;
  wind: KeyValueFormat;
  sys: KeyValueFormat;
}

const WeatherTable: React.FC<WeatherTableProps> = ({
  coordinates,
}) => {
  const [weather, setWeather] = React.useState<WeatherProps>();
  
  React.useEffect(() => {
    const fetchWeather = async () => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat()}&lon=${coordinates.lng()}&appid=45efb499ef30d411746b9b8596849489&units=imperial`
      );
      if (response.ok) {
        const data = await response.json();
        setWeather(data);
        return null;
      }
    };
    fetchWeather();
  }, [coordinates]);

  const formatWeatherCondition = () => {
    const conditionStrings = weather?.weather[0].description.split(" ");
    conditionStrings?.map((word: string, idx: number) => {
      const capitalized = word[0];
      const lowercase = word.slice(1);
      conditionStrings[idx] = capitalized.toUpperCase() + lowercase
      return null;
    });

    return conditionStrings?.join(" ");
  };

  const formatDawnDusk = (time: number) => {
    const date = new Date(time * 1000);
    const timeString = date.toTimeString().slice(0, 5);
    return timeString;
  };

  return (
    <>
      {weather && (
        <table className="weather-table">
        <tbody>
          <tr className="green-row">
            <th>Location</th>
            <td>{weather.name}</td>
          </tr>
          <tr className="blue-row">
            <th>Condition</th>
            <td>{formatWeatherCondition()}</td>
          </tr>
          <tr className="green-row">
            <th>Temperature</th>
            <td>{weather.main.temp} F</td>
          </tr>
          <tr className="blue-row">
            <th>Humidity</th>
            <td>{weather.main.humidity}%</td>
          </tr>
          <tr className="green-row">
            <th>Sunrise</th>
            <td>{formatDawnDusk(weather.sys.sunrise)}</td>
          </tr>
          <tr className="blue-row">
            <th>Sunset</th>
            <td>{formatDawnDusk(weather.sys.sunset)}</td>
          </tr>
          <tr className="green-row" >
            <th>Wind Speed</th>
            <td>{weather.wind.speed} mph</td>
          </tr>
          <tr className="blue-row">
            <th>Wind Direction</th>
            <td>{weather.wind.deg} degrees</td>
          </tr>
        </tbody>
      </table>
      )}
    </>
  )
} 

export default WeatherTable;
