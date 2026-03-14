import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import * as faceapi from "face-api.js";
import { toast } from "sonner";

const FaceProctor = forwardRef(({ onFlag }, ref) => {
  const videoRef = useRef(null);
  const lastCenter = useRef(null);
  const mountedRef = useRef(true);
  const lastViolation = useRef("");
  const lastToastTime = useRef(0);
  const streamRef = useRef(null);
  const hasStoppedRef = useRef(false);

  /* ================= TOAST HELPER ================= */

  const showToast = (msg, type = "warning") => {
    const now = Date.now();

    if (now - lastToastTime.current < 3000) return;

    lastToastTime.current = now;

    if (type === "error") toast.error(msg);
    else toast.warning(msg);
  };

  //for darkness

  const isFrameDark = () => {
    const video = videoRef.current;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let brightness = 0;

    for (let i = 0; i < frame.data.length; i += 4) {
      brightness += frame.data[i]; // red
      brightness += frame.data[i + 1]; // green
      brightness += frame.data[i + 2]; // blue
    }

    brightness /= frame.data.length / 4;

    return brightness < 40; // threshold
  };

  /* ================= INIT ================= */

  useEffect(() => {
    mountedRef.current = true;
    hasStoppedRef.current = false;

    const start = async () => {
      try {
        /* LOAD MODELS */

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        ]);

        /* CAMERA */

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });

        if (!mountedRef.current) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        videoRef.current.srcObject = stream;

        await new Promise((resolve) => {
          videoRef.current.onplaying = resolve;
        });

        setTimeout(startDetectionLoop, 2000);
      } catch (err) {
        console.error(err);
        toast.error("Camera access denied");
        onFlag?.("Camera failed");
      }
    };

    start();

    return () => {
      mountedRef.current = false;
      cleanupCamera();
    };
  }, []);

  /* ================= CAMERA CLEANUP ================= */

  const cleanupCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (videoRef.current) videoRef.current.srcObject = null;
  };

  /* ================= FACE DETECTION ================= */

  const startDetectionLoop = () => {
    const detectionStartTime = Date.now();
    let multiFaceStreak = 0;

    const detect = async () => {
      if (!mountedRef.current || hasStoppedRef.current) return;

      try {
        const video = videoRef.current;

        if (!video || video.videoWidth === 0) {
          setTimeout(detect, 700);
          return;
        }
        // ===== DARK FRAME DETECTION =====

        if (isFrameDark()) {
          if (lastViolation.current !== "Camera covered") {
            showToast("Camera covered or environment too dark!", "error");
            onFlag?.("Camera covered");
            lastViolation.current = "Camera covered";
          }

          lastCenter.current = null;
          setTimeout(detect, 700);
          return;
        }

        const detections = await faceapi
          .detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 416,
              scoreThreshold: 0.4,
            }),
          )
          .withFaceLandmarks();

        const now = Date.now();

        /* ===== NO FACE ===== */

        if (detections.length === 0) {
          multiFaceStreak = 0;

          if (
            now - detectionStartTime > 2000 &&
            lastViolation.current !== "No face detected"
          ) {
            showToast("No face detected!", "error");
            onFlag?.("No face detected");
            lastViolation.current = "No face detected";
          }

          lastCenter.current = null;
        } else if (detections.length > 1) {

        /* ===== MULTIPLE FACES ===== */
          multiFaceStreak++;

          if (
            multiFaceStreak >= 2 &&
            lastViolation.current !== "Multiple faces detected"
          ) {
            showToast("Multiple faces detected!", "error");
            onFlag?.("Multiple faces detected");
            lastViolation.current = "Multiple faces detected";
          }

          lastCenter.current = null;
        } else {

        /* ===== SINGLE FACE ===== */
          multiFaceStreak = 0;

          const d = detections[0];
          const { x, y, width, height } = d.detection.box;

          const center = {
            cx: x + width / 2,
            cy: y + height / 2,
          };

          const relX = video.videoWidth * 0.1;
          const relY = video.videoHeight * 0.1;

          if (lastCenter.current) {
            const dx = Math.abs(center.cx - lastCenter.current.cx);
            const dy = Math.abs(center.cy - lastCenter.current.cy);

            if (
              (dx > relX || dy > relY) &&
              lastViolation.current !== "Face moved suddenly"
            ) {
              showToast("Face moved suddenly!");
              onFlag?.("Face moved suddenly");
              lastViolation.current = "Face moved suddenly";
            }
          }

          lastCenter.current = center;

          /* ===== HEAD TURN ===== */

          const landmarks = d.landmarks;

          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();
          const nose = landmarks.getNose();

          if (leftEye.length && rightEye.length && nose.length > 3) {
            const leftEyeOuter = leftEye[0];
            const rightEyeOuter = rightEye[rightEye.length - 1];

            const eyeDistance = Math.abs(rightEyeOuter.x - leftEyeOuter.x);

            const noseTip = nose[3];

            const faceCenterX = (leftEyeOuter.x + rightEyeOuter.x) / 2;

            const deviationRatio =
              Math.abs(noseTip.x - faceCenterX) / eyeDistance;

            if (
              deviationRatio > 0.5 &&
              lastViolation.current !== "Face turned away"
            ) {
              showToast("Face turned away!");
              onFlag?.("Face turned away");
              lastViolation.current = "Face turned away";
            }
          }
        }
      } catch (err) {
        console.error("Detection error:", err);
      }

      /* RUN EVERY 700ms (stable) */

      setTimeout(detect, 700);
    };

    detect();
  };

  /* ================= STOP ================= */

  const stopRecording = () => {
    hasStoppedRef.current = true;
    cleanupCamera();
  };

  useImperativeHandle(ref, () => ({
    stopRecording,
  }));

  /* ================= UI ================= */

  return (
    <div
      id="faceproctor-container"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid #ddd",
        position: "relative",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scaleX(-1)",
        }}
      />

      <p
        style={{
          fontSize: 11,
          color: "#fff",
          textAlign: "center",
          margin: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: "4px 0",
        }}
      >
        Camera active
      </p>
    </div>
  );
});

export default React.memo(FaceProctor);
