import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@material-ui/core';

const QRScanner = ({ onScan }) => {
  const scannerRef = useRef(null);
  const html5QrCode = useRef(null);

  useEffect(() => {
    html5QrCode.current = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.current.start(
      { facingMode: "environment" },
      config,
      onScan,
      console.error
    ).catch(console.error);

    return () => {
      if (html5QrCode.current && html5QrCode.current.isScanning) {
        html5QrCode.current.stop().catch(console.error);
      }
    };
  }, [onScan]);

  return (
    <div>
      <div id="reader" ref={scannerRef} style={{ width: '300px' }} />
      <Button variant="contained" color="primary" onClick={() => {}}>
        Scan QR
      </Button>
    </div>
  );
};

export default QRScanner;