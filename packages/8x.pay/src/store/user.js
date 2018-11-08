import bus from '../bus';
import { MockTokenAbi, ConfigAddresses } from '@8xprotocol/artifacts';
import { getToken } from '../constants';
import BigNumber from 'bignumber.js';

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
      this.listenUserConversion();
      this.sendUserAddress(); 
    
    });
  }

  listenUserConversion() {
    bus.on('conversion:requested', async () => {

      const kyberNetworkProxyInterface = '0x7e6b8b9510D71BF8EF0f893902EbB9C865eEF4Df';
      const token = '0xB2f3dD487708ca7794f633D9Df57Fdb9347a7afF'; //KNC
      const minConversionRate = new BigNumber(1);
      const srcAmount = web3.toWei(0.01, 'ether');
      

      //KyberNetworkProxy ABI from etherscan 
      var kyberNetworkProxyABI = web3.eth.contract([{"constant":false,"inputs":[{"name":"alerter","type":"address"}],"name":"removeAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"enabled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"pendingAdmin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOperators","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"destAddress","type":"address"},{"name":"maxDestAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"},{"name":"walletId","type":"address"},{"name":"hint","type":"bytes"}],"name":"tradeWithHint","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"}],"name":"swapTokenToEther","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"maxGasPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newAlerter","type":"address"}],"name":"addAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kyberNetworkContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getUserCapInWei","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"minConversionRate","type":"uint256"}],"name":"swapTokenToToken","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"transferAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"claimAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"minConversionRate","type":"uint256"}],"name":"swapEtherToToken","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"transferAdminQuickly","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAlerters","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"},{"name":"dest","type":"address"},{"name":"srcQty","type":"uint256"}],"name":"getExpectedRate","outputs":[{"name":"expectedRate","type":"uint256"},{"name":"slippageRate","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"},{"name":"token","type":"address"}],"name":"getUserCapInTokenWei","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOperator","type":"address"}],"name":"addOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_kyberNetworkContract","type":"address"}],"name":"setKyberNetworkContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"operator","type":"address"}],"name":"removeOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"field","type":"bytes32"}],"name":"info","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"srcAmount","type":"uint256"},{"name":"dest","type":"address"},{"name":"destAddress","type":"address"},{"name":"maxDestAmount","type":"uint256"},{"name":"minConversionRate","type":"uint256"},{"name":"walletId","type":"address"}],"name":"trade","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"token","type":"address"},{"name":"user","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_admin","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"trader","type":"address"},{"indexed":false,"name":"src","type":"address"},{"indexed":false,"name":"dest","type":"address"},{"indexed":false,"name":"actualSrcAmount","type":"uint256"},{"indexed":false,"name":"actualDestAmount","type":"uint256"}],"name":"ExecuteTrade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newNetworkContract","type":"address"},{"indexed":false,"name":"oldNetworkContract","type":"address"}],"name":"KyberNetworkSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"TokenWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"EtherWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"pendingAdmin","type":"address"}],"name":"TransferAdminPending","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAdmin","type":"address"},{"indexed":false,"name":"previousAdmin","type":"address"}],"name":"AdminClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAlerter","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"AlerterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOperator","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"OperatorAdded","type":"event"}]);
      //Kovan KyberNetworkProxy Contract Address 
      var kyberNetworkProxy = kyberNetworkProxyABI.at(kyberNetworkProxyInterface);

      // let transactionData = kyberNetworkProxy.swapEtherToToken(token,minConversionRate).encodeABI();

      kyberNetworkProxy.swapEtherToToken(token,minConversionRate, function (err, result) {
        if(!err) {
          const data = result.encodeABI();
          web3.eth.sendTransaction({
            from: '0xAe4F4Eae7348A2C7ea9Bc639A50208ed07A8D441',
            to: kyberNetworkProxyInterface,
            data: result,
            value: srcAmount
          }, async function (err, result) {

            if(!err) {

              let confirmation = await this.eightEx.blockchain.awaitTransactionMinedAsync(
                result
            );
            console.log(confirmation);

            } else {

            }
          });
        } else {
          console.log('err' + err);
        }
      });

      // console.log(this.address);
      // console.log(web3);
      
      // web3.eth.sendTransaction({
      //   from: this.address,
      //   to: kyberNetworkProxyInterface,
      //   data: transactionData,
      //   value: srcAmount
      // }, async function (err, result) {
      //   if(!err) {
      //     let confirmation = await eightEx.blockchain.awaitTransactionMinedAsync(
      //       result
      //    );
      //    console.log(confirmation);
      //   } else {

      //   }
      // });

     
      
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
              bus.trigger('authorization:status');
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