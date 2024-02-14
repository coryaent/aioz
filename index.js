const { exec } = require('node:child_process');
const dns = require('node:dns');

// use docker swarm service discovery
dns.resolve (`tasks.${process.env.AIOZ_WORKER_SERVICE}.`, (error, records) => {
  if (error) {
    console.error (`resolve error: ${error}`);
    return;
  }
  // iterate over each service task
  for (let ipAddress of records) {
    // check the balance
    exec (`aioznode reward balance --endpoint "http://${ipAddress}:${process.env.AIOZ_LISTENER_PORT}"`, (error, stdout, stderr) => {
      if (error) {
        console.error (`exec error: ${error}`);
        return;
      }
      let balance = JSON.parse (stdout).balance;
      // check for balance validity (can be an empty array)
      if (balance && balance[0] && balance[0].amount) {
        // parse string as BigInt
        balance = BigInt (balance[0].amount); // attoaioz
        // convert gas price to attoaioz and proceed if it meets the minimum withrawal threshold
        if (balance > BigInt (process.env.AIOZ_MINIMUM_WITHDRAWAL) + BigInt (process.env.AIOZ_GAS_LIMIT) * 10n ** 18n) {
          // leave some left for gas (may or may not be necessary)
          let withdrawAmount = balance - BigInt (process.env.AIOZ_GAS_LIMIT) * 10n ** 18n;
          // execute the withdrawal on the task
          exec (`aioznode reward withdraw --endpoint "http://${ipAddress}:${process.env.AIOZ_LISTENER_PORT}" --priv-key-file /root/.aiozworker/privkey.json  --amount ${withdrawAmount.toString ()}attoaioz --address ${process.env.AIOZ_WITHDRAW_ADDRESS}`, (error, stdout, stderr) => {
            if (error) {
              console.error (`withdraw error: ${error}`);
              return;
            }
            console.log (`successfully withdrew ${balance.toString ()} attoaioz`);
            console.debug (`txid: ${JSON.parse (stdout).txid}`);
          });
        }
        else {
          console.debug (`balance ${balance.toString ()} does not meet withdraw threshold`);
        }
      }
    });
  }
});
