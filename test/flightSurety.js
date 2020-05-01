var Test = require('../config/testConfig.js');
 
contract('Flight Surety Tests', async (accounts) => {
    const fundAmount = web3.utils.toWei("10", "ether");
    let flights = [];
    var config;
    before('setup contract', async () => {
        config = await Test.Config(accounts);
        await config.flightSuretyData.setAppContract(config.flightSuretyApp.address);
        // await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
        flights = [{
            airline: config.testAddresses[0],
            flight: "Osaka-NYC",
            timestamp: Math.floor(Date.now() / 1000)
        }, {
            airline: config.testAddresses[0],
            flight: "Cairo-NYC",
            timestamp: Math.floor(Date.now() / 1000)
        }, {
            airline: config.testAddresses[1],
            flight: "Alex-Aswan",
            timestamp: Math.floor(Date.now() / 1000)
        }];
    });


    /****************************************************************************************/
    /* Operations and Settings                                                              */
    /****************************************************************************************/

    it(`(multiparty) has correct initial isOperational() value`, async function () {

        // Get operating status
        let status = await config.flightSuretyData.isOperational.call();
        assert.equal(status, true, "Incorrect initial operating status value");

    });

    it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

        // Ensure that access is denied for non-Contract Owner account
        let accessDenied = false;
        try {
            await config.flightSuretyData.setOperatingStatus(false, {
                from: config.testAddresses[2]
            });
        } catch (e) {
            accessDenied = true;
        }
        assert.equal(accessDenied, true, "Access not restricted to Contract Owner");

    });

    it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {

        // Ensure that access is allowed for Contract Owner account
        let accessDenied = false;
        try {
            await config.flightSuretyData.setOperatingStatus(false);
        } catch (e) {
            accessDenied = true;
        }
        assert.equal(accessDenied, false, "Access not restricted to Contract Owner");

    });

    it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

        await config.flightSuretyData.setOperatingStatus(false);

        let reverted = false;
        try {
            await config.flightSurety.setTestingMode(true);
        } catch (e) {
            reverted = true;
        }
        assert.equal(reverted, true, "Access not blocked for requireIsOperational");

        // Set it back for other tests to work
        await config.flightSuretyData.setOperatingStatus(true);

    });
    /********************************** Airlines **************************************** */

    it('(firstAirline) cannot register an Airline using registerAirline() if it is not funded', async () => {

        // 
        let newAirline = accounts[2];

        // ACT
        try {
            await config.flightSuretyApp.registerAirline(newAirline, {
                from: config.firstAirline
            });
        } catch (e) {

        }
        let result = await config.flightSuretyData.isAirline.call(newAirline);

        // ASSERT
        assert.equal(result, false, "Airline should not be able to register another airline if it hasn't provided funding");

    });
    it('(firstAirline) can fund to work', async () => {

        // 

        console.log({
            from: config.firstAirline,
            value: fundAmount
        });

        // ACT
        try {
            await config.flightSuretyData.fund({
                from: config.firstAirline,
                value: fundAmount
            });

        } catch (e) {
            console.log(e, 'error');

        }
        let result = await config.flightSuretyData.isAirline.call(config.firstAirline);

        // ASSERT
        assert.equal(result, true, "Airline get activated  if it has provided funding");

    });

    it('(firstAirline) can register secondAirline using registerAirline() if it is  funded & the number of registered airline hasn not reaced the threshold ', async () => {

        // 
        let secondAirline = config.testAddresses[0];

        // ACT
        try {
            await config.flightSuretyApp.registerAirline(secondAirline, {
                from: config.firstAirline
            });
            await config.flightSuretyData.fund({
                from: secondAirline,
                value: fundAmount
            });

        } catch (e) {

        }
        let result = await config.flightSuretyData.isAirline.call(secondAirline);

        // ASSERT
        assert.equal(result, true, "Airline should  be able activated and can work in the platform ");

    });
    it('(secondAirline) can register thirdAirline using registerAirline() if it is  funded & the number of registered airline hasn not reaced the threshold ', async () => {

        // 
        let secondAirline = config.testAddresses[0];
        let thirdAirline = config.testAddresses[1];

        // ACT
        try {
            await config.flightSuretyApp.registerAirline(thirdAirline, {
                from: secondAirline
            });
            await config.flightSuretyData.fund({
                from: thirdAirline,
                value: fundAmount
            });

        } catch (e) {

        }
        let result = await config.flightSuretyData.isAirline.call(thirdAirline);

        // ASSERT
        assert.equal(result, true, "Airline should  be able activated and can work in the platform ");

    });
    it('(thirdAirline) can register forthAirline using registerAirline() if it is  funded & the number of registered airline hasn not reaced the threshold ', async () => {

        // 
        let thirdAirline = config.testAddresses[1];
        let forthAirline = config.testAddresses[2];

        // ACT
        try {
            await config.flightSuretyApp.registerAirline(forthAirline, {
                from: thirdAirline
            });
            await config.flightSuretyData.fund({
                from: forthAirline,
                value: fundAmount
            });

        } catch (e) {

        }
        let result = await config.flightSuretyData.isAirline.call(forthAirline);

        // ASSERT
        assert.equal(result, true, "forthAirline should  be able activated and can work in the platform ");

    });
    it('(forthAirline) can register fifthAirline using registerAirline() but fifthAirline can not send funds util more than 50% vote up for it ', async () => {

        // 
        let forthAirline = config.testAddresses[2];
        let fifthAirline = config.testAddresses[3];

        // ACT
        try {
            await config.flightSuretyApp.registerAirline(fifthAirline, {
                from: forthAirline
            });
            await config.flightSuretyData.fund({
                from: fifthAirline,
                value: fundAmount
            });

        } catch (e) {
            console.log('Funding has failed');

        }
        let result = await config.flightSuretyData.isAirline.call(fifthAirline);

        // ASSERT
        assert.equal(result, false, "fifthAirline should not  be able activated and can work in the platform ");

    });


    it('Voting is made when multi-party threshold is reached for airline 5', async () => {

        let secondAirline = config.testAddresses[0];
        let thirdAirline = config.testAddresses[1];
        let forthAirline = config.testAddresses[2];
        let fifthAirline = config.testAddresses[3];


        try {

            await config.flightSuretyData.airlineVote(fifthAirline, false, {
                from: secondAirline
            });
            await config.flightSuretyData.airlineVote(fifthAirline, true, {
                from: forthAirline
            });
            await config.flightSuretyData.airlineVote(fifthAirline, true, {
                from: thirdAirline
            });
            // Try send fund.
            await config.flightSuretyData.fund({
                from: fifthAirline,
                value: fundAmount
            });


        } catch (e) {
            console.log(e, 'ee');

        }


        let result = await config.flightSuretyData.isAirline.call(fifthAirline);

        // ASSERT
        assert.equal(result, true, "forthAirline should  be able activated and can work in the platform ");

    });

    it('(fifthAirline) can register Airline6 using registerAirline() but Airline6 can not send funds util more than 50% vote up for it ', async () => {

        // 
        let fifthAirline = config.testAddresses[3];
        let airline6 = config.testAddresses[4];

        // ACT
        try {
            await config.flightSuretyApp.registerAirline(airline6, {
                from: fifthAirline
            });
            await config.flightSuretyData.fund({
                from: airline6,
                value: fundAmount
            });

        } catch (e) {
            console.log('Funding has failed');

        }
        let result = await config.flightSuretyData.isAirline.call(airline6);

        // ASSERT
        assert.equal(result, false, "Airline6 should not  be able activated and can work in the platform ");

    });

    it('Voting is made when multi-party threshold is reached for airline 6 and they should vote against', async () => {

        let secondAirline = config.testAddresses[0];
        let thirdAirline = config.testAddresses[1];
        let forthAirline = config.testAddresses[2];
        let fifthAirline = config.testAddresses[3];
        let airline6 = config.testAddresses[4];

        try {

            await config.flightSuretyData.airlineVote(fifthAirline, false, {
                from: config.firstAirline
            });
            await config.flightSuretyData.airlineVote(fifthAirline, false, {
                from: secondAirline
            });
            await config.flightSuretyData.airlineVote(fifthAirline, true, {
                from: forthAirline
            });
            await config.flightSuretyData.airlineVote(fifthAirline, false, {
                from: thirdAirline
            });
            // Try send fund.
            await config.flightSuretyData.fund({
                from: airline6,
                value: fundAmount
            });


        } catch (e) {

        }

        let result = await config.flightSuretyData.isAirline.call(airline6);

        // ASSERT
        assert.equal(result, false, "6th airline should not be able to send fund while the majority has voted againes");
    });


    /********************************** Passengers **************************************** */
    it(' can register flights ', async () => {

        // 
    
        let amount = 1;
        let InsuredPrice = web3.utils.toWei(amount.toString(), "ether");
    
        // registerFlight
        let tx ;
        try {

            await config.flightSuretyApp.registerFlight(flights[0].airline, flights[0].flight, flights[0].timestamp)
            await config.flightSuretyApp.registerFlight(flights[1].airline, flights[1].flight, flights[1].timestamp)
             tx = await config.flightSuretyApp.registerFlight(flights[2].airline, flights[2].flight, flights[2].timestamp)
            // console.log(tx, 'txxxxx');


        } catch (e) {
            console.log(e, 'error in adding fight');

        }

        // let result = await config.flightSuretyApp.flightKeys.call(2);
        // console.log(result, 'result');

        // ASSERT
        assert.equal(true, tx.receipt.status, "tx status is true")



    });
    it('Passenger can buy flight inssurance for at most 1 ether', async () => {

  // 
  let passenger1 = accounts[5];
  let secondAirline = accounts[1];
  let thirdAirline = accounts[2];
  let amount = 1;
  let InsuredPrice = web3.utils.toWei(amount.toString(), "ether");
 
  // registerFlight
  try {

 const tx=     await config.flightSuretyData.buy(flights[0].airline,flights[0].flight, {
          from: passenger1,
          value: InsuredPrice
      });
      let result = await config.flightSuretyData.isAirline.call(flights[0].airline);

   
      

  } catch (e) {
console.log(e,'error in buy');

  }

  let result = await config.flightSuretyData.getPassangerInsuranceBalance.call(passenger1,flights[0].airline);
//   let getAirlineBalances = await config.flightSuretyData.getAirlineBalances.call(flights[0].airline);
const _result =  web3.utils.fromWei(result, "ether")

  // ASSERT
  assert.equal(_result , amount, "passanger insurance value is expected")



});


