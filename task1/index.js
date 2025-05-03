require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const WINDOW_SIZE = parseInt(process.env.WINDOW_SIZE) || 10;


let windowState = [];
// TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ2Mjc5NjM1LCJpYXQiOjE3NDYyNzkzMzUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImI4YjhhM2Y0LWQ5NmQtNDEzZC05NjI5LTFkNDlmMzg3ZmM4MyIsInN1YiI6IjEyMmNzMDAyNkBpaWl0ay5hYy5pbiJ9LCJlbWFpbCI6IjEyMmNzMDAyNkBpaWl0ay5hYy5pbiIsIm5hbWUiOiJwcmF0ZWVrIHZlcm1hIiwicm9sbE5vIjoiMTIyY3MwMDI2IiwiYWNjZXNzQ29kZSI6ImJ6YkNueiIsImNsaWVudElEIjoiYjhiOGEzZjQtZDk2ZC00MTNkLTk2MjktMWQ0OWYzODdmYzgzIiwiY2xpZW50U2VjcmV0IjoibUZNVUF1cE5CdlBnVkNrQSJ9.MnjDZnHaPHCcxAutfUEjE77drxebW6VcXiHN0djaaeQ"
const apiMap ={
    p: 'http://20.244.56.144/evaluation-service/primes',
    f: 'http://20.244.56.144/evaluation-service/fibo',
    e: 'http://20.244.56.144/evaluation-service/even',
    r: 'http://20.244.56.144/evaluation-service/rand',
  };
  const fetchNumbers = async (type) => {
    const url = apiMap[type];
    try {
      const source = axios.CancelToken.source();
      const timeout = setTimeout(() => {
        source.cancel(`Timeout > 500ms`);
      }, 500);
  
      const res = await axios.get(url, {
        cancelToken: source.token,
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`
        }
      });
  
      clearTimeout(timeout);
      return res.data.numbers || [];
    } catch (err) {
      console.warn(`Error fetching numbers for ${type}:`, err.message);
      return [];
    }
  };

const calculateAverage = (arr) => {
  if (arr.length === 0) return 0;
  const sum = arr.reduce((a, b) => a + b, 0);
  return parseFloat((sum / arr.length).toFixed(2));
};

app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;
  const url = apiMap[numberid];

  if (!url) {
    return res.status(400).json({ error: 'Invalid number ID' });
  }

  const prevWindow = [...windowState];
  const newNumbers = await fetchNumbers(numberid);


  const uniqueNew = newNumbers.filter((num) => !windowState.includes(num));
  windowState.push(...uniqueNew);


  if (windowState.length > WINDOW_SIZE) {
    windowState = windowState.slice(windowState.length - WINDOW_SIZE);
  }

  res.json({
    windowPrevState: prevWindow,
    windowCurrState: windowState,
    numbers: uniqueNew,
    avg: calculateAverage(windowState)
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
