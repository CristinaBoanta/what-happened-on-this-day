import "./App.css";
import { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

type HistoricalDataResponse = {
  wikipedia: string;
  date: string;
  events: Event[];
};

type Event = {
  year: string;
  description: string;
  wikipedia: Link[];
};

type Link = {
  title: string; 
  wikipedia: string
}

const App = () => {
  const [apiData, setApiData] = useState<HistoricalDataResponse | null>(null);
  const [value, setValue] = useState<Dayjs | null>(dayjs());

  useEffect(() => {
    if (value) {
      const formattedDate = value.format("M/D");
      fetch(`https://byabbe.se/on-this-day/${formattedDate}/events.json`)
        .then((response) => response.json())
        .then((data) => {
          setApiData(data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [value]);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div>
          <DatePicker
            format="DD/MM"
            views={["day", "month"]}
            onChange={(newValue) => setValue(newValue)}
            value={value}
          />

          {apiData &&
            apiData.events.map((event: Event, i: number) => {
              return (
                <div key={i} className="m-8 p-4">
                  <p>Year: {event.year}</p>
                  <p>Description: {event.description}</p>
                  <p>Wikipedia Links:</p>
                  <ul>{event.wikipedia.map((link: Link) => {
                    console.log(link);
                    return (
                      <li className="pl-8"><a href={link.wikipedia} target="_blank">{link.title}</a></li>
                    )
                  })}</ul>
                </div>
              );
            })}
        </div>
      </LocalizationProvider>
    </>
  );
};

export default App;
