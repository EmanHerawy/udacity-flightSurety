import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';


let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
const flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);

(async () => {

  let accounts = await web3.eth.getAccounts();
//   let fee = await flightSuretyApp.methods.REGISTRATION_FEE.call();
// console.log(fee,'fee');

  const startIndex = 11;
  const maxNumber = 31;

  // Register 20 oracles
  for (let i = startIndex; i < maxNumber; i++) {
    console.log(accounts[i],'is registered as new oracle');
    
 const tx=   await flightSuretyApp.methods.registerOracle().send({from: accounts[i], value: web3.utils.toWei("1", "ether"), gas: 1999348});
console.log(i,'tx');
  
}

   flightSuretyApp.events.OracleRequest({ fromBlock: 0 }, async function (error, event) {
    if (error) console.log(error)
    console.log({index: event.returnValues.index});
    const correctIndex = event.returnValues.index;
    const airline = event.returnValues.airline;
    const flight = event.returnValues.flight;
    const timestamp = event.returnValues.timestamp;
    const flightStatusCode = [0, 10, 20, 30, 40, 50];
    for (let i = startIndex; i < maxNumber; i++) {
      const oracleregisteredIndex = await flightSuretyApp.methods.getMyIndexes().call({from: accounts[i]});
      for (let j = 0; j < 3; j++) {
        if (oracleregisteredIndex[j] == correctIndex) {
          console.log("INDEX MATCH FOUND");
          const randomIndex = Math.floor(Math.random() * 6);
          const oraclStatusCode = flightStatusCode[randomIndex];
          console.log( {flightStatus: oraclStatusCode});
          console.log(await flightSuretyApp.methods.submitOracleResponse(oracleregisteredIndex[j], airline, flight, timestamp, oraclStatusCode).send({from: accounts[i]}));
        }
      }
    }
  });

})();

const app = express();
app.get('/api', (req, res) => {
  res.send({
    message: 'An API for use with your Dapp!'
  })
})

export default app;

