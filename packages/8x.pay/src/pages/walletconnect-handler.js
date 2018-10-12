import Web3 from 'web3';
import WalletConnectProvider from 'walletconnect-web3-provider';

const rpcUrl = 'https://kovan.infura.io/';

class WalletConnectHandler extends React.Component{
  constructor(props){
    super(props); 
    
  }

  returnWeb3Instance() {
    const provider = new WalletConnectProvider({
      bridgeUrl: 'https://bridge.walletconnect.org',  
      dappName: '8x_Pay',                 
      rpcUrl: rpcUrl 
    }); 
    
    this.web3 = Web3(provider); 
  }

  promptScan() {

    this.web3.getAccounts().then(accounts => this.accounts = accounts);

    if (!accounts.length) {
      // Display QR Code URI => need to show this on render
      const uri = web3.currentProvider.walletconnect.uri
    
      // Listen for session status
      await  web3.currentProvider.walletconnect.listenSessionStatus()
    
      // Get Accounts Again
      accounts = await web3.eth.getAccounts()
    }
    
  }

  
};
export default WalletConnectHandler; 