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
    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var phoneNumber = document.getElementById('phoneNumber').value;
        var nationality = document.getElementById('nationality').value;
        var message = '';
        console.log(phoneNumber);

        if (name === '' || email === '' || phoneNumber === '' || nationality === '') {
            message = 'All fields are required.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            message = 'Please enter a valid email address.';
        } else if (!validatePhoneNumber(phoneNumber)) {
            message = 'Please enter a valid phone number.';
        } else {
            document.getElementById('formMessage').textContent = 'Submitting...';
            fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, phoneNumber, nationality }),
            })
            .then(response => response.text())
            .then(data => {
                document.getElementById('formMessage').textContent = data;
            })
            .catch((error) => {
                console.error('Error:', error);
                document.getElementById('formMessage').textContent = 'Error registering.';
            });

            message = 'Registration successful!';
        }

        document.getElementById('formMessage').textContent = message;
    });

    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault();
        var name = document.getElementById('contactName').value;
        var email = document.getElementById('contactEmail').value;
        var messageContent = document.getElementById('message').value;
        var message = '';

        if (name === '' || email === '' || messageContent === '') {
            message = 'All fields are required.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            message = 'Please enter a valid email address.';
        } else {
            // Show loading indicator
            document.getElementById('contactFormMessage').textContent = 'Sending message...';

            fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, messageContent }),
            })
            .then(response => response.text())
            .then(data => {
                document.getElementById('contactFormMessage').textContent = data;
            })
            .catch((error) => {
                console.error('Error:', error);
                document.getElementById('contactFormMessage').textContent = 'Error sending message.';
            });

            message = 'Message sent successfully!';
        }

        document.getElementById('contactFormMessage').textContent = message;
    });

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
