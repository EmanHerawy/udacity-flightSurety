
import web3 from 'web3';
import contract from 'truffle-contract';

import contractArtifact from '../build/contracts/FlightSuretyApp.json';

export default class FlightSuretyAppService{

constructor() { 

this.web3Provider = new web3.providers.HttpProvider(
'http://127.0.0.1:8545'
);

this.web3 = new web3(this.web3Provider);

this.initContract().then(s => {});

}

async initContract() {

this.service = contract(contractArtifact);

this.service.setProvider(this.web3Provider);

}


  async flights(Key){

        const instance = await this.service.deployed(); 

        const data = await instance.flights.call(Key);

       return data;

}
  async flightKeys(Key){

        const instance = await this.service.deployed(); 

        const data = await instance.flightKeys.call(Key);

       return data;

}
  async REGISTRATION_FEE(){

        const instance = await this.service.deployed(); 

        const data = await instance.REGISTRATION_FEE.call();

       return data.toNumber();

}
  async renounceOwnership(_from,_gas){    
        const instance = await this.service.deployed();
        const data = await  instance. renounceOwnership({ from:_from, gas: _gas  });  

        return data;
 
 
 }
  async owner(){

        const instance = await this.service.deployed(); 

        const data = await instance.owner.call();

       return data;

}
  async transferOwnership(_newOwner,_from,_gas){    
        const instance = await this.service.deployed();
        const data = await  instance. transferOwnership(_newOwner,{ from:_from, gas: _gas  });  

        return data;
 
 
 }
  async isOperational(){

        const instance = await this.service.deployed(); 

        const data = await instance.isOperational.call();

       return data;

}
  async registerAirline(airline,_from,_gas){    
        const instance = await this.service.deployed();
        const data = await  instance. registerAirline(airline,{ from:_from, gas: _gas  });  

        return data;
 
 
 }
  async registerFlight(airline,flight,timestamp,_from,_gas){    
        const instance = await this.service.deployed();
        const data = await  instance. registerFlight(airline,flight,timestamp,{ from:_from, gas: _gas  });  

        return data;
 
 
 }
  async processFlightStatus(airline,flight,timestamp,statusCode,_from,_gas){    
        const instance = await this.service.deployed();
        const data = await  instance. processFlightStatus(airline,flight,timestamp,statusCode,{ from:_from, gas: _gas  });  

        return data;
 
 
 }
  async fetchFlightStatus(airline,flight,timestamp,_from,_gas){    
        const instance = await this.service.deployed();
        const data = await  instance. fetchFlightStatus(airline,flight,timestamp,{ from:_from, gas: _gas  });  

        return data;
 
 
 }
  async registerOracle(_from,_gas){    
        const instance = await this.service.deployed();
        const data = await  instance. registerOracle({ from:_from, gas: _gas  });  

        return data;
 
 
 }
  async getMyIndexes(){

        const instance = await this.service.deployed(); 

        const data = await instance.getMyIndexes.call();

       return data.toNumber();

}
  async submitOracleResponse(index,airline,flight,timestamp,statusCode,_from,_gas){    
        const instance = await this.service.deployed();
        const data = await  instance. submitOracleResponse(index,airline,flight,timestamp,statusCode,{ from:_from, gas: _gas  });  

        return data;
 
 
 }

}