import React, { useState } from "react";
import groupBy from "lodash/groupBy";
import pick from "lodash/pick";
import Select from "react-select";
import compareAsc from "date-fns/compareAsc";
import parse from "date-fns/parse";
import "react-datepicker/dist/react-datepicker.css";

import Form from "./Form";
import Dates from "./Dates";
import "./App.css";
import "./styles.css";

const testDate = {
  title: "что то",
  day: "04.09.1990",
  firstDate: new Date(4, 9, 1990, 9, 30),
  lastDate: new Date(4, 9, 1990, 11, 30),
  id: 567
};

function App() {
  const [dates, setDates] = useState([testDate]);
  const [filter, setFilter] = useState(null);
  const deleteDate = id => setDates(dates.filter(day => day.id !== id));
  const handleSelect = value => {
    if (value) {
      setFilter(value.value);
    } else {
      setFilter(null);
    }
  };

  const groupedByDays = groupBy(dates, date => date.day);

  let filteredDays = groupedByDays;

  if (filter) {
    filteredDays = pick(groupedByDays, filter);
  }

  const options = Object.keys(groupedByDays)
    .sort((a, b) =>
      compareAsc(
        parse(a[0].day, "dd.MM.yyyy", new Date()),
        parse(b[0].day, "dd.MM.yyyy", new Date())
      )
    )
    .map(key => ({
      value: key,
      label: key
    }));

  const styles = {
    input: styles => ({ ...styles, width: 150 })
  };

  return (
    <div className="container">
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 10
        }}
      >
        <Select
          isClearable
          options={options}
          placeholder="Дата"
          styles={styles}
          onChange={handleSelect}
        />
      </div>

      <div className="row">
        <Dates deleteDate={deleteDate} groupedByDays={filteredDays} />
      </div>
      <Form setDates={setDates} dates={dates} />
    </div>
  );
}

export default App;