it('Insured passenger can be credited if flight is delayed', async () => {

  // 
  let passenger1 = accounts[5];

   let credit_status = true;
  let expectedCreditAfter = 1.5;
  let creditBefore = 0
  let expectedInitCredit = 0
  let creditAfter = 0
  let STATUS_CODE_LATE_AIRLINE = 20;



  try {
      // Check credit before passenger was credited
      creditBefore = await config.flightSuretyData.getPassangerPayouts.call(passenger1);
       
    //   creditBefore = web3.utils.fromWei(creditBefore, "ether")
    //   expectedInitCredit = web3.utils.fromWei(expectedInitCredit, "ether")
    //   console.log({creditBefore});

      // Credit the passenger
   const tx =   await config.flightSuretyApp.processFlightStatus(flights[0].airline, flights[0].flight, flights[0].timestamp, STATUS_CODE_LATE_AIRLINE);

// console.log({tx},'tx in credit');

      // Get credit after passenger has been credited
      creditAfter = await config.flightSuretyData.getPassangerPayouts.call(passenger1);
      let getCreditAmount = await config.flightSuretyData.getCreditAmount.call( passenger1,  flights[0].airline) 
      getCreditAmount = web3.utils.fromWei(getCreditAmount, "ether");
      creditAfter = web3.utils.fromWei(creditAfter, "ether");
    //   expectedCreditAfter = web3.utils.fromWei(expectedCreditAfter, "ether");
    //   console.log({getCreditAmount});
    //   console.log({creditAfter});


  } catch (e) {
      credit_status = false;
      console.log(e,'error in credit');
      
  }


  // ASSERT
  assert.equal(creditBefore, expectedInitCredit, "expectedInitCredit is match the current credit")
  assert.equal(expectedCreditAfter, creditAfter, "expectedCreditAfteris match the current credit")
  assert.equal(credit_status, true, "Passenger was  credited");

});

it('Passenger can withdraw any funds owed to them as a result of receiving credit for insurance payout', async () => {

  // 
  let passenger = accounts[5];

  let balance =0;
  let expectedCreditAfter = 1.5;
let tx;
  try {


   tx=    await config.flightSuretyData.pay({
          from: passenger
      });

   console.log(tx,'txxx');
   

      balance = await web3.eth.getBalance(passenger)
    //    expectedCreditAfter = web3.utils.fromWei(expectedCreditAfter, "ether");

      console.log("ETH balance after: ", balance)

      console.log("The expectedCreditAfter is ", expectedCreditAfter);

  } catch (e) {
console.log(e,'error in pay');
  }

  // ASSERT
   assert.equal(tx.receipt.status, true, "transaction is succssful")

});


});