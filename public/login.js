// login.js
import backendURI from "./config.js";

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const formData = new FormData(this); // Get form data

    // Create object from form data
    const credentials = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    // Send login request to backend
    fetch(`${backendURI}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    })
    .then(data => {
        // Handle successful login
        console.log('Login successful:', data);

        // Store logged email in session storage
        sessionStorage.setItem('loggedEmail', data.user.email);

        // Redirect to index.html
        window.location.href = 'index.html';
    })
    .catch(error => {
        // Handle login error
        console.error('Login error:', error.message);
        // Show error message to the user
    });
});
