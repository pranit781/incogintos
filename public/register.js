// script.js
import backendURI from "./config.js";


document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault();  
    const formData = new FormData(this);  
 
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        occupationEducation: formData.get('occupation-education'),
        password: formData.get('password')
    };
 
    fetch(`${backendURI}/users/register`, { 
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
      
    })
    .then(data => {
        
        console.log('Registration successful');
        alert("register success")
        window.location('login.html')
        
    })
    .catch(error => {
        
        console.error('Registration error:', error.message);
         
    });
});
