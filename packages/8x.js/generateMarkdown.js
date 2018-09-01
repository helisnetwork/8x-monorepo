var fs = require('fs');

var json = JSON.parse(fs.readFileSync('./docs.json', 'utf8'));
json = JSON.parse(JSON.stringify(json).replace(/\\n/g, ''));

var dedent = require('dedent-js');

let classes = json.children.filter((object) => {
  return object.children[0].kindString == 'Class';
}).map((object) => {
  return object.children[0];
}).map((object) => {
  let comment = object.comment || {'name': '', 'shortText' : ''};
  return {
    'name': object.name,
    'description': comment.shortText,
    'methods': object.children.filter((child) => {
      return (child.kindString == 'Method');
    })
  }
}).map((object) => {

  let methods = object.methods.map((method) => {
    let realObject = method.signatures[0];
    let comment = realObject.comment || {
      'shortText': '',
      'text': '',
      'returns': '',
      'tags': [],
      'parameters': []
    };

    let parameters = (realObject.parameters || []).map((paramater) => {
      let parameterComment = paramater.comment || {'text' : ''};
      return {
        'name': paramater.name || '',
        'comment': parameterComment.text || '',
        'type': paramater.type.name || ''
      }
    });

    let tags = comment.tags || [];
    let example = tags.filter((tag) => tag.tag == 'example')[0] || {'text': ''};
    let response = tags.filter((tag) => tag.tag == 'response')[0] || {'text': ''};

    return {
      'name': comment.shortText || '',
      'method': realObject.name || '',
      'description': comment.text || '',
      'returns': comment.returns || '',
      'example': example.text || '',
      'response': response.text || '',
      'parameters': parameters
    }
  });

  let newObject = object;
  newObject.methods = methods;
  return newObject;

});

let markdown = classes.map((object) => {

  if (!object.name || !object.description) {
    return null;
  }

  let methods = object.methods.map((method) => {

    if (!method.name || !method.description) {
      return null;
    }

    let parameters = method.parameters.map((parameter) => {
      return `${parameter.name} | ${parameter.type} | ${parameter.comment}`
    }).join("");

    let exampleText = (
      method.example ?
       `\r${method.example}\r` : ''
    );

    let responseText = (
      method.response ?
        `\r> The above command returns JSON structured like this:\r\r
        ${method.response}\r\r` : ''
    );

    let methodText = (
      method.method ?
      `\r\`${method.method}\`\r` : ''
    )

    let parametersText = (
      method.parameters.length > 0 ?
        dedent(`\r### Request Parameters
        Name | Type | Comment
        ---- | ---- | -------
        ${parameters}\r`) : ''
    )

    return dedent(
      `## ${method.name}
      ${exampleText}
      ${responseText}
      ${method.description}
      ${methodText}
      ${parametersText}\r\r`)
  }).join("");

  return dedent(
    `# ${object.name}

    ${object.description}

    ${methods}\r`)

}).join("");

console.log(markdown);
fs.writeFile('./output.md', markdown, 'utf-8');
//fs.writeFile('../docs/output.json', JSON.stringify(classes, null, 2), 'utf-8');
