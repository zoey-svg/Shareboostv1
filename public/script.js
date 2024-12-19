
    function toggleMenu() {
        const navLinks = document.querySelector('.nav-links');
        const hamburger = document.querySelector('.hamburger-menu');
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        hamburger.classList.toggle('open');
    }

    function showNotice() {
    Swal.fire({
        title: 'Notice',
        html: `
            <p>This tool is not for sale. Use it responsibly and avoid any misuse or abuse.</p>
            <p>If this tool is for sale, please contact me on <a href="https://facebook.com/100077070762554" target="_blank">Facebook</a>, and I will stop deploying it on this website.</p>
            <p>For your safety, it is recommended to use a dummy account to avoid suspension or restrictions on your personal account.</p>
            <p>Thank you for understanding and respecting the creator's efforts.</p>
        `,
        icon: 'info',
        confirmButtonText: 'Understood'
    });
    }

async function submitForm(event) {
    event.preventDefault();

    const cookiesInput = document.getElementById('cookies');
    const urlInput = document.getElementById('urls');
    const amountInput = document.getElementById('amounts');
    const intervalInput = document.getElementById('intervals');
    const button = document.getElementById('submit-button');

    const cookies = cookiesInput.value.trim();
    const url = urlInput.value.trim();
    const amount = parseInt(amountInput.value.trim(), 10);
    const interval = parseInt(intervalInput.value.trim(), 10);

    if (!cookies || !url || isNaN(amount) || isNaN(interval)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please fill out all fields!',
        });
        return;
    }

    try {
        button.disabled = true;

        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cookie: cookies,
                url: url,
                amount: amount,
                interval: interval
            })
        });

        if (!response.ok) throw new Error('Submission failed!');

        const data = await response.json();
        if (data.status !== 200) throw new Error('Sharing failed!');

        let remainingShares = amount;

        Swal.fire({
            title: 'Share Process',
            html: `<progress id="progress-bar" value="0" max="100"></progress><br><span id="countdown">Share count: ${remainingShares}</span>`,
            showCancelButton: false,
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                const progressBar = document.getElementById('progress-bar');
                const countdownElement = document.getElementById('countdown');

                const shareInterval = setInterval(() => {
                    remainingShares--;
                    const progressPercentage = ((amount - remainingShares) / amount) * 100;
                    progressBar.value = progressPercentage;
                    countdownElement.textContent = `Remaining shares: ${remainingShares}`;

                    if (remainingShares <= 0) {
                        clearInterval(shareInterval);
                        countdownElement.textContent = 'All shares completed.';
                        Swal.fire({
                            title: 'Success!',
                            text: 'All shares have been completed!',
                            icon: 'success',
                            confirmButtonText: 'Cool'
                        });
                    }
                }, interval * 1000);
            }
        });

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred. Please try again!',
        });
        console.error(error);
    } finally {
        button.disabled = false;
    }
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('time').textContent = `Time: ${timeString}`;
}
setInterval(updateTime, 1000);

async function measurePing() {
    const start = performance.now();
    await fetch(window.location.href);
    const end = performance.now();
    const ping = Math.round(end - start);
    document.getElementById('ping').textContent = `Ping: ${ping} ms`;
}
setInterval(measurePing, 1000);