import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const useVoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        toast.success('Voice input started');
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Voice input error: ' + event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setTranscript('');
      recognition.start();
    } else {
      toast.error('Voice input not supported in this browser');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const parseVoiceInput = (text) => {
    const lowerText = text.toLowerCase();
    
    // Extract amount
    const amountMatch = lowerText.match(/(\$?\d+(?:\.\d{2})?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace('$', '')) : 0;
    
    // Extract category
    let category = 'Miscellaneous';
    if (lowerText.includes('fuel') || lowerText.includes('gas') || lowerText.includes('gasoline')) {
      category = 'Fuel';
    } else if (lowerText.includes('food') || lowerText.includes('restaurant') || lowerText.includes('meal') || lowerText.includes('lunch') || lowerText.includes('dinner')) {
      category = 'Meals';
    } else if (lowerText.includes('hotel') || lowerText.includes('accommodation') || lowerText.includes('lodging')) {
      category = 'Accommodation';
    } else if (lowerText.includes('taxi') || lowerText.includes('uber') || lowerText.includes('transport')) {
      category = 'Transportation';
    }
    
    // Extract description (remove amount and common words)
    let description = text.replace(/\$?\d+(?:\.\d{2})?/g, '').trim();
    description = description || `${category} expense`;
    
    return {
      amount,
      category,
      title: description,
      description: text
    };
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    parseVoiceInput,
    isSupported: !!recognition
  };
};
