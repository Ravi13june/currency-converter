import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import "./App.css";
import CurrencyRow from "./CurrencyRow";

const BASE_URL = "https://api.exchangeratesapi.io/latest";
function App() {
  const [options, setOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(0);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  // for modal
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  console.log(exchangeRate);

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }
  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        const firstCurrency = Object.keys(data.rates)[0];
        setOptions([data.base, ...Object.keys(data.rates)]);
        setFromCurrency(data.base);
        setToCurrency(firstCurrency);
        setExchangeRate(data.rates[firstCurrency]);
      });
  }, []);

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then((res) => res.json())
        .then((data) => setExchangeRate(data.rates[toCurrency]));
    }
  }, [fromCurrency, toCurrency]);

  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  }

  return (
    <>
      <div className="converter">
        <h1>
          Currency <br /> Converter
        </h1>
        <CurrencyRow
          options={options}
          selectedCurrency={fromCurrency}
          onChangeCurrency={(e) => setFromCurrency(e.target.value)}
          amount={fromAmount}
          onChangeAmount={handleFromAmountChange}
        />
        <div className="equals">=</div>
        <CurrencyRow
          options={options}
          selectedCurrency={toCurrency}
          onChangeCurrency={(e) => setToCurrency(e.target.value)}
          onChangeAmount={handleToAmountChange}
          amount={toAmount}
        />
        <Button variant="dark" onClick={handleShow}>
          See More...
        </Button>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <h4>
            {fromAmount} {fromCurrency} is equals to
          </h4>
        </Modal.Header>
        <ModalBody>
          <CurrencyRow
            options={options}
            selectedCurrency={toCurrency}
            onChangeCurrency={(e) => setToCurrency(e.target.value)}
            onChangeAmount={handleToAmountChange}
            amount={toAmount}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="info" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default App;
