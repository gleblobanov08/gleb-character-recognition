
    const API_KEY = 'K83057992188957'; // Replace with your OCR.Space key
    const API_URL = 'https://api.ocr.space/parse/image';

    document.getElementById('imageInput').addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const imageData = e.target.result.split(',')[1]; // Base64 data
          recognizeText(imageData);
        };
        reader.readAsDataURL(file);
      }
    });

    function recognizeText(imageData) {
      const formData = new FormData();
      formData.append('base64Image', `data:image/jpeg;base64,${imageData}`);
      formData.append('language', 'rus'); // For Russian text (use 'eng' for English)
      formData.append('isOverlayRequired', 'false');
      formData.append('OCREngine', '2'); // Engine 2 for printed/handwritten text

      fetch(API_URL, {
        method: 'POST',
        headers: {
          'apikey': API_KEY
        },
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.IsErroredOnProcessing) {
          document.getElementById('output').textContent = 'Error: ' + data.ErrorMessage;
        } else {
          const recognizedText = data.ParsedResults[0]?.ParsedText || 'No text detected.';
          document.getElementById('output').textContent = recognizedText;
        }
      })
      .catch(error => {
        console.error('Error:', error);
        document.getElementById('output').textContent = 'An error occurred.';
      });
    }
