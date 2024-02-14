const { exec } = require('node:child_process');
const dns = require('node:dns');

// use docker swarm service discovery
dns.resolve (process.env.AIOZ_WORKER_ENDPOINT, (error, records) => {
  if (error) {
    console.error (`${(new Date ()).toISOString ()}  dns resolve error: ${error}`);
    return;
  }
  console.debug (`${(new Date ()).toISOString ()}  found ${records.length} tasks`);
  // iterate over each service task
  for (let ipAddress of records) {
    // check the balance
    exec (`aioznode reward balance --endpoint "http://${ipAddress}:${process.env.AIOZ_LISTENER_PORT}"`, (error, stdout, stderr) => {
      if (error) {
        console.error (`${(new Date ()).toISOString ()}  error checking balance on ${ipAddress}: ${error}`);
        return;
      }
      let balance = JSON.parse (stdout).balance;
      // check for balance validity (can be an empty array)
      if (balance && balance[0] && balance[0].amount) {
        // parse string as BigInt
        balance = BigInt (balance[0].amount); // attoaioz
        // proceed if balance meets the minimum withrawal minimum plus gas
        if (balance > BigInt (process.env.AIOZ_MINIMUM_WITHDRAWAL) + BigInt (process.env.AIOZ_GAS_LIMIT)) {
          // leave some left for gas (may or may not be necessary)
          let withdrawalAmount = balance - BigInt (process.env.AIOZ_GAS_LIMIT);
          // execute the withdrawal on the task
          exec (`aioznode reward withdraw --endpoint "http://${ipAddress}:${process.env.AIOZ_LISTENER_PORT}" --priv-key-file /root/.aiozworker/privkey.json  --amount ${withdrawalAmount.toString ()}attoaioz --address ${process.env.AIOZ_WITHDRAW_ADDRESS}`, (error, stdout, stderr) => {
            if (error) {
              console.error (`${(new Date ()).toISOString ()}  withdrawal error on ${ipAddress}: ${error}`);
              return;
            }
            console.log (`${(new Date ()).toISOString ()}  successfully withdrew ${withdrawalAmount.toString ()} attoaioz from ${ipAddress}`);
            console.debug (`${(new Date ()).toISOString ()}  txid: ${JSON.parse (stdout).txid}`);
          });
        }
        else {
          console.debug (`${(new Date ()).toISOString ()}  ${ipAddress} balance ${balance.toString ()} does not meet withdrawal minimum`);
        }
      } else {
        console.debug (`${(new Date ()).toISOString ()}  ${ipAddress} has no balance`);
      }
    });
  }
});
