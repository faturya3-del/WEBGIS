// API endpoints
const APIs = {
  general: 'https://official-joke-api.appspot.com/random_joke',
  programming: 'https://official-joke-api.appspot.com/jokes/programming/random',
  knockKnock: 'https://official-joke-api.appspot.com/jokes/knock-knock/random'
};

const jokeText = document.getElementById('jokeText');
const jokeDisplay = document.getElementById('jokeDisplay');
const getJokeBtn = document.getElementById('getJokeBtn');
const copyBtn = document.getElementById('copyBtn');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const jokeTypeRadios = document.querySelectorAll('input[name="jokeType"]');

let currentJoke = '';

// Get joke when button is clicked
getJokeBtn.addEventListener('click', fetchJoke);

// Copy joke to clipboard
copyBtn.addEventListener('click', copyToClipboard);

// Change API based on selected joke type
jokeTypeRadios.forEach(radio => {
  radio.addEventListener('change', fetchJoke);
});

async function fetchJoke() {
  // Get selected joke type
  const selectedType = document.querySelector('input[name="jokeType"]:checked').value;
  const apiUrl = selectedType === 'knock-knock' ? APIs.knockKnock : 
                 selectedType === 'programming' ? APIs.programming : 
                 APIs.general;

  // Show loading state
  loadingDiv.style.display = 'block';
  errorDiv.style.display = 'none';
  jokeText.textContent = 'Loading...';

  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Format the joke based on type
    if (Array.isArray(data)) {
      // For programming jokes which return an array
      const joke = data[0];
      currentJoke = `${joke.setup}\n\n${joke.punchline}`;
    } else {
      // For general and knock-knock jokes
      currentJoke = `${data.setup}\n\n${data.punchline}`;
    }

    // Display the joke
    jokeText.innerHTML = currentJoke.replace(/\n/g, '<br>');
    errorDiv.style.display = 'none';
  } catch (error) {
    console.error('Error fetching joke:', error);
    jokeText.textContent = 'Failed to fetch joke. Please try again!';
    errorDiv.textContent = `Error: ${error.message}`;
    errorDiv.style.display = 'block';
  } finally {
    loadingDiv.style.display = 'none';
  }
}

function copyToClipboard() {
  if (!currentJoke) {
    alert('Please get a joke first!');
    return;
  }

  navigator.clipboard.writeText(currentJoke).then(() => {
    // Show confirmation
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied! ✓';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
    alert('Failed to copy joke to clipboard');
  });
}

// Load a joke on page load
window.addEventListener('load', fetchJoke);