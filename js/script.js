// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 60; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// API Gateway endpoint for contact form submissions
const CONTACT_FORM_API_URL = 'https://ov9ok9i1h8.execute-api.us-east-1.amazonaws.com/prod/contact';

// Form Validation and Submission
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous error messages
        clearErrors();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const company = document.getElementById('company').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();
        
        let isValid = true;
        
        // Validate name
        if (name === '') {
            showError('name-error', 'Name is required');
            isValid = false;
        }
        
        // Validate company
        if (company === '') {
            showError('company-error', 'Company is required');
            isValid = false;
        }
        
        // Validate email
        if (email === '') {
            showError('email-error', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email-error', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate phone (optional, but if provided, check format)
        if (phone !== '' && !isValidPhone(phone)) {
            showError('phone-error', 'Please enter a valid phone number');
            isValid = false;
        }
        
        // Validate message
        if (message === '') {
            showError('message-error', 'Message is required');
            isValid = false;
        } else if (message.length < 10) {
            showError('message-error', 'Message must be at least 10 characters long');
            isValid = false;
        }
        
        if (isValid) {
            // Submit form to API Gateway
            await submitContactForm({
                name: name,
                company: company,
                email: email,
                phone: phone,
                message: message
            });
        }
    });
}

// Submit contact form to API Gateway
async function submitContactForm(formData) {
    const submitButton = contactForm.querySelector('.btn-submit');
    const originalButtonText = submitButton ? submitButton.textContent : 'Send Message';
    
    // Disable submit button and show loading state
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
    }
    
    // Hide any previous messages
    const formMessage = document.getElementById('form-message');
    if (formMessage) {
        formMessage.style.display = 'none';
    }
    
    try {
        // Check if API URL is configured
        if (CONTACT_FORM_API_URL.includes('YOUR_API_GATEWAY_URL_HERE')) {
            throw new Error('API Gateway URL not configured. Please update CONTACT_FORM_API_URL in script.js');
        }
        
        const response = await fetch(CONTACT_FORM_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Success - show success message and reset form
            showSuccessMessage(data.message || 'Thank you for your interest! We will contact you soon.');
            contactForm.reset();
        } else {
            // Error response from API
            const errorMessage = data.error || 'Failed to send message. Please try again later.';
            showErrorMessage(errorMessage);
        }
    } catch (error) {
        console.error('Error submitting contact form:', error);
        
        // Handle network errors or other exceptions
        let errorMessage = 'Failed to send message. Please check your connection and try again.';
        
        if (error.message.includes('API Gateway URL not configured')) {
            errorMessage = 'Contact form is not yet configured. Please contact the site administrator.';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Network error. Please check your connection and try again.';
        }
        
        showErrorMessage(errorMessage);
    } finally {
        // Re-enable submit button
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    }
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation helper (basic validation)
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Show error message
function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Clear all error messages
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
    
    const formMessage = document.getElementById('form-message');
    if (formMessage) {
        formMessage.classList.remove('success', 'error');
        formMessage.style.display = 'none';
    }
}

