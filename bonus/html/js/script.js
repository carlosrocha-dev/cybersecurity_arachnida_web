document.addEventListener('DOMContentLoaded', function () {
    const spiderForm = document.getElementById('spiderForm');
    const spiderResult = document.getElementById('spiderResult');
    const scorpionForm = document.getElementById('scorpionForm');
    const scorpionResult = document.getElementById('scorpionResult');

    spiderForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const url = document.getElementById('spiderUrl').value;
        const depth = document.getElementById('spiderDepth').value;

        fetch(`/spider?url=${encodeURIComponent(url)}&depth=${encodeURIComponent(depth)}`)
            .then(response => handleResponse(response))
            .then(data => {
                spiderResult.textContent = JSON.stringify(data, null, 2);
            })
            .catch(error => {
                console.error('Error:', error);
                spiderResult.textContent = 'Error: ' + error.message;
            });
    });

    scorpionForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const files = document.getElementById('scorpionFiles').files;
        const mode = document.getElementById('scorpionMode').value;
        const key = document.getElementById('scorpionKey').value;
        const value = document.getElementById('scorpionValue').value;

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        formData.append('mode', mode);
        formData.append('key', key);
        formData.append('value', value);

        fetch('/scorpion', {
            method: 'POST',
            body: formData,
        })
            .then(response => handleResponse(response))
            .then(data => {
                scorpionResult.textContent = JSON.stringify(data, null, 2);
            })
            .catch(error => {
                console.error('Error:', error);
                scorpionResult.textContent = 'Error: ' + error.message;
            });
    });

    function handleResponse(response) {
        console.log('Response:', response);
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error('Network response was not ok: ' + text);
            });
        }

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        } else {
            return response.text().then(text => {
                throw new Error('Expected JSON, got ' + contentType + ': ' + text);
            });
        }
    }
});
