import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Camera, RotateCcw, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CameraCaptureProps {
  onCapture: (image: string) => void;
  capturedImage?: string;
}

export const CameraCapture = ({ onCapture, capturedImage }: CameraCaptureProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
      setIsCameraActive(false);
    }
  }, [onCapture]);

  const retake = () => {
    onCapture('');
    setIsCameraActive(true);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Visitor Photo</h3>
        {capturedImage && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={retake}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Retake
          </Button>
        )}
      </div>

      <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
        {!capturedImage && !isCameraActive ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
            <Camera className="h-12 w-12 text-muted-foreground" />
            <Button
              type="button"
              onClick={() => setIsCameraActive(true)}
              className="gap-2"
            >
              <Camera className="h-4 w-4" />
              Start Camera
            </Button>
          </div>
        ) : capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured visitor"
            className="w-full h-full object-cover"
          />
        ) : (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover"
            videoConstraints={{
              facingMode: 'user',
            }}
          />
        )}
      </div>

      {isCameraActive && !capturedImage && (
        <Button
          type="button"
          onClick={capture}
          className="w-full gap-2"
        >
          <Check className="h-4 w-4" />
          Capture Photo
        </Button>
      )}
    </Card>
  );
};