// Show success message
function showSuccessMessage(message) {
    const formMessage = document.getElementById('form-message');
    if (formMessage) {
        formMessage.textContent = message || 'Thank you for your interest! We will contact you soon.';
        formMessage.classList.remove('error');
        formMessage.classList.add('success');
        formMessage.style.display = 'block';
        
        // Scroll to success message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// Show error message
function showErrorMessage(message) {
    const formMessage = document.getElementById('form-message');
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.classList.remove('success');
        formMessage.classList.add('error');
        formMessage.style.display = 'block';
        
        // Scroll to error message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Cost Calculator - Calculate AWS infrastructure costs based on usage
const LAMBDA_PRICING_PER_GB_SECOND = 0.0000166667;
const LOGS_INGESTION_PER_GB = 0.50;
const LOGS_FREE_TIER_GB = 5;
const SECRETS_MANAGER_COST = 1.20;
const S3_OTHER_COST = 0.01;

// Calculate sync cycles per day based on time period and frequency
function calculateSyncCyclesPerDay(timePeriod, frequencyMinutes) {
    const minutesInPeriod = timePeriod === '24h' ? 1440 : 540; // 24 hours or 9 hours (540 min)
    return Math.floor(minutesInPeriod / frequencyMinutes);
}

// Cost calculation formulas based on empirical data
function calculateLambdaCost(recordsPerSync, syncsPerMonth) {
    // Duration formula: Duration (seconds) = 33.77 + (6.37 × N)
    const durationSeconds = 33.77 + (6.37 * recordsPerSync);
    
    // Memory formula: Memory (GB) = 0.352 + (0.028 × N), capped at 1.0 GB
    const memoryGB = Math.min(0.352 + (0.028 * recordsPerSync), 1.0);
    
    // Cost per invocation: Duration × Memory × Pricing
    const costPerInvocation = durationSeconds * memoryGB * LAMBDA_PRICING_PER_GB_SECOND;
    
    // Monthly cost
    const monthlyCost = costPerInvocation * syncsPerMonth;
    
    return {
        costPerInvocation,
        monthlyCost,
        durationSeconds,
        memoryGB
    };
}

function calculateLogsCost(recordsPerSync, syncsPerMonth) {
    // Log size per run: base ~5 MB + ~0.75 MB per record
    const logSizeMBPerRun = 5 + (0.75 * recordsPerSync);
    
    // Monthly log volume in GB
    const monthlyLogVolumeGB = (logSizeMBPerRun * syncsPerMonth) / 1024;
    
    // Ingestion cost (first 5 GB free)
    const billableGB = Math.max(0, monthlyLogVolumeGB - LOGS_FREE_TIER_GB);
    const ingestionCost = billableGB * LOGS_INGESTION_PER_GB;
    
    // Storage cost is negligible with 3-day retention (~$0.003/GB/month)
    const storageCost = monthlyLogVolumeGB * 0.003;
    
    return {
        monthlyCost: ingestionCost + storageCost,
        ingestionCost,
        storageCost,
        monthlyLogVolumeGB,
        logSizeMBPerRun
    };
}

function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
}

function updateCostCalculator() {
    const recordsPerDayInput = document.getElementById('records-per-day');
    const syncTimePeriodSelect = document.getElementById('sync-time-period');
    const syncFrequencySelect = document.getElementById('sync-frequency');
    
    if (!recordsPerDayInput || !syncTimePeriodSelect || !syncFrequencySelect) return;
    
    const recordsPerDay = parseFloat(recordsPerDayInput.value) || 0;
    const timePeriod = syncTimePeriodSelect.value; // '9h' or '24h'
    const frequencyMinutes = parseFloat(syncFrequencySelect.value) || 15;
    
    // Validate inputs
    if (recordsPerDay < 0) {
        return;
    }
    
    // Calculate sync cycles per day based on time period and frequency
    const syncCyclesPerDay = calculateSyncCyclesPerDay(timePeriod, frequencyMinutes);
    
    // Calculate records per sync cycle
    const recordsPerSync = recordsPerDay / syncCyclesPerDay;
    const syncsPerMonth = syncCyclesPerDay * 30;
    
    // Calculate costs
    const lambdaCosts = calculateLambdaCost(recordsPerSync, syncsPerMonth);
    const logsCosts = calculateLogsCost(recordsPerSync, syncsPerMonth);
    const totalCost = lambdaCosts.monthlyCost + logsCosts.monthlyCost + SECRETS_MANAGER_COST + S3_OTHER_COST;
    
    // Update display
    document.getElementById('lambda-cost').textContent = formatCurrency(lambdaCosts.monthlyCost);
    document.getElementById('logs-cost').textContent = formatCurrency(logsCosts.monthlyCost);
    document.getElementById('total-cost').textContent = formatCurrency(totalCost);
    
    // Update details
    document.getElementById('records-per-sync').textContent = recordsPerSync.toFixed(2);
    document.getElementById('syncs-per-month').textContent = syncsPerMonth.toLocaleString();
    document.getElementById('exec-time').textContent = `${lambdaCosts.durationSeconds.toFixed(1)}s`;
    
    // Update summary section
    const infraCostElement = document.getElementById('infrastructure-cost');
    const monthlyTotalElement = document.getElementById('monthly-total');
    
    if (infraCostElement) {
        infraCostElement.textContent = `~${formatCurrency(totalCost)}/month`;
    }
    if (monthlyTotalElement) {
        monthlyTotalElement.textContent = `~${formatCurrency(totalCost)}/month`;
    }
}

// Initialize cost calculator on page load
document.addEventListener('DOMContentLoaded', () => {

    // Set up cost calculator event listeners
    const recordsPerDayInput = document.getElementById('records-per-day');
    const syncTimePeriodSelect = document.getElementById('sync-time-period');
    const syncFrequencySelect = document.getElementById('sync-frequency');
    
    if (recordsPerDayInput && syncTimePeriodSelect && syncFrequencySelect) {
        // Calculate on input change
        recordsPerDayInput.addEventListener('input', updateCostCalculator);
        syncTimePeriodSelect.addEventListener('change', updateCostCalculator);
        syncFrequencySelect.addEventListener('change', updateCostCalculator);
        
        // Calculate on page load with default values
        updateCostCalculator();
    }
    
    // Add animation on scroll (optional enhancement)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for fade-in animation
    const animatedElements = document.querySelectorAll('.problem-card, .feature-card, .benefit-item, .customization-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

