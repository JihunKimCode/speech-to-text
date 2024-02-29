document.addEventListener('DOMContentLoaded', () => {
  const recordButton = document.getElementById('recordButton');
  const copyButton = document.getElementById('copyButton');
  const downloadButton = document.getElementById('downloadButton');
  const clearButton = document.getElementById('clearButton');
  const outputDiv = document.getElementById('output');
  let isRecognizing = false;  //true when recognition starts
  let recognition;

  if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
  } else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition();
  } else {
    console.error('Speech recognition is not supported in this browser.');
    alert('Failed to use SpeechRecognition. Try different Browser.');
  }

  recognition.continuous = true;
  recognition.lang = 'en-US';

  // Manage Recognition Start/End/Error
  recognition.onstart = () => {
    recordButton.innerHTML = '<i class="fa-solid fa-microphone-lines"></i>';
    recordButton.style.color = 'red';
  };

  function sentenceUpdate(string) {
    const trimmedString = string.trim();
    let updateString = trimmedString.charAt(0).toUpperCase() + trimmedString.slice(1);
  
    // Check if the last character is a period, if not, add it.
    if (updateString.charAt(updateString.length - 1) !== '.') {
      updateString += '.';
    }
  
    return updateString;
  }
  
  recognition.onresult = (event) => {
    const result = event.results[event.results.length - 1][0].transcript;
  
    const paragraph = document.createElement('p');
    paragraph.textContent = sentenceUpdate(result);
    if(paragraph.textContent!=='.') outputDiv.appendChild(paragraph);
  };
  
  recognition.onend = () => {
    recordButton.innerHTML = '<i class="fa-solid fa-microphone"></i>';
    recordButton.style.color = '#3c4043';
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    recordButton.innerHTML = '<i class="fa-solid fa-microphone"></i>';
    recordButton.style.color = '#3c4043';
  };

  // Start or Stop Recording
  recordButton.addEventListener('click', () => {
    if (isRecognizing) {
      recognition.stop();
      isRecognizing = false;
    } else {
      recognition.start();
      isRecognizing = true;
    }
  });
  
  // Copy Text
  copyButton.addEventListener('click', () => {
    const textToCopy = outputDiv.textContent.trim().replace(/\./g, '.\n\n');
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        // alert('Text copied to clipboard!');
      }).catch((error) => {
        console.error('Unable to copy text to clipboard', error);
      });
    }
  });

  // Download text into a txt file
  downloadButton.addEventListener('click', () => {
    const textToDownload = outputDiv.textContent.trim().replace(/\./g, '.\n\n');
    if (textToDownload) {
      const blob = new Blob([textToDownload], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'speech_to_text.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    }
  });

  // Clear all text
  clearButton.addEventListener('click', () => {
    outputDiv.textContent = '';
  });
});
