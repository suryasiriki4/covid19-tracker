import React, {useState, useEffect} from 'react';
import './App.css';
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {sortData, prettyPrintStat} from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  
  const [mapCenter, setMapCenter] = useState({ lat : 34.80746, lng : -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  //for making info-boxes active
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    const updateInfo = async () => {
      await fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
    }
    updateInfo();
  },[]);

  useEffect( () => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((respone) => respone.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    }
    getCountries();
    
  }, []);
  

  const onCountryChange = async (event) => {
    const CountryCode = event.target.value;
    const url = CountryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all"
                                                : `https://disease.sh/v3/covid-19/countries/${CountryCode}`;    

    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountry(CountryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
      }
    );
  }

  return (
    <div className="app">
        <div className="app__left">
            <div className="app__header">
              <h1>COVID-19 Tracker</h1>
              <FormControl className="app__dropdown">
                <Select variant="outlined"  onChange={onCountryChange} value={country} >
                  <MenuItem value="worldwide">world wide</MenuItem>
                  {
                    countries.map((country) => (
                      <MenuItem value={country.value}>{country.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>          
            </div>
            <div className="app__stats">
              <InfoBox isRed onClick={(e) => setCasesType("cases")} title="Covid Cases" active={casesType === "cases"} cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}></InfoBox>
              <InfoBox onClick={(e) => setCasesType("recovered")} title="Recovered" active={casesType === "recovered"} cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}></InfoBox>
              <InfoBox isRed onClick={(e) => setCasesType("deaths")} title="Deaths" active={casesType === "deaths"} cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}></InfoBox>
            </div>
            <Map
            countries={mapCountries}
            casesType={casesType}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>        
        
        <Card className="app__right">
          <CardContent>
              <div className="app__information">
                <h2>Live Cases by Country</h2>
                <Table countries={tableData}/>
                <h2 className="app__graphTitle">World Wide {casesType}</h2>
                <LineGraph className="app__graph" casesType={casesType}/>
              </div>
          </CardContent>
        </Card>
    </div>
  );
}

export default App;
