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
  wikipedia: string;
};

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
    <div className="wrapper lg:p-8 sm:p-2">
      <h1 className="text-center p-4 mb-12 text-6xl">What happened on this day in history?</h1>
      <div className="flex justify-center flex-col items-center">
        <div className="w-full flex items-center justify-center lg:px-20 sm: px-8">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              format="DD/MM"
              views={["day", "month"]}
              onChange={(newValue) => setValue(newValue)}
              value={value}
              className="w-full"
            />
          </LocalizationProvider>
        </div>
        <div className="container px-4 sm:px-8 lg:grid lg:grid-cols-2 lg:gap-x-8">
          {apiData &&
            apiData.events.map((event: Event, i: number) => {
              return (
                <div key={i} className="m-8 p-4">
                  <p className="text-4xl mb-6">Year: {event.year}</p>
                  <p className="mb-2"><span className="text-2xl mr-3 underline">Description:</span> <span className="text-xl">{event.description}</span></p>
                  <p className="mb-2"><span className="text-2xl underline">Wikipedia Links:</span></p>
                  <ul>
                    {event.wikipedia.map((link: Link) => {
                      console.log(link);
                      return (
                        <li className="pl-4 text-2xl mb-2">
                          <a href={link.wikipedia} target="_blank" className="link text-orange-600">
                            {link.title}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default App;
