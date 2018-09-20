var fs = require('fs');
var json = JSON.parse(fs.readFileSync('../docs/docs.json', 'utf8'));
var dedent = require('dedent-js');

let classes = json.children.filter((object) => {
  return object.children
}).filter((object) => {
  return object.children[0].kindString == 'Class';
}).map((object) => {
  return object.children[0];
}).map((object) => {

  let comment = object.comment || {'name': '', 'shortText': '', 'tags': []};
  let tags = comment.tags || [];

  let path = tags.filter((tag) => tag.tag == 'path')[0] || {'text': ''};
  let classDescription = tags.filter((tag) => tag.tag == 'comment')[0] || {'text': ''};

  return {
    'name': comment.shortText,
    'description': classDescription.text.replace(/\\n/g, ''),
    'path': path.text.trim() || '',
    'methods': object.children.filter((child) => {
      return (child.kindString == 'Method');
    })
  }
}).map((object) => {

  let methods = object.methods.map((method) => {
    let signatureObject = method.signatures[0];
    let comment = signatureObject.comment || {
      'shortText': '',
      'text': '',
      'returns': '',
      'tags': [],
      'parameters': []
    };

    let parameters = (signatureObject.parameters || []).map((paramater) => {
      let strippedParameter = JSON.parse(JSON.stringify(paramater).replace(/\\n/g, ''))

      let parameterType;
      if (strippedParameter.type.type == 'union') {
        parameterType = `(${strippedParameter.type.types.map((object) => object.name).join(' | ')})`;
      } else {
        parameterType = strippedParameter.type.name || ''
      }

      let parameterComment = strippedParameter.comment || {'text' : ''};
      return {
        'name': strippedParameter.name || '',
        'comment': parameterComment.text || '',
        'type': parameterType
      }
    });

    let typeObject = signatureObject.type || {
      'name': '',
      'typeArguments': []
    };

    let returnType;
    if (typeObject.type == 'reference') {
      returnType = `Promise<${typeObject.typeArguments.map((item) => {
        if (item.type == 'array') {
          return `[${item.elementType.name}]`;
        } else {
          return item.name;
        }
      }).join(', ')}>`;
    } else {
      returnType = typeObject.name;
    }

    let tags = comment.tags || [];
    let priority = tags.filter((tag) => tag.tag == 'priority')[0] || {'text': ''};
    let response = tags.filter((tag) => tag.tag == 'response')[0] || {'text': ''};

    return {
      'name': comment.shortText || '',
      'method': signatureObject.name || '',
      'returnType': returnType || '',
      'description': comment.text || '',
      'returns': comment.returns || '',
      'response': response.text || '',
      'parameters': parameters,
      'priority': parseInt(priority.text || '0')
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

  let methods = object.methods.sort((one, two) => {
    return one.priority > two.priority
  }).map((method) => {

    if (!method.name || !method.description) {
      return null;
    }

    let parameters = method.parameters.map((parameter) => {
      return `${parameter.name} | ${parameter.type.replace('|', '&#x7c;')} | ${parameter.comment} \r`
    }).join("");

    let exampleText = (
      `\r\`\`\`typescript\r`
      + `import eightEx from 'eightEx';\r\r`
      + `const eightEx = new EightEx(web3, addressBook);\r\r`
      + `${object.path}.${method.method}(\r`
      + `${method.parameters.map((parameter) => `   ${parameter.name}: ${parameter.type}`).join(',\r')}`
      + `\r`
      + `): ${method.returnType} \r`
      + `\`\`\``
    );

    let responseText = (
      method.response ?
        `\r> The above command returns JSON structured like this:\r\r
        ${method.response}\r` : ''
    );

    let methodText = (
      method.method ?
      `\r\`${method.method}\`\r` : ''
    )

    let parametersText = (
      method.parameters.length > 0 ?
        `### Request Parameters\r`
         + `Name | Type | Comment \r`
         + `---- | ---- | ------- \r`
         + `${parameters}` : ''
    )

    return dedent(
      `## ${method.name}
      ${methodText}
      ${exampleText}
      ${responseText}
      ${method.description}
      ${parametersText}\r`)
  }).join("");

  return dedent(
    `# ${object.name}

    ${object.description}

    ${methods}\r`)

}).join("");

fs.writeFile('../docs/docs.md', markdown, 'utf-8');
