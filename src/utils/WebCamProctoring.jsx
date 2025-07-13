import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Base from "./Base";
import { toast } from "react-toastify";

const WebCamProctoring = ({
  studentId,
  examId,
  onViolation,
  onMaxViolationsReached,
  hasSubmitted,
  onWarningMessage,
  snapshots,
  setSnapshots,
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const warningCountRef = useRef(0);
  const captureInProgressRef = useRef(false);

  const [base64Path, setBase64Path] = useState("");

  const [referenceDescriptor, setReferenceDescriptor] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [cameraDisabled, setCameraDisabled] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  useEffect(() => {
    const beforeUnloadHandler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.removeEventListener("beforeunload", beforeUnloadHandler);
    return () =>
      window.removeEventListener("beforeunload", beforeUnloadHandler);
  }, []);

  useEffect(() => {
    const MODEL_URL = "/models";

    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setIsReady(true);
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (base64Path) loadReferenceImage();
  }, [base64Path]);

  const loadReferenceImage = async () => {
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onerror = reject;
      image.src = base64Path;
      image.onload = () => {
        setTimeout(() => resolve(image), 100);
      };
    });

    const result = await faceapi
      .detectSingleFace(
        img,
        new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 })
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!result) {
      setWarningMessage("No face found in reference image.");
      return;
    }

    setReferenceDescriptor(result.descriptor);
    startVideo();
  };

  useEffect(() => {
    if (hasSubmitted) {
      stopCamera();
    }
  }, [hasSubmitted]);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" } })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setIsReady(true);
      })
      .catch(() => {
        toast.error("Camera Access Denied");
        setCameraDisabled(true);
      });
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    stream?.getTracks().forEach((track) => track.stop());
    setCameraDisabled(true);
  };

  const captureSnapshot = async () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("violationImage", blob, `violation_${Date.now()}.png`);
      formData.append("studentId", studentId);
      formData.append("examId", examId);

      setSnapshots((prev) => {
        const updated = [...prev, blob];
        return updated;
      });
    }, "image/png");
  };

  const detectWithFallback = async (video) => {
    const tinyOptions = new faceapi.TinyFaceDetectorOptions({
      inputSize: 608,
      scoreThreshold: 0.3,
    });
    const ssdOptions = new faceapi.SsdMobilenetv1Options({
      minConfidence: 0.3,
    });

    let detections = await faceapi
      .detectAllFaces(video, tinyOptions)
      .withFaceLandmarks()
      .withFaceDescriptors();

    const lowConfidence =
      detections.length === 0 ||
      detections.some((d) => d.detection.score < 0.4);

    if (lowConfidence) {
      detections = await faceapi
        .detectAllFaces(video, ssdOptions)
        .withFaceLandmarks()
        .withFaceDescriptors();
    }

    return detections;
  };

  useEffect(() => {
    if (!isReady || !referenceDescriptor || cameraDisabled) return;

    const interval = setInterval(async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      const size = { width: video.videoWidth, height: video.videoHeight };
      canvas.width = size.width;
      canvas.height = size.height;
      faceapi.matchDimensions(canvas, size);

      const detections = await detectWithFallback(video);
      const resized = faceapi.resizeResults(detections, size);

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let matched = false;
      let malpractice = false;
      let faceLookingAway = false;

      resized.forEach((det) => {
        const dist = faceapi.euclideanDistance(
          det.descriptor,
          referenceDescriptor
        );
        if (dist < 0.6) matched = true;

        const landmarks = det.landmarks;
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();

        const drawEyeOutline = (eye) => {
          ctx.beginPath();
          ctx.moveTo(eye[0].x, eye[0].y);
          for (let i = 1; i < eye.length; i++) {
            ctx.lineTo(eye[i].x, eye[i].y);
          }
        };

        drawEyeOutline(leftEye);
        drawEyeOutline(rightEye);

        if (isLookingAway(leftEye, rightEye)) {
          faceLookingAway = true;
          malpractice = true;
        }
      });

      if (resized.length === 0) {
        const msg = "We can't see your face — please adjust your position.";
        setWarningMessage(msg);
        onWarningMessage?.(msg);
        malpractice = true;
      } else if (resized.length > 1) {
        const msg = "Multiple faces detected. Only the registered candidate is allowed.";
        setWarningMessage(msg);
        onWarningMessage?.(msg);
        malpractice = true;
      } else if (!matched) {
        const msg = "Face mismatch detected. Unauthorized user may be present.";
        setWarningMessage(msg);
        onWarningMessage?.(msg);
        malpractice = true;
      } else if (faceLookingAway) {
        const msg = "Please face the screen during the test.";
        setWarningMessage(msg);
        onWarningMessage?.(msg);
        malpractice = true;
      }

      if (
        malpractice &&
        warningCountRef.current <= 5 &&
        !captureInProgressRef.current
      ) {
        captureInProgressRef.current = true;

        const currentCount = warningCountRef.current + 1;
        warningCountRef.current = currentCount;
        setWarningCount(currentCount);
        onViolation();

        await captureSnapshot();

        if (currentCount === 6) {
          stopCamera();
          onMaxViolationsReached();
        }

        captureInProgressRef.current = false;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isReady, referenceDescriptor, cameraDisabled]);

  const isLookingAway = (leftEye, rightEye) => {
    const eyeCenter = (eye) => {
      const xs = eye.map((pt) => pt.x);
      const ys = eye.map((pt) => pt.y);
      return {
        x: xs.reduce((a, b) => a + b, 0) / xs.length,
        y: ys.reduce((a, b) => a + b, 0) / ys.length,
      };
    };

    const left = eyeCenter(leftEye);
    const right = eyeCenter(rightEye);

    const dx = Math.abs(left.x - right.x);
    const dy = Math.abs(left.y - right.y);

    const eyeSlope = dy / dx;
    return eyeSlope > 0.08;
  };

  return (
    <div>
      <Base setBase64Path={setBase64Path} />
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-20 h-12 object-fill"
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default WebCamProctoring;
