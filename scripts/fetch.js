const fetch = require('fetch');

const { API_URL } = process.env;

const response = fetch(API_URL).then(response => {
  return response.json().then(data => {
    return callback(null, data);
  });
});
