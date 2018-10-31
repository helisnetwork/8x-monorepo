import bus from '../bus';
import { MockTokenAbi, ConfigAddresses } from '@8xprotocol/artifacts';
import { getToken } from '../constants';

export default class UserStore {
  constructor(){

    this.startListening();
    this.listenUserActivity();
  }

  startListening() {
    bus.on('web3:initialised', (web3) => {
      this.web3 = web3;

      bus.trigger('user:get:account:status', this.web3); 
          
      this.getERC20Balance();
      this.getETHBalance();
      this.sendUserAddress(); 
    
    });
  }

  listenUserActivity() {
    bus.on('user:get:account:status', (web3) => {

      web3.eth.getAccounts((err, accounts) => {
      if(err != null) {
        bus.trigger('status', 'error'); 

        } else if (accounts.length === 0) {
          bus.trigger('status', 'locked');

        } else {

          web3.version.getNetwork((err, netId) => {
            if(netId === '42') {
              this.address = accounts[0];
              bus.trigger('user:address:requested');
              bus.trigger('status', 'unlocked');
              bus.trigger('ERC20:balance:requested');
              bus.trigger('ETH:balance:requested');

            } else {
              bus.trigger('status', 'wrong network');
            }
          });
        }
      });
    });
  }

  sendUserAddress() {
    bus.on('user:address:requested', () => {
      bus.trigger('user:address:sent', this.address);
    });

  }

  getERC20Balance() {
    bus.on('ERC20:balance:requested', () => {
      var token = this.web3.eth.contract(MockTokenAbi.abi).at(getToken('DAI'));

      token.balanceOf.call(this.address,  (err, bal) => {
        if (err) {
        }

        const divideBalance = bal/Math.pow(10,18);

        bus.trigger('ERC20:balance:sent', divideBalance); 
      });
    });
  }

  getETHBalance() {    
    bus.on('ETH:balance:requested', () => {
      this.web3.eth.getBalance(this.address, (err, result) => {
        if (!err) {
          const bal = web3.fromWei(result, 'ether').toNumber();
          bus.trigger('ETH:balance:sent', bal);

        } else {
          console.log('error retrieving ETH balance');
        }
      });
    });
  }
};