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
            channelLink.href = `chatDashboard.html?channelId=${channel._id}`;  
            
            const channelNameParagraph = document.createElement('p');
            channelNameParagraph.textContent = `Channel Name: `;
            const channelDescriptionParagraph = document.createElement('p');
            channelDescriptionParagraph.textContent = `Channel Description: ${channel.description}`;
        
            
            channelsList.appendChild(channelLink);
            channelsList.appendChild(channelNameParagraph);
            channelsList.appendChild(channelDescriptionParagraph);
        });

 


    })
    .catch(error => {
        console.error('Error fetching channels:', error);
    });


document.getElementById('create-channel-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const formData = new FormData(this);
    const channelName = formData.get('channel-name');
    const channelDescription = formData.get('channel-description');

    const requestBody = {
        name: channelName,
        description: channelDescription,
        adminEmail: loggedEmail // Add the logged-in user's email to the request body
    };

    fetch(`${backendURI}/channels`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody) // Pass the request body with user's email
    })
    .then(response => response.json())
    .then(data => {
        console.log('Channel created successfully:', data);
    })
    .catch(error => {
        console.error('Error creating channel:', error);
    });
});
