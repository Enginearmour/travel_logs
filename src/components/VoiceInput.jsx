import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Mic, 
  MicOff, 
  Car, 
  Fuel, 
  UtensilsCrossed, 
  Building, 
  Receipt,
  Volume2,
  VolumeX
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const VoiceInput = ({ onAddExpense, onAddMileageEntry, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputType, setInputType] = useState('mileage'); // mileage, fuel, meal, accommodation, miscellaneous
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + ' ' + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Speech recognition error. Please try again.');
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const speak = (text) => {
    if (isSpeechEnabled && synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setIsListening(true);
      recognitionRef.current.start();
      
      const prompts = {
        mileage: "Please say your departure odometer reading, destination, and meeting details.",
        fuel: "Please say the fuel cost, location, and odometer reading.",
        meal: "Please say the meal cost, restaurant name, and who you're meeting with.",
        accommodation: "Please say the hotel cost, hotel name, and location.",
        miscellaneous: "Please say the expense amount, description, and business purpose."
      };
      
      speak(prompts[inputType]);
    } else {
      toast.error('Speech recognition not supported in this browser');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const processVoiceInput = async () => {
    if (!transcript.trim()) {
      toast.error('No voice input detected');
      return;
    }

    setIsProcessing(true);
    
    try {
      const processedData = parseVoiceInput(transcript, inputType);
      
      if (inputType === 'mileage') {
        await onAddMileageEntry(processedData);
        speak("Mileage entry added successfully");
      } else {
        await onAddExpense(processedData);
        speak("Expense added successfully");
      }
      
      setTranscript('');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      toast.error('Failed to process voice input');
      speak("Sorry, I couldn't process that. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const parseVoiceInput = (text, type) => {
    const lowerText = text.toLowerCase();
    
    // Extract numbers (amounts, odometer readings)
    const numbers = text.match(/\d+\.?\d*/g) || [];
    
    // Extract locations and names
    const words = text.split(' ');
    
    const baseData = {
      date: format(new Date(), 'yyyy-MM-dd'),
      description: text
    };

    switch (type) {
      case 'mileage':
        return {
          ...baseData,
          startOdometer: numbers[0] ? parseInt(numbers[0]) : 0,
          endOdometer: numbers[1] ? parseInt(numbers[1]) : 0,
          startLocation: extractLocation(text, 'from') || 'Home Office',
          endLocation: extractLocation(text, 'to') || 'Client Location',
          businessPurpose: extractPurpose(text) || 'Business meeting',
          attendees: extractAttendees(text) || 'Client'
        };
        
      case 'fuel':
        return {
          ...baseData,
          type: 'fuel',
          category: 'Fuel',
          amount: numbers[0] ? parseFloat(numbers[0]) : 0,
          title: extractLocation(text, 'at') || 'Gas Station',
          location: extractLocation(text, 'at') || 'Gas Station',
          odometerReading: numbers[1] ? parseInt(numbers[1]) : 0
        };
        
      case 'meal':
        return {
          ...baseData,
          type: 'meal',
          category: 'Meals',
          amount: numbers[0] ? parseFloat(numbers[0]) : 0,
          title: extractRestaurant(text) || 'Business Meal',
          location: extractRestaurant(text) || 'Restaurant',
          attendees: extractAttendees(text) || 'Client',
          businessPurpose: extractPurpose(text) || 'Business meeting'
        };
        
      case 'accommodation':
        return {
          ...baseData,
          type: 'accommodation',
          category: 'Accommodation',
          amount: numbers[0] ? parseFloat(numbers[0]) : 0,
          title: extractHotel(text) || 'Hotel Stay',
          location: extractLocation(text, 'in') || 'City'
        };
        
      case 'miscellaneous':
        return {
          ...baseData,
          type: 'miscellaneous',
          category: 'Miscellaneous',
          amount: numbers[0] ? parseFloat(numbers[0]) : 0,
          title: extractExpenseType(text) || 'Business Expense',
          businessPurpose: extractPurpose(text) || 'Business purpose'
        };
        
      default:
        return baseData;
    }
  };

  const extractLocation = (text, preposition) => {
    const regex = new RegExp(`${preposition}\\s+([^,\\.]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : null;
  };

  const extractAttendees = (text) => {
    const withMatch = text.match(/with\s+([^,\\.]+)/i);
    const meetingMatch = text.match(/meeting\s+([^,\\.]+)/i);
    return withMatch ? withMatch[1].trim() : meetingMatch ? meetingMatch[1].trim() : null;
  };

  const extractPurpose = (text) => {
    const forMatch = text.match(/for\s+([^,\\.]+)/i);
    const purposeMatch = text.match(/purpose\s+([^,\\.]+)/i);
    return forMatch ? forMatch[1].trim() : purposeMatch ? purposeMatch[1].trim() : null;
  };

  const extractRestaurant = (text) => {
    const atMatch = text.match(/at\s+([^,\\.]+)/i);
    return atMatch ? atMatch[1].trim() : null;
  };

  const extractHotel = (text) => {
    const hotelMatch = text.match(/(hotel|inn|resort|motel)\s+([^,\\.]+)/i);
    return hotelMatch ? hotelMatch[0].trim() : null;
  };

  const extractExpenseType = (text) => {
    const expenseTypes = ['parking', 'toll', 'taxi', 'uber', 'supplies', 'equipment'];
    for (const type of expenseTypes) {
      if (text.toLowerCase().includes(type)) {
        return type.charAt(0).toUpperCase() + type.slice(1);
      }
    }
    return null;
  };

  const inputTypes = [
    { id: 'mileage', label: 'Mileage', icon: Car, color: 'from-blue-500 to-blue-600' },
    { id: 'fuel', label: 'Fuel', icon: Fuel, color: 'from-green-500 to-green-600' },
    { id: 'meal', label: 'Meals', icon: UtensilsCrossed, color: 'from-orange-500 to-orange-600' },
    { id: 'accommodation', label: 'Hotel', icon: Building, color: 'from-purple-500 to-purple-600' },
    { id: 'miscellaneous', label: 'Other', icon: Receipt, color: 'from-pink-500 to-pink-600' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass-card w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Voice Input</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
              className={`p-2 rounded-lg transition-all ${
                isSpeechEnabled ? 'text-green-400 hover:bg-green-500/20' : 'text-white/60 hover:bg-white/10'
              }`}
            >
              {isSpeechEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Input Type Selection */}
        <div className="mb-6">
          <h3 className="text-white/80 text-sm font-medium mb-3">Select Input Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {inputTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setInputType(type.id)}
                className={`p-4 rounded-xl transition-all ${
                  inputType === type.id
                    ? `bg-gradient-to-r ${type.color} text-white`
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                <type.icon className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Input Area */}
        <div className="mb-6">
          <div className="bg-white/5 rounded-xl p-6 min-h-[120px] border border-white/10">
            {transcript ? (
              <p className="text-white text-lg leading-relaxed">{transcript}</p>
            ) : (
              <p className="text-white/40 text-center">
                {isListening ? 'Listening... Speak now' : 'Click the microphone to start speaking'}
              </p>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span>{isListening ? 'Stop Listening' : 'Start Listening'}</span>
          </button>

          {transcript && (
            <button
              onClick={processVoiceInput}
              disabled={isProcessing}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isProcessing ? 'Processing...' : 'Add Entry'}</span>
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl">
          <h4 className="text-white font-medium mb-2">Voice Input Examples:</h4>
          <div className="text-white/60 text-sm space-y-1">
            {inputType === 'mileage' && (
              <p>• "Odometer 45230 to ABC Corp Toronto meeting with John Smith for contract discussion"</p>
            )}
            {inputType === 'fuel' && (
              <p>• "65 dollars at Shell gas station odometer 45280"</p>
            )}
            {inputType === 'meal' && (
              <p>• "85 dollars at The Keg restaurant with Sarah Johnson for business lunch"</p>
            )}
            {inputType === 'accommodation' && (
              <p>• "189 dollars Hilton hotel in downtown Toronto"</p>
            )}
            {inputType === 'miscellaneous' && (
              <p>• "15 dollars parking fee for client meeting"</p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VoiceInput;
