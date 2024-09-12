// Fetch API key securely from the environment variable (from config.js)
const chatbox = document.getElementById('chatbox');

// Function to toggle the request summary visibility
function toggleRequestSummary() {
    const requestSummary = document.getElementById('requestSummary');
    requestSummary.classList.toggle('hidden');

    // Toggle display between 'none' and 'block'
    if (requestSummary.classList.contains('hidden')) {
        requestSummary.style.display = 'none';
    } else {
        requestSummary.style.display = 'block';
    }
}

// Pre-loaded data from your resume
const resumeData = {
    name: "Daniel Eduardo Lam He",
    education: "Bachelor's in Computer Science at Texas A&M University (GPA: 3.9), Expected Graduation: Dec 2025",
    experience: [
        {
            company: "Amazon",
            title: "Software Development Intern",
            duration: "May 2024 – August 2024",
            description: "Improved data retrieval speed by 20% and reduced latency by 15% using AWS Lambda, SNS, SQS, and DynamoDB. Led development of a scalable full-stack web application using AWS tools and React."
        },
        {
            company: "Torres & Associates LLC",
            title: "Front-End Developer Intern",
            duration: "February 2024 – May 2024",
            description: "Designed a responsive data dashboard using Next.js, React.js, and Tailwind CSS, improving data visualization by 20%."
        },
        {
            company: "Center for Educational Technologies",
            title: "IT Technician",
            duration: "October 2023 – February 2024",
            description: "Resolved 95% of user tickets related to Moodle courses on Salesforce and automated processes using Python, increasing task completion by 50%."
        }
    ],
    skills: [
        "Python", "JavaScript", "React", "AWS Lambda", "DynamoDB", "Tailwind CSS", "TypeScript", "Git"
    ],
    projects: [
        {
            name: "College Social Media DoorC",
            description: "Developed backend with Python Django REST API and Firebase for a college forum application."
        },
        {
            name: "Jobs4Ags (HowdyHack 2023)",
            description: "Built a web app for streamlined job searches using React.js, with real-time data fetching and team collaboration."
        }
    ]
};

// Cohere API Key
// If you need the api_key, let me know. I'm not adding it to the github for security reasons.
const apiKey = "yJCMmWFxYdqJTHSQdQ1WjScq043nvU73cjXnEqLM";  // Replace with your actual Cohere API key. 

function sendMessage() {
    const userInput = document.getElementById('userInput');
    const userMessage = userInput.value.trim();
    
    if (userMessage === '') return;

    addMessage('user-message', userMessage);

    setTimeout(() => {
        // Combine user message with resume data to provide context for Cohere
        const context = generateResumeContext();
        getCohereResponse(userMessage, context);
    }, 500);

    userInput.value = '';
}

function addMessage(className, message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;
    messageElement.textContent = message;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Generate context from the user's resume to pass along with the user's message
function generateResumeContext() {
    return `
    Daniel Eduardo Lam He's Resume Information:
    
    Name: ${resumeData.name}
    Education: ${resumeData.education}
    Experience: ${resumeData.experience.map(exp => `${exp.title} at ${exp.company}, ${exp.duration}: ${exp.description}`).join("\n")}
    Skills: ${resumeData.skills.join(", ")}
    Projects: ${resumeData.projects.map(proj => `${proj.name}: ${proj.description}`).join("\n")}
    
    Now answer the user's question based on the above information in less than 250 tokens. Be concise and provide relevant information. Don't mention that you analyzed my resume.
    `;
}

// Query Cohere API with the user's message and the resume context
function getCohereResponse(userMessage, resumeContext) {
    const url = 'https://api.cohere.ai/generate';  // Cohere text generation endpoint

    const combinedMessage = `User's question: "${userMessage}"\n\n${resumeContext}`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'command-xlarge-nightly',  // Correct model for text generation
            prompt: combinedMessage,
            max_tokens: 300,  // Still limiting to 300 tokens for output
            temperature: 0.7,  // Controls creativity/randomness in responses
            api_version: '2022-12-06'  // Explicitly set the version to avoid deprecation warnings
        }),
    })
    .then(response => response.json())
    .then(data => {
        const botResponse = data.text;
        addMessage('bot-message', botResponse);
    })
    .catch(() => {
        addMessage('bot-message', "I'm having trouble connecting to the chatbot service.");
    });
}

// Open the Navbar
function openNavbar() {
    const navbar = document.getElementById('navbar-links');
    navbar.classList.add('visible');
    navbar.classList.remove('hidden');
}

// Hide the Navbar
function hideNavbar() {
    const navbar = document.getElementById('navbar-links');
    navbar.classList.add('hidden');
    navbar.classList.remove('visible');
}

// Toggle Stylesheet (for night mode, for example)
function toggleStyleSheet() {
    const toggleSwitch = document.getElementById('toggle-switch');
    if (toggleSwitch.checked) {
        // Example of toggling a dark mode stylesheet
        document.body.style.backgroundColor = '#333';
        document.body.style.color = '#fff';
    } else {
        // Revert to default
        document.body.style.backgroundColor = '#fff';
        document.body.style.color = '#000';
    }
}