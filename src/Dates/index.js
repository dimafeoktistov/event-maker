import React from "react";
import PropTypes from "prop-types";
import compareAsc from "date-fns/compareAsc";
import parse from "date-fns/parse";
import format from "date-fns/format";

const Dates = props => {
  return Object.values(props.groupedByDays)
    .sort((a, b) =>
      compareAsc(
        parse(a[0].day, "dd.MM.yyyy", new Date()),
        parse(b[0].day, "dd.MM.yyyy", new Date())
      )
    )
    .map(days => (
      <div className="days">
        <div className="day__title">{days[0].day}</div>
        {days.map(day => (
          <li className="day__item">
            {day.title}
            <div className="day__data">
              <span>{format(day.firstDate, "HH:mm")}</span>
              <span>{format(day.lastDate, "HH:mm")}</span>
              <button onClick={() => props.deleteDate(day.id)} className="delete">X</button>
            </div>
          </li>
        ))}
      </div>
    ));
};

Dates.propTypes = {};

export default Dates;
