import SubscriptionInfo from "./subscripton-info";

class MetamaskHandler extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      installed: false,
      loaded: false
    };

    componentDidMount() {
      window.addEventListener('load', function() {

        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof web3 !== 'undefined') {
          {this.approvedInstall}
          // Use the browser's ethereum provider
          var provider = web3.currentProvider
        } else {
          console.log('No web3? You should consider trying MetaMask!')
          web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8080"));
        }
      })
    }

    componentWillUnmount() {
      window.removeEventListener('load', function() {
      }
    }
  }

  approvedInstall () {
    this.setState ({
      installed: true,
      loaded: true
    }); 
  }

  render() {
    return (
      <SubscriptionInfo loaded={this.state.loaded}/>
    );
  }
};

export default MetamaskHandler;