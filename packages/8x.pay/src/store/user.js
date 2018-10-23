import bus from '../bus';
import { MockTokenAbi, ConfigAddresses } from '@8xprotocol/artifacts';
import { getToken } from '../constants';

export default class UserStore {
  constructor(){

    this.startListening();
  }

  startListening() {
    bus.on('web3:initialised', (web3) => {
      this.web3 = web3; 
      this.getERC20Balance();
      this.getETHBalance();
      web3.eth.getAccounts((err, accounts) => {
        if (err != null) {
          bus.trigger('status', 'error'); 
        } else if (accounts.length === 0) {
          bus.trigger('status', 'locked');
        } else {
          this.address = accounts; 
          bus.trigger('status', 'unlocked', this.address);
          
        }
      });
    });
  }

  getERC20Balance() {
    bus.on('ERC20:balance:requested', () => {
      var token = this.web3.eth.contract(MockTokenAbi.abi).at(getToken('DAI'));

      token.balanceOf.call(this.web3.eth.accounts[0],  (err, bal) => {
        if (err) {
          console.error(err);
        }

        const divideBalance = bal/Math.pow(10,18);

        bus.trigger('ERC20:balance:sent', divideBalance); 

      });
    });
  }

  getETHBalance() {
    bus.on('ETH:balance:requested', () => {
      this.web3.eth.getBalance(this.address, (err,result) => {
        if (!err){
          var bal = web3.fromWei(result, 'ether').toNumber()
          bus.trigger('ETH:balance:sent', bal); 
        } else {
          console.log('error');
        }
      });
    });
  }
};