// Replace this with your Dialogflow project ID
const projectId = 'your-dialogflow-project-id';
const sessionId = '12345'; // A unique session ID for each user session
const languageCode = 'en'; // Set to the language you are using in Dialogflow

// Replace this with your Dialogflow credentials JSON file
const credentials = {
    "type": "service_account",
    "project_id": "your-dialogflow-project-id",
    "private_key_id": "your-private-key-id",
    "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
    "client_email": "your-client-email@project-id.iam.gserviceaccount.com",
    "client_id": "your-client-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/project-id.iam.gserviceaccount.com"
};

// Handle the send button click event
document.getElementById('send-btn').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;
    
    displayMessage(userInput, 'user-message');
    document.getElementById('user-input').value = '';

    const response = await fetchDialogflowResponse(userInput);
    displayMessage(response, 'bot-message');
});

// Display messages in the chat box
function displayMessage(message, className) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to fetch response from Dialogflow
async function fetchDialogflowResponse(userInput) {
    const url = `https://dialogflow.googleapis.com/v2/projects/${projectId}/agent/sessions/${sessionId}:detectIntent`;

    const requestBody = {
        queryInput: {
            text: {
                text: userInput,
                languageCode: languageCode,
            },
        },
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${await getAccessToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        return data.queryResult.fulfillmentText;
    } catch (error) {
        console.error('Error fetching Dialogflow response:', error);
        return 'Error: Could not get a response from Dialogflow';
    }
}

// Get the OAuth 2.0 access token using the service account credentials
async function getAccessToken() {
    const { client_email, private_key } = credentials;

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${await createJWT()}`,
    });

    const { access_token } = await tokenResponse.json();
    return access_token;
}

// Create JWT for authorization
async function createJWT() {
    const jwtHeader = {
        alg: 'RS256',
        typ: 'JWT',
    };

    const jwtClaimSet = {
        iss: credentials.client_email,
        scope: 'https://www.googleapis.com/auth/cloud-platform',
        aud: 'https://oauth2.googleapis.com/token',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
    };

    const encodedHeader = btoa(JSON.stringify(jwtHeader));
    const encodedClaimSet = btoa(JSON.stringify(jwtClaimSet));

    const unsignedJWT = `${encodedHeader}.${encodedClaimSet}`;
    const signature = await signWithPrivateKey(unsignedJWT, credentials.private_key);
    
    return `${unsignedJWT}.${signature}`;
}

// Function to sign the JWT with the private key
async function signWithPrivateKey(unsignedJWT, privateKey) {
    const crypto = window.crypto || window.msCrypto;
    const privateKeyObj = await crypto.subtle.importKey(
        'pkcs8',
        privateKey,
        { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' } },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        privateKeyObj,
        new TextEncoder().encode(unsignedJWT)
    );

    return btoa(String.fromCharCode(...new Uint8Array(signature)));
}
