var Web3 = require('web3');
var web3 = new Web3('ws://127.0.0.1:8545');

const Executor = require('./ABIs/executor.json');
const Events = require('./store/events.js');
const Processor = require('./services/processor.js');
const signTransaction = require('./helpers/signer.js');

var events;
var contract;
var processor;

function onStart() {
  let privateKey = process.argv[3];
  let serviceNodeAccount = web3.eth.accounts.privateKeyToAccount(`0x${privateKey}`);;

  this.address = `${process.argv[2]}`;
  this.contract = new web3.eth.Contract(Executor.abi, this.address);

  this.processor = new Processor(web3, this.contract, this.address, privateKey);

  this.events = new Events(this.address, this.contract);
  this.events.startListening();

  let parent = this;
  setInterval(() => {
    parent.processor.processTransactions(parent.events.store);
  }, 1000);
}

onStart();

