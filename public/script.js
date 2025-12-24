// Get DOM elements
const urlForm = document.getElementById('urlForm');
const urlInput = document.getElementById('urlInput');
const submitBtn = document.getElementById('submitBtn');
const resultDiv = document.getElementById('result');
const shortUrlInput = document.getElementById('shortUrl');
const copyBtn = document.getElementById('copyBtn');
const testBtn = document.getElementById('testBtn');
const analyticsBtn = document.getElementById('analyticsBtn');
const errorDiv = document.getElementById('error');
const analyticsCard = document.getElementById('analyticsCard');
const totalClicksSpan = document.getElementById('totalClicks');
const visitHistoryDiv = document.getElementById('visitHistory');

let currentShortID = null;

// Handle form submission
urlForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Reset UI
    hideError();
    hideResult();
    hideAnalytics();
    
    const longUrl = urlInput.value.trim();
    
    if (!longUrl) {
        showError('Please enter a URL');
        return;
    }
    
    // Validate URL format
    try {
        new URL(longUrl);
    } catch (err) {
        showError('Please enter a valid URL (must start with http:// or https://)');
        return;
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Shortening...</span>';
    
    try {
        const response = await fetch('/url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: longUrl })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to shorten URL');
        }
        
        // Success - show result
        currentShortID = data.id;
        const shortUrl = `${window.location.origin}/${data.id}`;
        shortUrlInput.value = shortUrl;
        showResult();
        
    } catch (error) {
        showError(error.message || 'An error occurred. Please try again.');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Shorten</span>';
    }
});

// Copy to clipboard
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(shortUrlInput.value);
        copyBtn.innerHTML = '<span>Copied!</span>';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
            copyBtn.innerHTML = '<span>Copy</span>';
            copyBtn.classList.remove('copied');
        }, 2000);
    } catch (err) {
        // Fallback for older browsers
        shortUrlInput.select();
        document.execCommand('copy');
        copyBtn.innerHTML = '<span>Copied!</span>';
        setTimeout(() => {
            copyBtn.innerHTML = '<span>Copy</span>';
        }, 2000);
    }
});

// Test link
testBtn.addEventListener('click', () => {
    if (currentShortID) {
        window.open(`/${currentShortID}`, '_blank');
    }
});

// View analytics
analyticsBtn.addEventListener('click', async () => {
    if (!currentShortID) return;
    
    try {
        const response = await fetch(`/analytics/${currentShortID}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch analytics');
        }
        
        // Display analytics
        totalClicksSpan.textContent = data.totalClicks || 0;
        
        // Display visit history
        if (data.analytics && data.analytics.length > 0) {
            visitHistoryDiv.innerHTML = data.analytics.map(visit => {
                const date = new Date(visit.timestamp);
                const formattedDate = date.toLocaleString();
                return `
                    <div class="visit-item">
                        <span>Visit</span>
                        <span class="visit-time">${formattedDate}</span>
                    </div>
                `;
            }).join('');
        } else {
            visitHistoryDiv.innerHTML = '<p class="no-data">No visits yet</p>';
        }
        
        showAnalytics();
        
    } catch (error) {
        showError('Failed to load analytics: ' + error.message);
    }
});

// Helper functions
function showResult() {
    resultDiv.classList.remove('hidden');
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideResult() {
    resultDiv.classList.add('hidden');
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideError() {
    errorDiv.classList.add('hidden');
}

function showAnalytics() {
    analyticsCard.classList.remove('hidden');
    analyticsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideAnalytics() {
    analyticsCard.classList.add('hidden');
}

// Allow Enter key to submit
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        urlForm.dispatchEvent(new Event('submit'));
    }
});

