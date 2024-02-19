// Attach event listener to form submission
import backendURI from "./config.js"; 
const loggedEmail = sessionStorage.getItem('loggedEmail');
 
const adminEmail = loggedEmail;  
fetch(`${backendURI}/channels/createdBy/${adminEmail}`)
    .then(response => response.json())
    .then(channels => { 
        // console.log('Channels created by', adminEmail, ':', channels);
        const channelsList = document.getElementById('channels-list');
         
        channelsList.innerHTML = '';
         
         
        channels.forEach(channel => {
            const channelLink = document.createElement('a');
            channelLink.textContent = channel.name;
            channelLink.href = `chatDashboard.html?channelId=${channel._id}`; // Pass the channel ID in the URL
            
            // Create paragraph elements to display channel name and description
            const channelNameParagraph = document.createElement('p');
            channelNameParagraph.textContent = `Channel Name: `;
            const channelDescriptionParagraph = document.createElement('p');
            channelDescriptionParagraph.textContent = `Channel Description: ${channel.description}`;
        
            // Append link and channel information to the channelsList element
            channelsList.appendChild(channelLink);
            channelsList.appendChild(channelNameParagraph);
            channelsList.appendChild(channelDescriptionParagraph);
        });

 


    })
    .catch(error => {
        console.error('Error fetching channels:', error);
    });


// Attach event listener to form submission
document.getElementById('create-channel-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Get form data
    const formData = new FormData(this);
    const channelName = formData.get('channel-name');
    const channelDescription = formData.get('channel-description');

    // Construct the request body with user's email
    const requestBody = {
        name: channelName,
        description: channelDescription,
        adminEmail: loggedEmail // Add the logged-in user's email to the request body
    };

    // Example: Send form data to backend server using fetch API
    fetch(`${backendURI}/channels`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody) // Pass the request body with user's email
    })
    .then(response => response.json())
    .then(data => {
        // Handle successful response from server
        console.log('Channel created successfully:', data);
        // Optionally, you can update the UI to display the newly created channel
    })
    .catch(error => {
        // Handle error
        console.error('Error creating channel:', error);
    });
});
