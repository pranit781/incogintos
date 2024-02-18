// script.js
import backendURI from "./config.js";


document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const formData = new FormData(this); // Get form data

    // Create object from form data
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        occupationEducation: formData.get('occupation-education'),
        password: formData.get('password')
    };

    // Send form data to backend
    fetch(`${backendURI}/users/register`, { // Use backend URI
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Registration failed');
        }
        // return response.json();
    })
    .then(data => {
        // Handle successful registration
        console.log('Registration successful');
        alert("register success")
        window.location('login.html')
        // Redirect or show success message
    })
    .catch(error => {
        // Handle registration error
        console.error('Registration error:', error.message);
        // Show error message to the user
    });
});
