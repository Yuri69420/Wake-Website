//const { response } = require("express");

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
            //console.log({ days, hours, minutes, seconds });
        } catch (error) {
            console.error(error);
            document.getElementById("countdown").textContent = "Countdown unavailable.";
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Form Validation Script
    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var phoneNumber = document.getElementById("phoneNumber").value;
        var nationality = document.getElementById("nationality").value;
        var message = '';

        if (name === '' || email === '' || phoneNumber === '' || nationality === '') {
            message = 'All fields are required.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            message = 'Please enter a valid email address.';
        } else {
            fetch('/register', {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
            body : JSON.stringify({name, email, phoneNumber, nationality}),
        })
        .then(response => response.text())
        .then(date => {
        document.getElementById('formMessage').textContent = data;
        })
        .catch((error) => {
            console.error('Error:', error);
            }),
            message = 'Registration successful!';
        }

        document.getElementById('formMessage').textContent = message;
    });

    // Video Loading Indicator Script
    function hideLoadingIndicator() {
        document.getElementById('videoContainer').innerHTML = '';
    }
    function validatePhoneNumber(phoneNumber) {
        // Regular expressions for matching both formats
        var internationalFormatRegex = /^\+\d{2}\s\d{1,2}\s\d{2}\s\d{2}\s\d{2}\s\d{2}$/;
        var localFormatRegex = /^\d{2}\s\d{2}\s\d{2}\s\d{2}\s\d{2}\s\d{2}$/;
    
        if (internationalFormatRegex.test(phoneNumber)) {
            return true;
        } else if (localFormatRegex.test(phoneNumber)) {
            // Transform local format to international format
            phoneNumber = '+33 ' + phoneNumber.substring(1); // Assuming French numbers for the transformation
            return true;
        } else {
            return false;
        }
    }

    document.querySelector('video').addEventListener('loadeddata', hideLoadingIndicator);
});
