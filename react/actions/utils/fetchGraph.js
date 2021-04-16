export default (body = {}) => {
  return fetch('https://checkout-middleware.elektrapp.com.mx/_graphql', {
    mode: 'cors',
    method: 'POST',
    credentials: 'omit',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(body)
  }).then((r) => r.json());
};
