import { toast } from "react-toastify";

let listenersAttached = false;

export const enableMicStream = async (setMicStream, setViolations) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (setMicStream) setMicStream(stream);
    toast.success("Mic access granted.");

    const audioContext = new AudioContext();
    const micSource = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.8;

    micSource.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const frequencyData = new Float32Array(bufferLength);

    let lastViolationTime = 0;
    const DECIBEL_THRESHOLD = -40;
    const VIOLATION_INTERVAL = 5000;

    const minFrequency = 800;
    const maxFrequency = 3500;

    const checkPitch = () => {
      analyser.getFloatFrequencyData(frequencyData);

      const sampleRate = audioContext.sampleRate;
      const binSize = sampleRate / analyser.fftSize;

      const minIndex = Math.floor(minFrequency / binSize);
      const maxIndex = Math.ceil(maxFrequency / binSize);
      const detectedDBs = frequencyData.slice(minIndex, maxIndex);
      console.log("Pitch range dB sample:", detectedDBs);

      const now = Date.now();

      const isLoudPitch = frequencyData
        .slice(minIndex, maxIndex)
        .some((db) => db > DECIBEL_THRESHOLD);

      if (isLoudPitch && now - lastViolationTime > VIOLATION_INTERVAL) {
        lastViolationTime = now;
        toast.warn(
          `Pitch detected in ${minFrequency}-${maxFrequency}Hz (>30dB)`
        );
        setViolations?.((prev) => ({
          ...prev,
          webcamViolation: (prev.webcamViolation || 0) + 1,
        }));
      }

      requestAnimationFrame(checkPitch);
    };

    checkPitch();
  } catch (err) {
    toast.warn("Mic permission denied.");
    setViolations?.((prev) => ({
      ...prev,
      webcamViolation: (prev.webcamViolation || 0) + 1,
    }));
  }
};

export const monitorTabSwitch = (setViolations) => {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      setViolations((prev) => ({
        ...prev,
        tabSwitchingViolation: prev.tabSwitchingViolation + 1,
      }));
    }
  });
};

export const detectDevTools = (setViolations) => {
  let triggered = false;
  const threshold = 160;
  setInterval(() => {
    const start = performance.now();
    debugger;
    const end = performance.now();
    if (end - start > threshold && !triggered) {
      triggered = true;
      setViolations((prev) => ({
        ...prev,
        devtoolsViolation: prev.devtoolsViolation + 1,
      }));
    }
  }, 1000);
};
