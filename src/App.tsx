import "./App.css";
import { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

type HistoricalDataResponse = {
  wikipedia: string;
  date: string;
  events: Event[];
};

type Event = {
  year: string;
  description: string;
  wikipedia: { title: string; wikipedia: string }[];
};

const App = () => {
  const [apiData, setApiData] = useState<HistoricalDataResponse | null>(null);

  useEffect(() => {
    fetch("https://byabbe.se/on-this-day/10/21/events.json")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setApiData(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <DatePicker format="DD/MM" views={["day", "month"]} />

        {apiData && apiData.events.map((event: Event) => (
          <div key={event.year}>
            <p>Year: {event.year}</p>
            <p>Description: {event.description}</p>
            <p>Wikipedia Links:</p>
          </div>
        ))}
      </div>
    </LocalizationProvider>
  );
};

export default App;
