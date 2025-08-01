import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Check,
  X,
  AlertTriangle,
  Wifi,
  WifiOff,
  Monitor,
  Smartphone,
  Headphones,
  Camera,
  Settings,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import {
  isVideoConsultationSupported,
  getBrowserInfo,
  getUserMedia,
  getSystemRequirements,
} from "../utils/webrtcUtils";

const DeviceTest = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = searchParams.get("roomId");

  const [testResults, setTestResults] = useState({
    browser: false,
    camera: false,
    microphone: false,
    speakers: false,
    network: false,
  });

  const [currentTest, setCurrentTest] = useState("browser");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [testAudio, setTestAudio] = useState(null);

  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const dataArrayRef = useRef(null);

  const tests = [
    { id: "browser", name: "Browser Compatibility", icon: Monitor },
    { id: "camera", name: "Camera Test", icon: Camera },
    { id: "microphone", name: "Microphone Test", icon: Mic },
    { id: "speakers", name: "Speaker Test", icon: Headphones },
    { id: "network", name: "Network Test", icon: Wifi },
  ];

  useEffect(() => {
    runTests();
  }, []);

  useEffect(() => {
    if (localStream && videoRef.current) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const runTests = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Test 1: Browser Compatibility
      await testBrowserCompatibility();

      // Test 2: Camera
      await testCamera();

      // Test 3: Microphone
      await testMicrophone();

      // Test 4: Speakers
      await testSpeakers();

      // Test 5: Network
      await testNetwork();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testBrowserCompatibility = async () => {
    setCurrentTest("browser");
    const isSupported = isVideoConsultationSupported();
    const browserInfo = getBrowserInfo();

    setTestResults((prev) => ({
      ...prev,
      browser: isSupported,
    }));

    if (!isSupported) {
      throw new Error(
        `Browser not supported: ${browserInfo.browser} ${browserInfo.version}`
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const testCamera = async () => {
    setCurrentTest("camera");

    try {
      const stream = await getUserMedia({ video: true, audio: false });
      setLocalStream(stream);

      setTestResults((prev) => ({
        ...prev,
        camera: true,
      }));

      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (err) {
      setTestResults((prev) => ({
        ...prev,
        camera: false,
      }));
      throw new Error("Camera access denied or not available");
    }
  };

  const testMicrophone = async () => {
    setCurrentTest("microphone");

    try {
      const stream = await getUserMedia({ video: false, audio: true });

      // Set up audio analysis
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current =
        audioContextRef.current.createMediaStreamSource(stream);

      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      // Start monitoring audio levels
      const checkAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          const average =
            dataArrayRef.current.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average);

          if (average > 10) {
            setTestResults((prev) => ({
              ...prev,
              microphone: true,
            }));
            return;
          }

          requestAnimationFrame(checkAudioLevel);
        }
      };

      checkAudioLevel();

      // Stop the stream after 3 seconds
      setTimeout(() => {
        stream.getTracks().forEach((track) => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      }, 3000);

      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (err) {
      setTestResults((prev) => ({
        ...prev,
        microphone: false,
      }));
      throw new Error("Microphone access denied or not available");
    }
  };

  const testSpeakers = async () => {
    setCurrentTest("speakers");

    try {
      // Create a simple test tone
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);

      setTestResults((prev) => ({
        ...prev,
        speakers: true,
      }));

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      setTestResults((prev) => ({
        ...prev,
        speakers: false,
      }));
      throw new Error("Speaker test failed");
    }
  };

  const testNetwork = async () => {
    setCurrentTest("network");

    try {
      // Simple network test - try to fetch a small resource
      const startTime = Date.now();
      const response = await fetch("https://www.google.com/favicon.ico", {
        method: "HEAD",
        mode: "no-cors",
      });
      const endTime = Date.now();

      const latency = endTime - startTime;

      setTestResults((prev) => ({
        ...prev,
        network: latency < 5000, // Consider network good if response time < 5 seconds
      }));

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      setTestResults((prev) => ({
        ...prev,
        network: false,
      }));
      throw new Error("Network connection test failed");
    }
  };

  const getTestStatus = (testId) => {
    if (currentTest === testId && isLoading) {
      return "running";
    }
    return testResults[testId] ? "passed" : "failed";
  };

  const getTestIcon = (testId) => {
    const status = getTestStatus(testId);
    const IconComponent = tests.find((t) => t.id === testId)?.icon || Settings;

    switch (status) {
      case "running":
        return <RefreshCw className="animate-spin" size={20} />;
      case "passed":
        return <Check className="text-green-500" size={20} />;
      case "failed":
        return <X className="text-red-500" size={20} />;
      default:
        return <IconComponent size={20} />;
    }
  };

  const getSystemRequirements = () => {
    return {
      browser: {
        chrome: "Version 60 or higher",
        firefox: "Version 55 or higher",
        safari: "Version 11 or higher",
        edge: "Version 79 or higher",
      },
      network: "Stable internet connection (minimum 1 Mbps)",
      hardware: {
        camera: "HD camera (720p or higher recommended)",
        microphone: "Built-in or external microphone",
        speakers: "Built-in or external speakers/headphones",
      },
    };
  };

  const allTestsPassed = Object.values(testResults).every((result) => result);
  const browserInfo = getBrowserInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Device Test
          </h1>
          <p className="text-gray-600">
            Testing your devices for video consultation compatibility
          </p>
          {roomId && (
            <p className="text-sm text-gray-500 mt-2">
              Room ID:{" "}
              <span className="font-mono bg-gray-200 px-2 py-1 rounded">
                {roomId}
              </span>
            </p>
          )}
        </div>

        {/* Test Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {tests.map((test) => (
            <div
              key={test.id}
              className={`bg-white rounded-xl p-6 shadow-lg border-2 transition-all ${
                getTestStatus(test.id) === "running"
                  ? "border-blue-300 bg-blue-50"
                  : getTestStatus(test.id) === "passed"
                  ? "border-green-300 bg-green-50"
                  : getTestStatus(test.id) === "failed"
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getTestIcon(test.id)}
                  <h3 className="font-semibold text-gray-900">{test.name}</h3>
                </div>
              </div>

              <div className="space-y-2">
                {test.id === "microphone" &&
                  getTestStatus(test.id) === "running" && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-100"
                        style={{ width: `${(audioLevel / 255) * 100}%` }}
                      ></div>
                    </div>
                  )}

                {getTestStatus(test.id) === "passed" && (
                  <p className="text-green-600 text-sm font-medium">
                    ✓ Working properly
                  </p>
                )}

                {getTestStatus(test.id) === "failed" && (
                  <p className="text-red-600 text-sm font-medium">
                    ✗ Issue detected
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Video Preview */}
        {localStream && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Camera size={20} />
              Camera Preview
            </h3>
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-w-md mx-auto rounded-lg border-2 border-gray-200"
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                Live Preview
              </div>
            </div>
          </div>
        )}

        {/* Browser Information */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Monitor size={20} />
            Browser Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Browser</p>
              <p className="font-medium">{browserInfo.browser}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Version</p>
              <p className="font-medium">{browserInfo.version}</p>
            </div>
          </div>
        </div>

        {/* System Requirements */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Settings size={20} />
            System Requirements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Browser Requirements
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Chrome: Version 60 or higher</li>
                <li>• Firefox: Version 55 or higher</li>
                <li>• Safari: Version 11 or higher</li>
                <li>• Edge: Version 79 or higher</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Hardware Requirements
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• HD camera (720p or higher)</li>
                <li>• Built-in or external microphone</li>
                <li>• Speakers or headphones</li>
                <li>• Stable internet connection</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="text-red-500" size={20} />
              <h3 className="font-semibold text-red-800">Test Error</h3>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={runTests}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw
              className={`${isLoading ? "animate-spin" : ""}`}
              size={20}
            />
            {isLoading ? "Running Tests..." : "Run Tests Again"}
          </button>

          {allTestsPassed && roomId && (
            <button
              onClick={() => navigate(`/consultation/${roomId}`)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowRight size={20} />
              Proceed to Consultation
            </button>
          )}

          <button
            onClick={() => navigate("/my-appointments")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Appointments
          </button>
        </div>

        {/* Test Status Summary */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg">
            <span className="text-sm font-medium text-gray-700">
              Test Status:
            </span>
            {allTestsPassed ? (
              <span className="flex items-center gap-1 text-green-600 font-semibold">
                <Check size={16} />
                All Tests Passed
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-600 font-semibold">
                <X size={16} />
                Some Tests Failed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceTest;
