class MetamaskHandler extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      installed: false,
      loaded: false
    }
  }

  approvedInstall () {
    this.setState ({
      installed: true,
      loaded: true
    }); 
  }
 
  window.addEventListener('load', function() {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      {this.approvedInstall}
      // Use the browser's ethereum provider
      var provider = web3.currentProvider
    } else {
      console.log('No web3? You should consider trying MetaMask!')
    }
  })

   

  
}

export default MetamaskHandler; 