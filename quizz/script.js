let currentPage = 1;
let readingScore = 0; // Store the reading score globally
let userAnswers = {}; // Store user's answers globally

document.getElementById('nextPage').addEventListener('click', () => {
  if (currentPage < 4) {
    document.getElementById(`page${currentPage}`).style.display = 'none';
    document.getElementById(`readingText${currentPage}`).style.display = 'none';
    currentPage++;
    document.getElementById(`page${currentPage}`).style.display = 'block';
    document.getElementById(`readingText${currentPage}`).style.display = 'block';
  }
  if (currentPage === 4) {
    document.getElementById('nextPage').style.display = 'none';
    document.getElementById('moveToWriting').style.display = 'inline-block';
  }
});

document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    document.getElementById(`page${currentPage}`).style.display = 'none';
    document.getElementById(`readingText${currentPage}`).style.display = 'none';
    currentPage--;
    document.getElementById(`page${currentPage}`).style.display = 'block';
    document.getElementById(`readingText${currentPage}`).style.display = 'block';
  }
  document.getElementById('nextPage').style.display = 'inline-block';
  document.getElementById('moveToWriting').style.display = 'none';
});

document.getElementById('moveToWriting').addEventListener('click', () => {
  // Calculate reading score before moving to writing tasks
  const answers = {
    q1: 'a', q2: 'b', q3: 'c', q4: 'a', q5: 'b', q6: 'c', q7: 'a', q8: 'b', q9: 'c', q10: 'a',
    q11: 'b', q12: 'c', q13: 'a', q14: 'b', q15: 'c', q16: 'a', q17: 'b', q18: 'c', q19: 'a', q20: 'b',
    q21: 'c', q22: 'a', q23: 'b', q24: 'c', q25: 'a', q26: 'b', q27: 'c', q28: 'a', q29: 'b', q30: 'c',
    q31: 'a', q32: 'b', q33: 'c', q34: 'a', q35: 'b', q36: 'c', q37: 'a', q38: 'b', q39: 'c', q40: 'a'
  };

  readingScore = 0;

  for (const [key, value] of Object.entries(answers)) {
    const selected = document.querySelector(`input[name="${key}"]:checked`);
    const feedbackSpans = document.querySelectorAll(`input[name="${key}"] + .feedback`);
    feedbackSpans.forEach(span => span.classList.remove('correct', 'incorrect'));
    if (selected) {
      userAnswers[key] = selected.value; // Store user's answer
      if (selected.value === value) {
        readingScore++;
        selected.nextElementSibling.classList.add('correct');
      } else {
        selected.nextElementSibling.classList.add('incorrect');
        document.querySelector(`input[name="${key}"][value="${value}"]`)
          .nextElementSibling.classList.add('correct');
      }
    } else {
      userAnswers[key] = null; // No answer selected
      document.querySelector(`input[name="${key}"][value="${value}"]`)
        .nextElementSibling.classList.add('correct');
    }
  }

  alert(`Your reading score: ${readingScore}/${Object.keys(answers).length}`);

  // Transition to the writing task page
  document.querySelector('.reading-task').style.display = 'none';
  document.querySelector('.writing-task').style.display = 'block';
});

document.getElementById('submitWriting').addEventListener('click', () => {
  // Get the values from the textareas
  const email = document.querySelectorAll('textarea')[0].value;
  const essay = document.querySelectorAll('textarea')[1].value;

  // Determine writing task status
  const task1Status = email.trim() ? "Completed" : "Incomplete";
  const task2Status = essay.trim() ? "Completed" : "Incomplete";

  // Combine quiz results and writing task
  const payload = {
    readingScore: readingScore,
    answers: userAnswers,
    emailContent: email,
    essayContent: essay
  };

  // Send the data to the Google Apps Script web app
  fetch('https://script.google.com/macros/s/AKfycbxWXTrMrKfb7UgbSUuZk6HgLBq1CVg8bLuOcc-UxLRp0g7yj7XVR_8-8WT-4kBARfsFpQ/exec', {
    method: 'POST',
mode: 'no-cors', // Disable CORS
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(data => {
      // Show results page
      document.querySelector('.writing-task').style.display = 'none';
      document.querySelector('.results-page').style.display = 'block';

      // Update results page content
      document.getElementById('scoreValue').textContent = readingScore;
      document.getElementById('task1Status').textContent = task1Status;
      document.getElementById('task2Status').textContent = task2Status;

      // If there was an error, display it on the results page
      if (data.status === 'error') {
        document.getElementById('errorMessage').textContent = `Error: ${data.message}`;
      } else {
        document.getElementById('errorMessage').textContent = ''; // Clear any previous error
      }
    })
    .catch(error => {
      console.error('Error:', error);

      // Show results page even if there's an error
      document.querySelector('.writing-task').style.display = 'none';
      document.querySelector('.results-page').style.display = 'block';

      // Update results page content
      document.getElementById('scoreValue').textContent = readingScore;
      document.getElementById('task1Status').textContent = task1Status;
      document.getElementById('task2Status').textContent = task2Status;

      // Display the error message on the results page
      document.getElementById('errorMessage').textContent = 'An error occurred while submitting your quiz.';
    });
});

document.getElementById('reviewAnswers').addEventListener('click', () => {
  // Show the reading task section again
  document.querySelector('.results-page').style.display = 'none';
  document.querySelector('.reading-task').style.display = 'block';
});