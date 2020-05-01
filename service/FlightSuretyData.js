
import web3 from 'web3';
import contract from 'truffle-contract';

import contractArtifact from '../build/contracts/FlightSuretyData.json';
const fundAmount = web3.utils.toWei("10", "ether");
const insuranceAmount = web3.utils.toWei("1", "ether");

export default class FlightSuretyDataService{

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


  async isAirline(airline){

        const instance = await this.service.deployed(); 

        const data = await instance.isAirline.call(airline);

       return data;

}
  async insurance(masterKey,Key){

        const instance = await this.service.deployed(); 

        const data = await instance.insurance.call(masterKey,Key);

       return data;

}
  async isInVotingPhase(airline){

        const instance = await this.service.deployed(); 

        const data = await instance.isInVotingPhase.call(airline);

       return data;

}
  async index(){

        const instance = await this.service.deployed(); 

        const data = await instance.index.call();

       return data.toNumber();

}
  async isNewAirline(airline){

        const instance = await this.service.deployed(); 

        const data = await instance.isNewAirline.call(airline);

       return data;

}
  async StakAmount(){

        const instance = await this.service.deployed(); 

        const data = await instance.StakAmount.call();

       return data.toNumber();

}
  async airlineQueue(Key){

        const instance = await this.service.deployed(); 

        const data = await instance.airlineQueue.call(Key);

       return data;

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
  async isInFundingPhase(airline){

        const instance = await this.service.deployed(); 

        const data = await instance.isInFundingPhase.call(airline);

       return data;

}
  async queueCount(){

        const instance = await this.service.deployed(); 

        const data = await instance.queueCount.call();

       return data.toNumber();

}
  async register(airline,earlyAddaptor,_from,_gas){    
        const instance = await this.service.deployed();
        const data = await  instance. register(airline,earlyAddaptor,{ from:_from, gas: _gas  });  

        return data;
 
 
 }
  async isNotDuplicateVoter(voter,airline){

        const instance = await this.service.deployed(); 

        const data = await instance.isNotDuplicateVoter.call(voter,airline);

       return data;

}
  async transferOwnership(_newOwner,_from,_gas){    
        const instance = await this.service.deployed();
        const data = await  instance. transferOwnership(_newOwner,{ from:_from, gas: _gas  });  

        return data;
 
 
 }
  async airlineVote(airline,status,_from,_gas){    
        const instance = await this.service.deployed();
        const data = await  instance. airlineVote(airline,status,{ from:_from, gas: _gas  });  

        return data;
 
 
 }
  async getPassangerInsuranceBalance(passanger,airline){

        const instance = await this.service.deployed(); 

        let data = await instance.getPassangerInsuranceBalance.call(passanger,airline);
        console.log(data[0],'data[0]');
        console.log(web3.utils.toBN(data),'web3.utils.toBN(data)');
        
       return         web3.utils.fromWei(web3.utils.toBN(data), "ether");


}
  async getPassangerInsurance(passanger,airline){

        const instance = await this.service.deployed(); 

        const data = await instance.getPassangerInsurance.call(passanger,airline);

       return data;

}
  async getPassangerPayouts(passanger){

        const instance = await this.service.deployed(); 

        const data = await instance.getPassangerPayouts.call(passanger);

       return data.toNumber();

}
  async getAirlineBalances(airline){

        const instance = await this.service.deployed(); 

        const data = await instance.getAirlineBalances.call(airline);

       return data.toNumber();

}
  async isOperational(){

        const instance = await this.service.deployed(); 

        const data = await instance.isOperational.call();

       return data;

}
  async setOperatingStatus(mode,_from,_gas){    
        const instance = await this.service.deployed();
        const data = await  instance. setOperatingStatus(mode,{ from:_from, gas: _gas  });  

        return data;
 
 
 }
  async setAppContract(appContract,_from,_gas){    
        const instance = await this.service.deployed();
        const data = await  instance. setAppContract(appContract,{ from:_from, gas: _gas  });  

        return data;
 
 
 }
  async getAppContract(){

        const instance = await this.service.deployed(); 

        const data = await instance.getAppContract.call();

       return data;

}
  async getThreshold(){

        const instance = await this.service.deployed(); 

        const data = await instance.getThreshold.call();

       return data.toNumber();

}
  async setThreshold(threshold,_from,_gas){    
        const instance = await this.service.deployed();
        const data = await  instance. setThreshold(threshold,{ from:_from, gas: _gas  });  

        return data;
 
 
 }
  async registerAirline(airline,caller,_from,_gas){    
        const instance = await this.service.deployed();
        const data = await  instance. registerAirline(airline,caller,{ from:_from, gas: _gas  });  

        return data;
 
 
 }
  async buy(airline,flight,_from,_gas){    
        const instance = await this.service.deployed();
        const data = await  instance. buy(airline,flight,{ from:_from, gas: _gas ,value: insuranceAmount});  

        return data;
 
 
 }
  async creditInsurees(airline,flight,_from,_gas){    
        const instance = await this.service.deployed();
        const data = await  instance. creditInsurees(airline,flight,{ from:_from, gas: _gas  });  

        return data;
 
 
 }
  async getCreditAmount(passanger,airline){

        const instance = await this.service.deployed(); 

        const data = await instance.getCreditAmount.call(passanger,airline);

       return data.toNumber();

}
  async pay(_from,_gas){    
        const instance = await this.service.deployed();
        const data = await  instance. pay({ from:_from, gas: _gas  });  

        return data;
 
 
 }
  async fund(_from,_gas){    
        const instance = await this.service.deployed();
        const data = await  instance. fund({ from:_from, gas: _gas ,value: fundAmount});  

        return data;
 
 
 }

}