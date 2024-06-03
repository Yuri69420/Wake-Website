document.addEventListener("DOMContentLoaded", function() {
    // Countdown Timer Script
    var endDate = new Date("2024-11-15T20:30:00");

    function updateCountdown() {
        try {
            var now = new Date();
            var timeDiff = endDate.getTime() - now.getTime();

            if (timeDiff < 0) {
                throw new Error("The event has already started or the date is invalid.");
            }

            var days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            var hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            document.getElementById("days").textContent = days;
            document.getElementById("hours").textContent = hours;
            document.getElementById("minutes").textContent = minutes;
            document.getElementById("seconds").textContent = seconds;
        } catch (error) {
            console.error(error);
            document.getElementById("countdown").textContent = "Countdown unavailable.";
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Form Validation and Submission Script
    function handleFormSubmission(formId, messageElementId) {
        document.getElementById(formId).addEventListener('submit', function(event) {
            event.preventDefault();
            var formData = new FormData(event.target);
            var messageElement = document.getElementById(messageElementId);

            if ([...formData.values()].some(value => value === '')) {
                messageElement.textContent = 'All fields are required.';
                return;
            }

            if (formId === 'registrationForm' && !validatePhoneNumber(formData.get('phoneNumber'))) {
                messageElement.textContent = 'Please enter a valid phone number.';
                return;
            }

            messageElement.textContent = 'Submitting...';

            fetch('/', {
                method: 'POST',
                body: formData,
            })
            .then(response => {
                if (response.ok) {
                    messageElement.textContent = 'Submission successful!';
                    event.target.reset();
                } else {
                    messageElement.textContent = 'An error occurred. Please try again.';
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                messageElement.textContent = 'Error submitting form.';
            });
        });
    }

    handleFormSubmission('registrationForm', 'formMessage');
    handleFormSubmission('contactForm', 'contactFormMessage');

    // Video Loading Indicator Script
    function hideLoadingIndicator() {
        document.getElementById('videoContainer').innerHTML = '';
    }

    function validatePhoneNumber(phoneNumber) {
        var phoneRegex = /^\+?[1-9]\d{1,14}$/; // International format
        return phoneRegex.test(phoneNumber);
    }

    document.querySelector('video').addEventListener('loadeddata', hideLoadingIndicator);
});
