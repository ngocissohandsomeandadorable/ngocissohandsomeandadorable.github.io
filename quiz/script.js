// script.js
let currentPage = 1;
let readingScore = 0; // Store the reading score globally

document.getElementById('nextPage').addEventListener('click', () => {
  if (currentPage < 4) {
    document.getElementById(`page${currentPage}`).style.display = 'none';
    document.getElementById(`readingText${currentPage}`).style.display = 'none';
    currentPage++;
    document.getElementById(`page${currentPage}`).style.display = 'block';
    document.getElementById(`readingText${currentPage}`).style.display = 'block';
  }
  if (currentPage === 4) {
    document.getElementById('submitQuiz').style.display = 'inline-block';
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
  document.getElementById('submitQuiz').style.display = 'none';
});

document.getElementById('quizForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Calculate score and prepare feedback
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
      if (selected.value === value) {
        readingScore++;
        selected.nextElementSibling.classList.add('correct');
      } else {
        selected.nextElementSibling.classList.add('incorrect');
        document.querySelector(`input[name="${key}"][value="${value}"]`)
          .nextElementSibling.classList.add('correct');
      }
    } else {
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

  // Prepare the data to send
  const formData = {
    email: email,
    essay: essay,
    readingScore: readingScore // Ensure `readingScore` is defined globally
  };

  // Send the data to the Google Apps Script Web App
  const scriptURL = 'https://script.google.com/macros/s/AKfycbyfLxROF83AOACITKX3pyPLPH5eR5fCuHYa7eFuEzaW5Hf11Gh7A0PApp7bzYtVoDepkQ/exec'; // Replace with your deployed Web App URL

  fetch(scriptURL, {
    method: 'POST',
 mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json' // Specify JSON content type
    },
    body: JSON.stringify(formData) // Convert the data to JSON format
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.status === 'success') {
        alert('Results submitted successfully!');
        
        // Show reading results and feedback
        document.querySelector('.writing-task').style.display = 'none';
        document.querySelector('.results-page').style.display = 'block';

        // Display reading results
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `<p>Your final reading score: ${readingScore}/${Object.keys(answers).length}</p>`;
        
        // Reveal feedback icons
        const feedbackSpans = document.querySelectorAll('.feedback');
        feedbackSpans.forEach(span => span.style.display = 'inline');
      } else {
        alert(`Error: ${data.message}`);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while submitting your results. Please try again.');
    });
});
