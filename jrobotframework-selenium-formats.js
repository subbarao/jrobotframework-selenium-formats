var options = {
  indent: '    ',
  format: 'text'
};

var configForm =
  '<description>Format</description>' +
  '<menulist id="options_format">' +
    '<menupopup>' +
      '<menuitem label="text" value="text"></menuitem>' +
      '<menuitem label="csv" value="csv"></menuitem>' +
      '<menuitem label="excel" value="xlsx"></menuitem>' +
      '<menuitem label="html" value="html"></menuitem>' +
    '</menupopup>' +
  '</menulist>' +
  '<description>Indent</description>' +
  '<menulist id="options_indent">' +
    '<menupopup>' +
      '<menuitem label="2 spaces" value="  "></menuitem>' +
      '<menuitem label="4 spaces" value="    "></menuitem>' +
      '<menuitem label="8 spaces" value="        "></menuitem>' +
    '</menupopup>' +
  '</menulist>';

function formatCommands(commands, baseURL) {
  if (baseURL.endsWith('/')) {
    baseURL = baseURL.substring(0, baseURL.length - 1);
  }
  var result = '';
  for (var i = 0; i < commands.length; i++) {
    var command = commands[i];
    if (command.type === 'command') {
      var keyword = command.command;
      if (keyword === null) {
        keyword = command.command;
      }
      var target = command.target;
      if (keyword === 'open') {
        target = baseURL + target;
      }
      result += options.indent + keyword;
      if (target !== null && target !== '') {
        result += options.indent + target;
      }
      if (command.value !== null && command.value !== '') {
        result += options.indent + command.value;
      }
      result += '\n';
    }
  }
  return result;
}

function parse(testCase, source) {
  var doc = source;
  var commands = [];
  while (doc.length > 0) {
    var line = /(.*)(\r\n|[\r\n])?/.exec(doc);
    var array = line[1].split(options.indent);
    if (array.length >= 3) {
      var command = new Command();
      command.command = array[0];
      command.target = array[1];
      command.value = array[2];
      commands.push(command);
    }
    doc = doc.substr(line[0].length);
  }
  testCase.setCommands(commands);
}

function format(testCase, name) {
  var result = '*** Settings ***\n' +
    'Resource' + options.indent +
    '../selenium-resources.txt\n\n' +
    '*** Test Cases ***\n';

  var baseURL = testCase.getBaseURL();
  commands = formatCommands(testCase.commands, baseURL);
  return result + testCase.getTitle() + '\n' + commands + '\n';
}

function formatSuite(testSuite, filename) {
  var formattedSuite = '*** Settings ***\n' +
    'Resource' + options.indent +
    '../selenium-resources.txt\n\n' +
    '*** Test Cases ***\n';

  for (var i = 0; i < testSuite.tests.length; ++i) {
    if (0 !== i) {
      formattedSuite += '\n';
    }
    var testCase = testSuite.tests[i];
    var testName = testCase.getTitle();
    var testCaseContent = testCase.content;
    formattedSuite += testName + '\n';
    formattedSuite += formatCommands(testCaseContent.commands, testCaseContent.getBaseURL());
  }

  return formattedSuite;
}
