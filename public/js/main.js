document.addEventListener('DOMContentLoaded', () => {
  // Product gallery elements
  const topsContainer = document.getElementById('tops-container');
  const bottomsContainer = document.getElementById('bottoms-container');

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

  // --- Image Loading Logic ---
  const loadAndEncodeImage = async (imageUrl, previewElement) => {
    return new Promise((resolve, reject) => {
      previewElement.src = imageUrl;
      previewElement.style.display = 'block';
      previewElement.parentElement.querySelector('.preview-text').style.display = 'none';

      fetch(imageUrl)
        .then(res => res.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64 = e.target.result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    });
  };

  // --- Product Gallery Logic ---
  const fetchAndDisplayProducts = async () => {
    try {
      const response = await fetch('/api/images');
      const data = await response.json();

      if (data.success && data.products) {
        topsContainer.innerHTML = '';
        bottomsContainer.innerHTML = '';

        data.products.forEach(product => {
          const productItem = document.createElement('div');
          productItem.className = 'product-item';
          
          const img = document.createElement('img');
          const imageUrl = product.images[0];
          img.src = imageUrl;
          img.alt = product.name;
          
          productItem.appendChild(img);

          productItem.addEventListener('click', async () => {
            encodedProductImage = await loadAndEncodeImage(imageUrl, productPreview);
          });

          if (product.category === 'tops') {
            topsContainer.appendChild(productItem);
          } else if (product.category === 'bottoms') {
            bottomsContainer.appendChild(productItem);
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  // --- Virtual Try-On Logic ---
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

  // --- Initial Load ---
  const initialize = async () => {
    if (!personUploader.files || personUploader.files.length === 0) {
      encodedPersonImage = await loadAndEncodeImage('/images/persons/example.jpg', personPreview);
    }
    await fetchAndDisplayProducts();
  };

  initialize();
});
