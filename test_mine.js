const SHA256 = require('crypto-js/sha256');

const address =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDfpEA9kIzN82SKf4XjtyEDaqX45l1HQycu+KeoHTh4jJAVku2sO4Iwf4s38Bx92Iqz+DfdOsV/77gsnvYGeIePRW/ygotETONWHRy/A31VlnMJYSFBtEh3bWFJfN/vQVyqg5wYVAiWNgsOcX/JKJwZCaT2YkRgEmJecvo/3BxGkwIDAQAB';

const blockchain_url =
  'http://localhost:8080/mine/' + encodeURIComponent(address);

let nonce = 0;

(async () => {
  const start_time = Date.now();

  console.log('[' + new Date().toISOString() + '] Starting to mine block...');

  let res_status = 0;
  while (res_status !== 200) {
    const hash = SHA256(nonce).toString();

    const res = await fetch(blockchain_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guess_hash: hash }),
    });

    res_status = res.status;

    if (res_status === 200) {
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
