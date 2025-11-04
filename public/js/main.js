document.addEventListener('DOMContentLoaded', () => {
  // Input elements
  const personUploader = document.getElementById('person-uploader');
  const productUploader = document.getElementById('product-uploader');
  const personPreview = document.getElementById('person-preview');
  const productPreview = document.getElementById('product-preview');

  // API selection
  const vtoCheckbox = document.getElementById('vto-checkbox');
  const geminiCheckbox = document.getElementById('gemini-checkbox');
  const generateBtn = document.getElementById('generate-btn');

  // Result display elements
  const resultVtoSection = document.getElementById('result-vto-section');
  const resultImageVto = document.getElementById('result-image-vto');
  const resultModelVto = document.getElementById('result-model-vto');
  const resultContainerVto = document.getElementById('result-container-vto');

  const resultGeminiSection = document.getElementById('result-gemini-section');
  const resultImageGemini = document.getElementById('result-image-gemini');
  const resultModelGemini = document.getElementById('result-model-gemini');
  const resultContainerGemini = document.getElementById('result-container-gemini');

  let encodedPersonImage = '';
  let encodedProductImage = '';

  const handleFileChange = (event, preview, onImageEncoded) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fullDataUrl = e.target.result;
        preview.src = fullDataUrl;
        preview.style.display = 'block';
        preview.parentElement.querySelector('.preview-text').style.display = 'none';
        const base64 = fullDataUrl.split(',')[1];
        onImageEncoded(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  personUploader.addEventListener('change', (e) => handleFileChange(e, personPreview, (encoded) => {
    encodedPersonImage = encoded;
  }));

  productUploader.addEventListener('change', (e) => handleFileChange(e, productPreview, (encoded) => {
    encodedProductImage = encoded;
  }));

  const showLoadingState = (section, modelName) => {
    section.style.display = 'block';
    section.querySelector('p').textContent = `Generating with: ${modelName}...`;
    section.querySelector('img').style.display = 'none';
    section.querySelector('.preview-text').style.display = 'block';
  };

  const showResult = (section, modelName, encodedImage) => {
    section.querySelector('p').textContent = `Result from: ${modelName}`;
    const img = section.querySelector('img');
    img.src = 'data:image/png;base64,' + encodedImage;
    img.style.display = 'block';
    section.querySelector('.preview-text').style.display = 'none';
  };

  const showError = (section, modelName, message) => {
    section.querySelector('p').textContent = `Failed: ${modelName}. ${message}`;
  };

  const performApiRequest = async (endpoint, modelName, resultSection) => {
    showLoadingState(resultSection, modelName);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encodedPersonImage, encodedProductImage }),
      });
      const result = await response.json();
      if (result.success) {
        showResult(resultSection, modelName, result.encodedImage);
      } else {
        showError(resultSection, modelName, result.message);
      }
    } catch (error) {
      console.error(`Error during ${modelName} fetch:`, error);
      showError(resultSection, modelName, 'Request failed.');
    }
  };

  generateBtn.addEventListener('click', async () => {
    if (!encodedPersonImage || !encodedProductImage) {
      alert('Please select both a person and a product image.');
      return;
    }

    const isVtoSelected = vtoCheckbox.checked;
    const isGeminiSelected = geminiCheckbox.checked;

    if (!isVtoSelected && !isGeminiSelected) {
      alert('Please select at least one API to perform the try-on.');
      return;
    }

    resultVtoSection.style.display = 'none';
    resultGeminiSection.style.display = 'none';

    const requests = [];

    if (isVtoSelected) {
      requests.push(performApiRequest('/api/google-vto', 'Google VTO', resultVtoSection));
    }
    if (isGeminiSelected) {
      requests.push(performApiRequest('/api/gemini-flash-image', 'Gemini Flash Image', resultGeminiSection));
    }

    await Promise.all(requests);
  });
});
