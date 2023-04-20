async function getAttributesFromUrl(url) {
  const response = await fetch(url, { mode: 'no-cors' });
  if (response.ok) {
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    loop(doc.body);
  } else {
    throw new Error('There was a problem fetching the Google Form URL. Please try again.');
  }
}

function loop(e) {
  if (e.children) {
    for (let i = 0; i < e.children.length; i++) {
      const c = e.children[i];
      const n = c.getAttribute('name');
      if (n) console.log(`${c.getAttribute('aria-label')}: ${n}`);
      loop(e.children[i]);
    }
  }
}

const formUrlInput = document.getElementById('urlInput');

const formSubmitButton = document.getElementById('form-submit-button');
console.log(formSubmitButton); 
formSubmitButton.addEventListener('click', async () => {
  const formUrl = formUrlInput.value.trim();
  if (formUrl) {
    try {
      await getAttributesFromUrl(formUrl);
      const errorMessage = document.getElementById('error-message');
      if (errorMessage) {
        errorMessage.remove();
      }
    } catch (err) {
      const form = document.querySelector('form');
      const errorMessage = document.createElement('div');
      errorMessage.setAttribute('id', 'error-message');
      errorMessage.textContent = err.message;
      errorMessage.style.color = 'red';
      form.appendChild(errorMessage);
    }
  } else {
    const form = document.querySelector('form');
    const errorMessage = document.createElement('div');
    errorMessage.setAttribute('id', 'error-message');
    errorMessage.textContent = 'Please enter a valid Google Form URL';
    errorMessage.style.color = 'red';
    form.appendChild(errorMessage);
  }
});

