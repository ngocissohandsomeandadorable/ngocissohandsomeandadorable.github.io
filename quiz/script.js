document.getElementById('submitWriting').addEventListener('click', () => {
  // Get the values from the textareas
  const email = document.querySelectorAll('textarea')[0].value;
  const essay = document.querySelectorAll('textarea')[1].value;

  // Combine quiz results and writing task
  const payload = {
    readingScore: window.quizResults.readingScore,
   emailContent: email,
    essayContent: essay
  };

  // Send the data to the Google Apps Script web app
  fetch('https://script.google.com/macros/s/AKfycbxWXTrMrKfb7UgbSUuZk6HgLBq1CVg8bLuOcc-UxLRp0g7yj7XVR_8-8WT-4kBARfsFpQ/exec', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.status === 'success') {
      // Transition to the results page
      document.querySelector('.writing-task').style.display = 'none';
      document.querySelector('.results-page').style.display = 'block';

      // Display the reading score
      document.getElementById('displayReadingScore').textContent = window.quizResults.readingScore;

      alert('Your quiz and writing tasks have been submitted successfully!');
    } else {
      alert('Error: ' + data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred while submitting your quiz.');
  });
