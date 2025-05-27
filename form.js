// feedback.js - GitHub Feedback Form Logic

// DOM Elements
const feedbackForm = document.getElementById('githubFeedbackForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const feedbackTypeSelect = document.getElementById('feedbackType');
const messageTextarea = document.getElementById('message');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');
const successMessage = document.getElementById('successMessage');

// Form submission handler
function handleSubmit(e) {
    e.preventDefault();
    
    // Reset error messages
    hideAllErrors();
    
    // Get form values
    const formData = getFormData();
    
    // Validate form
    if (!validateForm(formData)) {
        return;
    }
    
    // Process form submission
    submitFeedback(formData);
}

// Get form data
function getFormData() {
    return {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        feedbackType: feedbackTypeSelect.value,
        message: messageTextarea.value.trim(),
        timestamp: new Date().toISOString()
    };
}

// Validate form inputs
function validateForm(formData) {
    let isValid = true;
    
    if (!formData.name) {
        showError(nameError);
        isValid = false;
    }
    
    if (!formData.email || !isValidEmail(formData.email)) {
        showError(emailError);
        isValid = false;
    }
    
    if (!formData.message) {
        showError(messageError);
        isValid = false;
    }
    
    return isValid;
}

// Email validation helper
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Error handling
function showError(errorElement) {
    errorElement.style.display = 'block';
}

function hideAllErrors() {
    [nameError, emailError, messageError].forEach(el => {
        el.style.display = 'none';
    });
}

// Submit feedback (demo version)
function submitFeedback(formData) {
    console.log('Submitting feedback:', formData);
    
    // Demo: Show success message
    showSuccess();
    
    /* 
    // REAL IMPLEMENTATION OPTIONS:
    
    // 1. Send to your own backend
    sendToBackend(formData);
    
    // OR
    
    // 2. Create GitHub issue
    createGitHubIssue(formData);
    */
}

// Show success message
function showSuccess() {
    feedbackForm.style.display = 'none';
    successMessage.style.display = 'block';
}

// Example: Send to backend
function sendToBackend(formData) {
    fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(handleResponse)
    .catch(handleError);
}

// Example: Create GitHub Issue
function createGitHubIssue(formData) {
    const repoOwner = 'your-username';
    const repoName = 'your-repo';
    const token = 'your-github-token'; // In production, use environment variables
    
    const issueTitle = `Feedback: ${formData.feedbackType} from ${formData.name}`;
    const issueBody = formatIssueBody(formData);
    
    fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/issues`, {
        method: 'POST',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
            title: issueTitle,
            body: issueBody,
            labels: ['feedback']
        })
    })
    .then(handleResponse)
    .catch(handleError);
}

// Format GitHub issue body
function formatIssueBody(formData) {
    return `**From:** ${formData.name} <${formData.email}>\n\n` +
           `**Type:** ${formData.feedbackType}\n\n` +
           `**Message:**\n${formData.message}\n\n` +
           `_Submitted at: ${formData.timestamp}_`;
}

// Handle API response
function handleResponse(response) {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json().then(data => {
        console.log('Success:', data);
        showSuccess();
    });
}

// Handle errors
function handleError(error) {
    console.error('Error:', error);
    alert('There was an error submitting your feedback. Please try again.');
}

// Initialize form
function initFeedbackForm() {
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleSubmit);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initFeedbackForm);