const SHA256 = require('crypto-js/sha256');

const address = 'address';

const blockchain_url = 'http://localhost:8080/mine/' + address;

let response_status = 0;
let nonce = 0;

(async () => {
  const start_time = Date.now();

  console.log('[' + new Date().toISOString() + '] Starting to mine block...');

  while (response_status !== 200) {
    const hash = SHA256(nonce).toString();

    const res = await fetch(blockchain_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guess_hash: hash }),
    });

    response_status = res.status;

    if (response_status === 200) {
      const data = await res.json();
      console.log('Success:', data);
    }

    ++nonce;
  }

  const end_time = Date.now();

  console.log('[' + new Date().toISOString() + '] Block mined!');

  const elapsed_time = end_time - start_time;

  const seconds = Math.floor((elapsed_time / 1000) % 60);
  const minutes = Math.floor((elapsed_time / (1000 * 60)) % 60);
  const hours = Math.floor((elapsed_time / (1000 * 60 * 60)) % 24);

  const elapsed_str = hours + 'h, ' + minutes + 'm, ' + seconds + 's';

  console.log('[' + new Date().toISOString() + '] Total time: ' + elapsed_str);
})();
