import { toast } from "react-toastify";

let listenersAttached = false;
let rightClickToastShown = false;

export const enableMicStream = async (setMicStream, setViolations) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (setMicStream) setMicStream(stream);
    toast.success("Mic access granted.");

    const audioContext = new AudioContext();
    const micSource = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;

    const bufferLength = analyser.frequencyBinCount;
    const frequencyData = new Float32Array(bufferLength);

    micSource.connect(analyser);

    let lastViolationTime = 0;
    const DECIBEL_THRESHOLD = -50; 
    const VIOLATION_INTERVAL = 2000; 
    const minFrequency = 80;
    const maxFrequency = 6000;

    const checkPitch = () => {
      analyser.getFloatFrequencyData(frequencyData);

      const sampleRate = audioContext.sampleRate;
      const binSize = sampleRate / analyser.fftSize;
      const minIndex = Math.floor(minFrequency / binSize);
      const maxIndex = Math.ceil(maxFrequency / binSize);

      const now = Date.now();

      const relevantData = frequencyData.slice(minIndex, maxIndex);
      const activeBins = relevantData.filter((db) => db > DECIBEL_THRESHOLD);

      const isLoud = activeBins.length > 10; 

      if (isLoud && now - lastViolationTime > VIOLATION_INTERVAL) {
        lastViolationTime = now;
        toast.warn(
          'Suspicious audio detected'
        );
        setViolations?.((prev) => ({
          ...prev,
          soundViolation: (prev.soundViolation || 0) + 1,
        }));
      }

      requestAnimationFrame(checkPitch);
    };

    checkPitch();
  } catch (err) {
    toast.warn("Mic permission denied.");
    setViolations?.((prev) => ({
      ...prev,
      soundViolation: (prev.soundViolation || 0) + 1,
    }));
  }
};

export const monitorTabSwitch = (setViolations) => {
  const listener = () => {
    if (document.hidden) {
      toast.warn("Tab switched - violation logged");
      setViolations((prev) => ({
        ...prev,
        tabSwitchingViolation: (prev.tabSwitchingViolation || 0) + 1,
      }));
    }
  };

  document.addEventListener("visibilitychange", listener);
  return listener;
};

export const detectDevTools = (setViolations) => {
  let triggered = false;
  const threshold = 160;
  const intervalId = setInterval(() => {
    const start = performance.now();
    debugger;
    const end = performance.now();
    if (end - start > threshold && !triggered) {
      triggered = true;
      toast.warn("DevTools usage detected");
      setViolations((prev) => ({
        ...prev,
        devtoolsViolation: (prev.devtoolsViolation || 0) + 1,
      }));
    }
  }, 1000);

  return intervalId;
};

export const preventCopyPaste = (setViolations) => {
  if (listenersAttached) return;
  listenersAttached = true;

  const handler = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  ["copy", "cut", "paste"].forEach((evt) => {
    window.addEventListener(evt, handler, true);
    document.addEventListener(evt, handler, true);
  });

  const blockSelection = (e) => e.preventDefault();
  document.addEventListener("selectstart", blockSelection);
  document.addEventListener("mousedown", blockSelection);
  document.addEventListener("mouseup", blockSelection);
};

export const blockRightClick = (setViolations) => {
  const handler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setViolations((prev) => ({
      ...prev,
      rightClickViolation: (prev.rightClickViolation || 0) + 1,
    }));

    if (!rightClickToastShown) {
      toast.warn("Right click is not allowed");
      rightClickToastShown = true;

      setTimeout(() => {
        rightClickToastShown = false;
      }, 3000);
    }
  };

  window.addEventListener("contextmenu", handler, true);
  document.addEventListener("contextmenu", handler, true);
};
