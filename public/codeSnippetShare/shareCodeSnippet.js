// const backendURI = require("../config.js");
// import backendURI from "../config.js";

// const backendURI = 'https://www.incognitos.online:3000';
document.getElementById('preview-btn').addEventListener('click', function () {
  var codeInput = document.getElementById('code-input').value;
  var previewArea = document.getElementById('preview-area');

  previewArea.textContent = codeInput;
  document.getElementById('snippet-preview').style.display = 'block';
});

document.getElementById('code-input').addEventListener('keydown', function (event) {
  if (event.key === 'Tab') {
    event.preventDefault();
    var textarea = event.target;
    var start = textarea.selectionStart;
    var end = textarea.selectionEnd;
    textarea.value = textarea.value.substring(0, start) + '\t' + textarea.value.substring(end);

    textarea.selectionStart = textarea.selectionEnd = start + 1;
  }
});




document.getElementById('code-input').addEventListener('keydown', function (event) {
  var textarea = this;
  var wordCount = textarea.value.replace(/\s+/g, '').length;
  var wordLimit = 10000;
  var errorMessage = document.getElementById('error-message');
  var wordCountDisplay = document.getElementById('word-count');


  if (wordCount >= wordLimit && event.key !== 'Backspace' && event.key !== 'Delete') {
    event.preventDefault();
    errorMessage.textContent = 'Word limit exceeded.';
  } else {
    errorMessage.textContent = '';
  }
  wordCountDisplay.textContent = 'Input Count: ' + wordCount + '/' + wordLimit;

});

document.getElementById('preview-btn').addEventListener('click', function () {
  var codeInput = document.getElementById('code-input').value;
  var previewArea = document.getElementById('preview-area');
  previewArea.textContent = codeInput;
  document.getElementById('snippet-preview').style.display = 'block';
});
document.getElementById('snippet-form').addEventListener('submit', function (event) {
  event.preventDefault();

  var numVisitors = parseInt(document.getElementById('num-visitors').value);
  var storageDuration = parseInt(document.getElementById('storage-duration').value);
  var discardTime = Math.max(numVisitors * storageDuration, storageDuration);
  var disclaimerMessage = 'When you share this code snippet, it will be kept for a duration of ' + storageDuration + ' hours or, if the number of visitors exceeds the limit, for ' + numVisitors + ' . \n Do you agree to proceed?';
  var userResponse = confirm(disclaimerMessage);

  if (userResponse) {
    document.getElementById('snippet-form').submit();
  } else {
    console.log('User declined to share the code snippet.');
  }

});

document.getElementById('snippet-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  var numVisitors = parseInt(document.getElementById('num-visitors').value);
  var storageDuration = parseInt(document.getElementById('storage-duration').value);
  var codeInput = document.getElementById('code-input').value;

  const data = {
    code: codeInput,
    numVisitors: numVisitors,
    storageDuration: storageDuration
  };

 

  try {
    
    // const response = await fetch(`${backendURI}/codeSnippets/save`, {
      const response = await fetch('/codeSnippets/save', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Error saving code snippet');
    }

    const responseData = await response.json();
    const randomId = responseData.randomId;
    
    // const link = `${backendURI}/data/` + randomId;
    const link = window.location.origin + '/data/' + randomId;


    document.getElementById('dataLink').href = link;
    document.getElementById('dataLink').textContent = link;


    document.getElementById('dataId').textContent = 'ID: ' + randomId;

    // Make the pop container visible
    document.querySelector('.pop-container').style.display = 'block';

    // Copy link button functionality
    document.getElementById('copyPop').addEventListener('click', function () {
      // Create a temporary input element
      const tempInput = document.createElement('input');
      tempInput.value = link;
      document.body.appendChild(tempInput);

      // Select the link text
      tempInput.select();
      tempInput.setSelectionRange(0, 99999); // For mobile devices

      // Copy the link text
      document.execCommand('copy');

      // Remove the temporary input element
      document.body.removeChild(tempInput);
    });

    // Close button functionality
    document.getElementById('closePop').addEventListener('click', function () {
      // Refresh the page
      window.location.reload();
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
});
