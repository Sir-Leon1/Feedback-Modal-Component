const openModalButton = document.getElementById('openModalButton');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalOverlay = document.getElementById('modalOverlay');
const ratingButtons = document.querySelectorAll('.rating-btn');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const feedbackForm = document.getElementById('feedbackForm');
const successMessage = document.getElementById('successMessage');
const previousRatings = document.getElementById('previousRatings');
const ratingsList = document.getElementById('ratingsList');

let selectedRating = null;
let ratings = [];

/* Initialize the Application */
function init() {
    loadRatings();
    renderRatings();
    attachEventListeners();
}

//Get previous ratings from local storage
function loadRatings() {
    const storedRatings = localStorage.getItem('npsRatings');
    if (storedRatings) {
        ratings = JSON.parse(storedRatings);
    }
}

function saveRatings() {
    localStorage.setItem('npsRatings', JSON.stringify(ratings))
}

function renderRatings() {
    // Clear existing content
    ratingsList.innerHTML = '';

    // Hide container if no ratings
    if (ratings.length === 0) {
        previousRatings.style.display = 'none';
        return;
    }

    // Show container and render ratings
    previousRatings.style.display = 'block';

    // Create rating items
    ratings.forEach(rating => {
        const ratingItem = document.createElement('div');
        ratingItem.className = 'rating-item';

        const valueElement = document.createElement('div');
        valueElement.className = 'rating-value';
        valueElement.textContent = `Rating: ${rating.value} / 10`;

        const dateElement = document.createElement('div');
        dateElement.className = 'rating-date';
        dateElement.textContent = new Date(rating.timestamp).toLocaleString();

        ratingItem.appendChild(valueElement);
        ratingItem.appendChild(dateElement);

        ratingsList.appendChild(ratingItem);
    });
}

/* A function to attach event listeners*/
function attachEventListeners() {
    openModalButton.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    //Close whe clicking outside modal
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });
    
    //Add event listeners to each rating button
    ratingButtons.forEach(button => {
        button.addEventListener('click', function() {
            ratingButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            selectedRating = parseInt(this.dataset.value);
            submitBtn.disabled = false;
        });
    });
    
    //Submit rating to local storage
    submitBtn.addEventListener('click', handleSubmit);
    
}

/* Opening of the modal and resetting it*/
function openModal() {
    modalOverlay.classList.add('active');
    resetForm();
}

function resetForm() {
    selectedRating = null;
    ratingButtons.forEach(button => button.classList.remove('selected'));
    submitBtn.disabled = true;
    feedbackForm.style.display = 'block'
    successMessage.style.display = 'none';
}

function closeModal() {
    modalOverlay.classList.remove('active');
}

//Handle form submission
function handleSubmit() {
    const newRating = {
        value: selectedRating,
        timestamp: new Date().toISOString()
    };
    
    ratings.push(newRating);
    saveRatings();
    
    //Show susccess message and close the modal after delay
    feedbackForm.style.display = 'none'; 
    successMessage.style.display = 'block';
    
    
    closeModal();
    
}

document.addEventListener('DOMContentLoaded', init);

