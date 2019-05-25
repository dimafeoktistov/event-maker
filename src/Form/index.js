import React from "react";
import PropTypes from "prop-types";
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ru } from "date-fns/locale";
import areRangesOverlapping from "date-fns/areIntervalsOverlapping";
import format from "date-fns/format";
import isBefore from "date-fns/isBefore";
import setHours from "date-fns/setHours";
import addMinutes from "date-fns/addMinutes";
import setMinutes from "date-fns/setMinutes";
import getMinutes from "date-fns/getMinutes";
import getHours from "date-fns/getHours";
import DatePicker from "react-datepicker";

let i = 0;

const AddEventForm = props => {
  const minTime = setHours(setMinutes(new Date(), 59), 8);
  const maxTime = setHours(setMinutes(new Date(), 0), 18);

  const validationSchema = yup.object().shape({
    title: yup
      .string()
      .min(2, "Слишком короткое название!")
      .max(15, "Слишком длинное название!")
      .required("Обязательно к заполнению!"),
    date: yup
      .date()
      .required("Обязательно к заполнению!")
      .typeError("Необходимо указать дату!"),
    beginingTime: yup
      .date()
      .min(minTime, "Дата не может быть меньше 9 часов!")
      .max(maxTime, "Дата не может быть больше 18 часов!")
      .required("Обязательно к заполнению!")
      .typeError("Необходимо указать дату!"),
    endingTime: yup
      .date()
      .min(minTime, "Дата не может быть меньше 9 часов!")
      .max(maxTime, "Дата не может быть больше 18 часов!")
      .required("Обязательно к заполнению!")
      .typeError("Необходимо указать дату!")
  });

  const getCorrectDate = (timeEntry, date) => {
    const [dateHours, dateMinutes] = [
      getHours(timeEntry),
      getMinutes(timeEntry)
    ];
    return setHours(setMinutes(date, dateMinutes), dateHours);
  };

  const handleSubmit = (values, formikProps) => {
    console.log(formikProps);
    const { beginingTime, endingTime, date } = values;
    const firstDate = getCorrectDate(beginingTime, date);
    const lastDate = getCorrectDate(endingTime, date);
    if (isBefore(lastDate, firstDate)) {
      formikProps.setStatus("Вторая дата не может быть раньше первой!");
      setTimeout(formikProps.setStatus, 3000, null);
      return;
    }
    const day = format(firstDate, "dd.MM.yyyy");
    const eventsAtDay = props.dates.filter(date => date.day === day);
    if (eventsAtDay.length > 0) {
      eventsAtDay.map(event => {
        if (
          areRangesOverlapping(
            { start: firstDate, end: lastDate },
            { start: event.firstDate, end: event.lastDate }
          )
        ) {
          formikProps.setStatus("Даты перекрываются!");
          setTimeout(formikProps.setStatus, 3000, null);
          return null;
        }
        props.setDates(
          props.dates.concat({
            firstDate,
            lastDate,
            day,
            title: values.title,
            id: i++
          })
        );
      });
    } else {
      props.setDates(
        props.dates.concat({
          firstDate,
          lastDate,
          day,
          title: values.title,
          id: i++
        })
      );
    }
  };

  return (
    <Formik
      initialValues={{
        date: null,
        title: "",
        beginingTime: null,
        endingTime: null
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, status }) => {
        const handleBeginingTimeChange = value => {
          setFieldValue("beginingTime", value);
          setFieldValue("endingTime", null);
        };

        return (
          <Form className="add-event-form">
            <h1 className="add-event-form__title">Добавить мероприятие</h1>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <div className="add-event-form__group">
                <label htmlFor="title" className="add-event-form__label">
                  Название
                </label>
                <Field
                  type="text"
                  name="title"
                  className="add-event-form__input"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
              <div className="add-event-form__group">
                <label htmlFor="date" className="add-event-form__label">
                  Дата
                </label>
                <Field
                  type="text"
                  name="date"
                  render={() => (
                    <DatePicker
                      selected={values.date}
                      onChange={value => setFieldValue("date", value)}
                      locale={ru}
                      className="add-event-form__input"
                      dateFormat="dd.MM.yyyy"
                    />
                  )}
                />
                <ErrorMessage
                  name="date"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
              <div className="add-event-form__group">
                <label htmlFor="beginingTime" className="add-event-form__label">
                  Время начала
                </label>
                <Field
                  type="text"
                  name="beginingTime"
                  render={() => (
                    <DatePicker
                      selected={values.beginingTime}
                      onChange={handleBeginingTimeChange}
                      showTimeSelect
                      showTimeSelectOnly
                      timeFormat="HH:mm"
                      dateFormat="HH:mm"
                      locale={ru}
                      minTime={minTime}
                      maxTime={maxTime}
                      className="add-event-form__input"
                      timeCaption="Время"
                    />
                  )}
                />
                <ErrorMessage
                  name="beginingTime"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
              <div className="add-event-form__group">
                <label htmlFor="endingTime" className="add-event-form__label">
                  Время конца
                </label>
                <Field
                  type="text"
                  name="endingTime"
                  render={() => (
                    <DatePicker
                      selected={values.endingTime}
                      onChange={value => setFieldValue("endingTime", value)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeFormat="HH:mm"
                      dateFormat="HH:mm"
                      locale={ru}
                      minTime={
                        values.beginingTime
                          ? addMinutes(values.beginingTime, 1)
                          : minTime
                      }
                      maxTime={maxTime}
                      className="add-event-form__input"
                      timeCaption="Время"
                    />
                  )}
                />
                <ErrorMessage
                  name="endingTime"
                  component="div"
                  style={{ color: "red" }}
                />
              </div>
            </div>

            <button type="submit" className="add-event-form__submit">
              Добавить
            </button>
            <div style={{ color: "red" }}>{status}</div>
          </Form>
        );
      }}
    </Formik>
  );
};

AddEventForm.propTypes = {};

export default AddEventForm;
