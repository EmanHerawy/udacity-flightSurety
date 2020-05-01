import Web3 from "web3";
import FlightSuretyAppService from '../../service/FlightSuretyApp.js';
import FlightSuretyDataService from '../../service/FlightSuretyData.js';

import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';
import Config from './config.json';
const App = {
    web3: null,
    tableData: [],
    account: null,
    appContractService: null,
    dataContractService: null,

    start: async function () {
        const {
            web3
        } = this;

        try {
            // get contract instance
            this.appContractService = new FlightSuretyAppService();
            this.dataContractService = new FlightSuretyDataService();


            // get accounts
            const accounts = await web3.eth.getAccounts();
            this.account = accounts[1];
console.log(this.account,'this.account');

            this.refreshData();
        } catch (error) {
            console.error("Could not connect to contract or chain.");
        }
    },

    refreshData: async function () {
        let result = null;
        const isOperational = await this.appContractService.isOperational();
  
        const getPassangerPayouts = await this.dataContractService.getPassangerPayouts(this.account);
         let account = document.getElementById("account");
         let credit = document.getElementById("credit");
         credit.innerHTML= getPassangerPayouts;
         let status = document.getElementById("status");
         const isNewAirline = await this.dataContractService.isNewAirline(this.account);
         if(!isNewAirline){
           
            const isAirline = await this.dataContractService.isAirline(this.account);
            if(isAirline){
                status.innerHTML= "Approved airline";

            }else{
                const isInVotingPhase = await this.dataContractService.isInVotingPhase(this.account);
                if(isInFundingPhase){
                    status.innerHTML= "In Voting Phase";

                }else{
                    const isInFundingPhase = await this.dataContractService.isInFundingPhase(this.account);
                    if(isInFundingPhase){
                        status.innerHTML= "In Funding Phase";

                    }

                }
            }
         }else{
            status.innerHTML= "not registered as airline";

         }
        account.innerHTML= this.account;
        this.display('Operational Status', 'Check if contract is operational', [{
            label: 'Operational Status',
            error: null,
            value: isOperational
        }]);
        // get the first 3 flights 
        const key1 = await this.appContractService.flightKeys(0);
        const key2 = await this.appContractService.flightKeys(1);
        const key3 = await this.appContractService.flightKeys(2);
        let flight1 = await this.appContractService.flights(key1)
        let flight2 = await this.appContractService.flights(key2)
        let flight3 = await this.appContractService.flights(key3)
        flight1. flight=key1;
        flight2. flight=key2;
        flight3. flight=key3;

        this. tableData = [flight1,flight2,flight3];

        console.log(this.tableData, 'tableData');

        this.displyTableData(this.tableData);

        let contract = new Contract('localhost', () => {

            // User-submitted transaction
            DOM.elid('submit-oracle').addEventListener('click', () => {
                let flight = DOM.elid('flight-number').value;
                // Write transaction
                contract.fetchFlightStatus(flight, (error, result) => {
                    this.display('Oracles', 'Trigger oracles', [{
                        label: 'Fetch Flight Status',
                        error: error,
                        value: result.flight + ' ' + result.timestamp
                    }]);
                });
            })

        });

        // const balanceElement = document.getElementsByClassName("balance")[0];
        // balanceElement.innerHTML = balance;
    },

    //   sendCoin: async function() {
    //     const amount = parseInt(document.getElementById("amount").value);
    //     const receiver = document.getElementById("receiver").value;

    //     this.setStatus("Initiating transaction... (please wait)");

    //     const { sendCoin } = this.meta.methods;
    //     await sendCoin(receiver, amount).send({ from: this.account });

    //     this.setStatus("Transaction complete!");
    //     this.refreshData();
    //   },
    register: async function () {
        const newAirline = document.getElementById("reg-Airline").value;
        console.log(newAirline,'newAirline');
        
        const tx = await this.appContractService.registerAirline(newAirline,this.account,1999348);

    },
    buy: async function (index) {
        console.log(index,'index');
     
        console.log(this.tableData[index-1].airline,this.tableData[index-1].flight);
        
        const tx = await this.dataContractService.buy(this.tableData[index-1].airline,this.tableData[index-1].flight,this.account,1999348);

    },
    pay: async function () {
        
        // buy(airline,flight,_from,_gas)
        const tx = await this.dataContractService.pay(this.account,1999348);

    },
    getPassangerInsuranceBalance: async function () {
        const airline = document.getElementById("passanger-airline").value;
        console.log(airline,'newAirline');
        // buy(airline,flight,_from,_gas)
        const balance = await this.dataContractService.getPassangerInsuranceBalance(this.account,airline);
        const passanger = document.getElementById("passanger");
        passanger.innerHTML = balance;
    },
    fund: async function () {
        
        // buy(airline,flight,_from,_gas)
        const tx = await this.dataContractService.fund(this.account,1999348);

    },

    setStatus: function (message) {
        const status = document.getElementById("status");
        status.innerHTML = message;
    },
    display: function (title, description, results) {
        let displayDiv = DOM.elid("display-wrapper");
        let section = DOM.section();
        section.appendChild(DOM.h2(title));
        section.appendChild(DOM.h5(description));
        results.map((result) => {
            let row = section.appendChild(DOM.div({
                className: 'row'
            }));
            row.appendChild(DOM.div({
                className: 'col-sm-4 field'
            }, result.label));
            row.appendChild(DOM.div({
                className: 'col-sm-8 field-value'
            }, result.error ? String(result.error) : String(result.value)));
            section.appendChild(row);
        })
        displayDiv.append(section);

    },
    displyTableData: function (data) {
        // Find a <table> element with id="myTable":
        const table = document.getElementById("myTable");
        console.log(table, 'table');

        // Create an empty <tr> element and add it to the 1st position of the table:
        let index = 1;
        data.forEach(item => {

            const row = table.insertRow(index);

            // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);

               // Add some text to the new cells:
            //    cell1.innerHTML =` <label id="airline-${index}">${item.airline}</label> `;
            //    cell2.innerHTML = ` <label id="flight-${index}">${item.flight}</label>  `;
                cell1.innerHTML =` <label id="airline-${index}">${item.airline.substring(0,4)}...${item.airline.substring(item.airline.length-5)}</label> `;
               cell2.innerHTML = ` <label id="flight-${index}">${item.flight.substring(0,4)}...${item.flight.substring(item.flight.length-5)}</label>  `;
               cell3.innerHTML = item.updatedTimestamp;
               cell4.innerHTML = `<button  onclick="App.buy(${index})" class="btn " id="flight${index}" >Buy insurance</button>`;
               index++;
        });
    }
};

window.App = App;

window.addEventListener("load", function () {
    if (window.ethereum) {
        // use MetaMask's provider
        App.web3 = new Web3(window.ethereum);
        window.ethereum.enable(); // get permission to access accounts
    } else {
        console.warn(
            "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
        );
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        App.web3 = new Web3(
            new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
        );
    }
    // disable metamsk
    // App.web3 = new Web3(
    //     new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    // );
    App.start();
});