// Get the result element where transcribed text will be displayed
const resultElement = document.getElementById("result");
let recognition;

function startConverting() {
    // Check if the browser supports the Web Speech API
    if ('webkitSpeechRecognition' in window) {
        // Create a new recognition instance
        recognition = new webkitSpeechRecognition();
        setupRecognition(recognition);
        
        try {
            recognition.start();
            console.log("Speech recognition started");
        } catch (error) {
            console.error("Error starting speech recognition:", error);
        }
    } else if ('SpeechRecognition' in window) {
        // Try standard Speech Recognition API
        recognition = new SpeechRecognition();
        setupRecognition(recognition);
        
        try {
            recognition.start();
            console.log("Speech recognition started");
        } catch (error) {
            console.error("Error starting speech recognition:", error);
        }
    } else {
        console.error("Speech Recognition API is not supported in this browser.");
        if (resultElement) {
            resultElement.innerHTML = "Speech Recognition not supported in this browser. Please try Chrome.";
        }
    }
}

function setupRecognition(recognition) {
    // Configure recognition settings
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // Handle recognition results
    recognition.onresult = function(event) {
        if (!event.results) {
            console.error("No results property found in event");
            return;
        }
        
        const { finalTranscript, interTranscript } = processResult(event.results);
        
        if (resultElement) {
            resultElement.innerHTML = finalTranscript + ' ' + interTranscript;
        } else {
            console.error("Result element not found");
        }
    };

    // Handle errors
    recognition.onerror = function(event) {
        console.error("Speech Recognition Error:", event.error);
        if (resultElement) {
            resultElement.innerHTML = "Error: " + event.error;
        }
    };

    // Handle recognition end
    recognition.onend = function() {
        console.log("Speech recognition ended.");
    };
}

function processResult(results) {
    let finalTranscript = '';
    let interTranscript = '';

    try {
        for (let i = 0; i < results.length; i++) {
            if (!results[i][0]) continue;
            
            let transcript = results[i][0].transcript || '';
            transcript = transcript.replace(/\n/g, " ").trim();

            if (results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interTranscript += transcript + ' ';
            }
        }
    } catch (error) {
        console.error("Error processing results:", error);
    }

    return {
        finalTranscript: finalTranscript.trim(),
        interTranscript: interTranscript.trim()
    };
}

function stopConverting() {
    if (recognition) {
        try {
            recognition.stop();
            console.log("Speech recognition stopped");
        } catch (error) {
            console.error("Error stopping speech recognition:", error);
        }
    }
}