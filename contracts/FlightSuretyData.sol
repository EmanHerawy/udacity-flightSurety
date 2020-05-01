pragma solidity ^0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import './AirlineRegistery.sol';
contract FlightSuretyData is Ownable ,AirlineRegistery {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    // address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false
    uint8 private _threshold = 4;
    address private _appContract;
    uint public index; 
    struct flightInsurance{
        string flight;
        uint256 amount;

    }
    // airline          passanger       flightInsurance
  mapping (address => mapping (address => flightInsurance)) public insurance;
  //      flight to array of passangers
  mapping(string => address[]) internal flightPassangers;
  mapping(address => uint256) internal payouts;
  mapping(address => uint256) internal AirlineBalances;

event PassangerBuyFlightInusrance(address airline, string flight, address passanger, uint256 amount);
    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/


    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor
                                ( address firstAirline
                                ) 
                                public 
    {
        // contractOwner = msg.sender;
        _registerAirline(firstAirline,true);
    }
    function getPassangerInsuranceBalance(address passanger, address airline) public view returns (  uint256 amount ) {
            
            amount=insurance[airline][passanger].amount;
            return (  amount);
        }
    function getPassangerInsurance(address passanger, address airline) public view returns ( string flight,uint256 amount ) {
            flight=insurance[airline][passanger].flight;
            amount=insurance[airline][passanger].amount;
            return (flight, amount);
        }
        function getPassangerPayouts(address passanger) public view returns ( uint256 ) {
            return ( payouts[passanger]);
        }
        function getAirlineBalances(address airline) public view returns ( uint256 ) {
            return ( AirlineBalances[airline]);
        }
    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() 
    {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }
    modifier authorizedCaller() {
        require(msg.sender==_appContract,"Can only be called from FlightSuretyApp contract ");
        _;
    }
    // /**
    // * @dev Modifier that requires the "ContractOwner" account to be the function caller
    // */
    // modifier requireContractOwner()
    // {
    //     require(msg.sender == contractOwner, "Caller is not contract owner");
    //     _;
    // }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() 
                            public 
                            view 
                            returns(bool) 
    {
        return operational;
    }


    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setOperatingStatus
                            (
                                bool mode
                            ) 
                            external
                            onlyOwner() 
    {
        operational = mode;
    }
    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setAppContract
                            (
                                address appContract
                            ) 
                            public
                            onlyOwner() 
    {
        _appContract = appContract;
    }
   
      /**
    * @dev Get _appContract address
    *
    * @return A address of _appContract
    */      
    function getAppContract() 
                            public 
                            view 
                            returns(address) 
    {
        return _appContract;
    } 
      /**
    * @dev Get thresholdof contract
    *
    * @return A uint8 numeric value
    */      
    function getThreshold() 
                            public 
                            view 
                            returns(uint8) 
    {
        return _threshold;
    } 
       /**
    * @dev Sets contract threshold
    *
    *
    */ 
    function setThreshold
                            (
                                uint8 threshold
                            ) 
                            external
                            onlyOwner() 
    {
        _threshold = threshold;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */   
    function registerAirline
                            (  
                                address airline,
                                address caller
                             )
                            external
                            authorizedCaller()
                            onlyAirLine(caller)   
                               returns(bool)
                            
    {
        if(queueCount<_threshold){
       _registerAirline( airline,true);

        }else{
          _registerAirline( airline,false);
        }
return true;
    }
    function _registerAirline
                            (  
                                address airline,
                                bool status
                             )
                            private
                             
                               returns(bool)
                            
    {
        super.register( airline,status);

      
return true;
    }


   /**
    * @dev Buy insurance for a flight
    *
    */   
    function buy
                            (  address  airline ,
                                string flight                          
                            )
                            external
                            payable
                            requireIsOperational()
    {
        require(isAirline(airline),"only approved airline can work");
        uint256 price=msg.value;
        require(price> 0 ether && price<= 1 ether , " invalid insurance value");
        insurance[airline][msg.sender]=flightInsurance(flight,price);
        AirlineBalances[airline]=  AirlineBalances[airline].add(price);
        flightPassangers[flight].push(msg.sender);
        emit PassangerBuyFlightInusrance(  airline,   flight, msg.sender, price);

    }

    /**
     *  @dev Credits payouts to insurees
    */
    function creditInsurees
                                (
                                    address airline,
                                      string   flight
                                )
                                external
                                requireIsOperational()
    {
        for (uint  index = 0; index < flightPassangers[flight].length; index++) {
            address passanger= flightPassangers[flight][index];
               uint256 creditamount = getCreditAmount(  passanger,   airline) ;
         require(AirlineBalances[airline]>=creditamount,"Airline doesn't have enough funds");
           AirlineBalances[airline]=AirlineBalances[airline].sub(creditamount);
                    // delete  insurance[airline][passanger];
                      payouts[passanger]= creditamount;
        }
     

    }
    
function getCreditAmount(address passanger, address airline)  public view returns(uint256){
    return(insurance[airline][passanger].amount.mul(150).div(100));
}
    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function pay
                            (
                            )
                            external
                            requireIsOperational()
    {
        require(payouts[msg.sender]>0,"no money to transfer");
        payouts[msg.sender]=0;
         msg.sender.transfer(payouts[msg.sender]);
    }

   /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */   
    function fund
                            (   
                                
                            )
                            public
                            payable
                            requireIsOperational()
    {
        super.stake(msg.sender);
                   AirlineBalances[msg.sender]=AirlineBalances[msg.sender].add(msg.value);

    }

    function getFlightKey
                        (
                            address airline,
                            string memory flight,
                            uint256 timestamp
                        )
                        pure
                        internal
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    /**
    * @dev Fallback function for funding smart contract.
    *
    */
    function() 
                            external 
                            payable 
    {
        fund();
    }


}

