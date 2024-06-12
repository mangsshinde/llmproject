const container = document.getElementById("container");
function handleSubmit(text, audio) {
    const formData = new FormData();

    if (text) {
        formData.append('text', text);
    }

    if (audio) {
        formData.append('audio', audio);
    }

    fetch('/submit_data', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
    return response.json().then(data => {
        const fullResponse = data.response.text;
        const responseContainer = document.getElementById('response-container');
        
        const responseItem = document.createElement('div');
        responseItem.className = 'response-item';
        responseItem.style.display = 'flex';
        
        
        // Create radio button for each response
        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.className = 'response-radio';
        radioButton.value = fullResponse;
        radioButton.name = 'responseGroup';

        const responseField = document.createElement('p');
        responseField.textContent = fullResponse;
        responseField.style.textAlign = 'justify';

        responseItem.appendChild(radioButton);
        responseItem.appendChild(responseField);

        const queryField = document.createElement('p');
        queryField.textContent = text;
        queryField.style.textAlign = 'right';
        queryField.style.marginRight = '10px';

        responseItem.style.marginRight = '60px';
        responseContainer.appendChild(queryField);
        responseContainer.appendChild(responseItem);
        
        // Add functionality for the download button
        const downloadButton = document.getElementById('download-btn');
        downloadButton.addEventListener('click', function() {
            const checkedRadioButton = document.querySelector('.response-radio:checked');
            if (checkedRadioButton) {
                const docxContent = generateDocx([checkedRadioButton.value]);
                downloadDocx(docxContent, 'response.doc');
            } else {
                // No response selected
                alert('Please select a response.');
            }
        });
    });
    })
    

    .then(data => {
        // Handle response from server if needed
        console.log("Response from server:", data);
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

// Function to convert selected responses to DOCX file content
function generateDocx(responses) {
    // Implement code to generate DOCX content based on selected responses
    // This can include constructing the DOCX file structure manually or using a library
    // For simplicity, let's assume the responses are added to a single paragraph in the DOCX
    const docxContent = responses.join('\n');
    return docxContent;
}

// Function to trigger file download
function downloadDocx(content, filename) {
    // Convert content to Blob
    const blob = new Blob([content], { type: 'application/ms-word' });

    //craete a temporary anchor element
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = filename;
    document.body.appendChild(anchor)
    anchor.click();
    URL.revokeObjectURL(anchor.href)
}
document.getElementById("textbox").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        const query = document.getElementById("textbox").value;
        handleSubmit(query, null); // Pass null for audio
    }
});

// Add event listener for form submission
document.getElementById("submitBtn").addEventListener("click", function() {
    const query = document.getElementById("textbox").value;
    handleSubmit(query, null); // Pass null for audio
});

// Add event listener for recording button
document.getElementById("mic").addEventListener("click", function() {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.maxDuration = 10000;

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        console.log("Recorded transcript:", transcript);
        handleSubmit(null, transcript); // Pass null for text
    };

    recognition.onerror = function(event) {
        console.error("Recognition error:", event.error);
    };
});