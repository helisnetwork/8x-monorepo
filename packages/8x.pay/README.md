# 8x Protocol

## What is it?

8x protocol is a way to enable decentralised recurring payments on the Ethereum
blockchain. You can read more about it at: https://github.com/8x-protocol/whitepaper.

This repo is for the payment gateway that merchnts will use.

## Contributing

To contribute, fork this repo, create a new branch, and submit a PR with your
changes.

### Running Locally
```
npm install
npm start
```

### Code Style
- Strip trailing whitespace
- 2 soft indent(spaces)
- 80 char line limit
- semi-colons
- alphabetize all things

### Method Organization
Our components are organized in order of life-cycle events. Functions are
ordered alphabetically. We recommend using an add-on for your editor for sorting
if available.

```javascript
React.createClass({
  displayName : '',
  propTypes: {},
  getInitialState : function() {},
  componentWillMount : function() {},
  componentWillUnmount : function() {},
  render : function() {}
});
```

### Self Closing Tags
Components without childrens should be self closed.

```
<Example />
```

### Formatting Attributes
Indent attributes for elements as shown below

```
<input
  type="text"
  value={this.props.example} />
```
