const FlightSuretyApp = artifacts.require("FlightSuretyApp");
const FlightSuretyData = artifacts.require("FlightSuretyData");
const fs = require('fs');

module.exports = function (deployer, network, accounts) {
    const fundAmount = web3.utils.toWei("10", "ether");

    let firstAirline = accounts[1];
    deployer.deploy(FlightSuretyData, firstAirline)
        .then(() => {
            return deployer.deploy(FlightSuretyApp, FlightSuretyData.address)
                .then(() => {
                    let config = {
                        localhost: {
                            url: 'http://localhost:8545',
                            dataAddress: FlightSuretyData.address,
                            appAddress: FlightSuretyApp.address
                        }
                    }
                    fs.writeFileSync(__dirname + '/../src/dapp/config.json', JSON.stringify(config, null, '\t'), 'utf-8');
                    fs.writeFileSync(__dirname + '/../src/server/config.json', JSON.stringify(config, null, '\t'), 'utf-8');
                }).then(async() => {
                    const instanceDataContract = await FlightSuretyData.deployed();
                    const instanceAppContract = await FlightSuretyApp.deployed();
                    console.log(instanceDataContract,'instance');
                    
                    const setAppContract =    await instanceDataContract.setAppContract(FlightSuretyApp.address);
                    const tx =    await instanceDataContract.fund({
                        from: firstAirline,
                        value: fundAmount
                    });
                    const   flights = [{
                        airline: firstAirline,
                        flight: "Osaka-NYC",
                        timestamp: Math.floor(Date.now() / 1000)
                    }, {
                        airline: firstAirline,
                        flight: "Cairo-NYC",
                        timestamp: Math.floor(Date.now() / 1000)
                    }, {
                        airline: firstAirline,
                        flight: "Alex-Aswan",
                        timestamp: Math.floor(Date.now() / 1000)
                    }];
                    await instanceAppContract.registerFlight(flights[0].airline, flights[0].flight, flights[0].timestamp)
                    await instanceAppContract.registerFlight(flights[1].airline, flights[1].flight, flights[1].timestamp)
                    await instanceAppContract.registerFlight(flights[2].airline, flights[2].flight, flights[2].timestamp)
                    // console.log(tx, 'txxxxx');
        
                })
        });
}