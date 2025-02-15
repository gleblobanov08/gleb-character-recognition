    const API_KEY = 'K83057992188957'; // OCR.Space API key
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('imageInput');
    const output = document.getElementById('output');
    const errorEl = document.getElementById('error');
    const spinner = document.getElementById('spinner');
    const imagePreview = document.getElementById('imagePreview');

    // Drag and Drop Handlers
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      handleFile(file);
    });

    // Click to Upload
    dropZone.addEventListener('click', () => fileInput.click());

    // File Input Change
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      handleFile(file);
    });

    // Handle File (Common Function)
    function handleFile(file) {
      errorEl.textContent = '';
      if (!file.type.startsWith('image/')) {
        errorEl.textContent = 'Please upload an image file.';
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
      };
      reader.readAsDataURL(file);

      // Process image
      recognizeText(file);
    }

    // OCR Processing
    async function recognizeText(file) {
      try {
        showSpinner(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('language', 'rus');
        formData.append('OCREngine', '2');

        const response = await fetch('https://api.ocr.space/parse/image', {
          method: 'POST',
          headers: { 'apikey': API_KEY },
          body: formData
        });

        const data = await response.json();
        if (data.IsErroredOnProcessing) {
          throw new Error(data.ErrorMessage);
        }

        output.textContent = data.ParsedResults[0].ParsedText;
      } catch (err) {
        errorEl.textContent = `Error: ${err.message}`;
      } finally {
        showSpinner(false);
      }
    }

    // Copy Button
    document.getElementById('copyBtn').addEventListener('click', () => {
      navigator.clipboard.writeText(output.textContent)
        .then(() => alert('Text copied to clipboard!'))
        .catch(() => alert('Failed to copy text.'));
    });

    // Download Button
    document.getElementById('downloadBtn').addEventListener('click', () => {
      const text = output.textContent;
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'recognized-text.txt';
      a.click();
      URL.revokeObjectURL(url);
    });

    // Spinner Control
    function showSpinner(show) {
      spinner.style.display = show ? 'block' : 'none';
    }
