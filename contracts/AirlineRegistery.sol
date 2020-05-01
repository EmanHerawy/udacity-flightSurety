pragma solidity ^0.4.25;
import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract AirlineRegistery{
        using SafeMath for uint256; // Allow SafeMath functions to be called for all uint256 types (similar to "prototype" in Javascript)

    uint256 public queueCount;
    struct vote{
        uint256 index;
        bool status;
    
    }
    struct airlineData{
        uint256 indexInQueue;
        RegisterationStatus status;
        uint256 votesUpCount;
        uint256 votesDownCount;
    }
            
    mapping (address=>mapping (address=>vote))  voters;
    mapping (address => airlineData) public airlineQueue;
    uint256  public constant StakAmount = 10 ether;
    enum RegisterationStatus {VotingPhase, FundingPahse,Active,Rejected }

event AirlineInFundingPhase(address airline,uint256 votesUpCount, uint256 votesDownCount,uint256 timestamp);
event AirlineActivated(address airline,uint256 timestamp);
event AirlineRejestered(address airline,uint256 timestamp);
event AirlineRejected(address airline,uint256 votesUpCount, uint256 votesDownCount,uint256 timestamp);
modifier notDuplicateVoter(address airline) {
    require(isNotDuplicateVoter(msg.sender,airline),"you can't vote more than once");
    _;
}
modifier inVotingPhase(address airline) {
    require(isInVotingPhase(airline),"Voting is no longer available ");
    _;
}
modifier inFundingPhase(address airline) {
    require(isInFundingPhase(airline),"funding is no longer available ");
    _;
}
modifier onlyAirLine(address caller) {
    require(isAirline(caller),"Only approved Airline can vote");
    _;
}
modifier newAirLine(address airline) {
    require(isNewAirline(airline),"Only new Airline can register");
    _;
}
modifier enoughFund() {
    require(msg.value>=StakAmount,"not enough stake amount");
    _;
}

// register 
// vote up or down 
// 

function airlineVote(address airline,bool status) public onlyAirLine(msg.sender)  inVotingPhase(airline) notDuplicateVoter(airline) returns(bool){
  
    uint256  voteIndex= airlineQueue[airline].votesUpCount.add(airlineQueue[airline].votesDownCount).add(1);
    voters[airline][msg.sender]=vote(voteIndex,status);
      if(status){
        airlineQueue[airline].votesUpCount=airlineQueue[airline].votesUpCount.add(1);
        if(queueCount.div(2)<=airlineQueue[airline].votesUpCount){
          airlineQueue[airline].status=  RegisterationStatus.FundingPahse;
          emit AirlineInFundingPhase( airline, airlineQueue[airline].votesUpCount,  airlineQueue[airline].votesDownCount, now);
        }
    }else{
        airlineQueue[airline].votesDownCount= airlineQueue[airline].votesDownCount.add(1);
           if(queueCount.div(2)<=airlineQueue[airline].votesDownCount){
          airlineQueue[airline].status=  RegisterationStatus.Rejected;
         emit AirlineRejected( airline, airlineQueue[airline].votesUpCount,  airlineQueue[airline].votesDownCount, now);
        }
    }
    return true;
}
function stake(address airline) internal  inFundingPhase(airline)  enoughFund() returns (bool) {
    airlineQueue[airline].status=RegisterationStatus.Active;
return true;
    
}
function register(address airline,bool earlyAddaptor) public newAirLine(airline) returns (bool) {
    queueCount= queueCount.add(1);
    if(earlyAddaptor){
         airlineQueue[airline]=airlineData(queueCount,
        RegisterationStatus.FundingPahse,
    0,0);
     }else{
          airlineQueue[airline]=airlineData(queueCount,
        RegisterationStatus.VotingPhase,
        0,0);
     }
  
    
    return true;
}
function isAirline(address airline) public view returns(bool) {
    return airlineQueue[airline].status==RegisterationStatus.Active;
}
function isNewAirline(address airline) public view returns(bool) {
    return airlineQueue[airline].indexInQueue==0;
}
function isInVotingPhase(address airline) public view returns(bool) {
    return airlineQueue[airline].status==RegisterationStatus.VotingPhase;
    
}
function isInFundingPhase(address airline) public view returns(bool) {
    return airlineQueue[airline].status==RegisterationStatus.FundingPahse;
    
}
function isNotDuplicateVoter(address voter,address airline) public view returns(bool) {
    return voters[airline][voter].index==0;
    
}

}