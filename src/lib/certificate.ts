export interface CertificateData {
  userName: string;
  courseName: string;
  completionDate: Date;
  instructorName: string;
}

export function generateCertificate(data: CertificateData): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  canvas.width = 1200;
  canvas.height = 800;

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#1a365d');
  gradient.addColorStop(0.5, '#2563eb');
  gradient.addColorStop(1, '#1e40af');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 8;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 48px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFICATE', canvas.width / 2, 140);

  ctx.fillStyle = '#ffffff';
  ctx.font = '24px Georgia, serif';
  ctx.fillText('OF COMPLETION', canvas.width / 2, 180);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '20px Georgia, serif';
  ctx.fillText('This is to certify that', canvas.width / 2, 260);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 42px Georgia, serif';
  ctx.fillText(data.userName, canvas.width / 2, 330);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '20px Georgia, serif';
  ctx.fillText('has successfully completed', canvas.width / 2, 400);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px Georgia, serif';
  ctx.fillText(data.courseName, canvas.width / 2, 470);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '20px Georgia, serif';
  ctx.fillText(`Instructor: ${data.instructorName}`, canvas.width / 2, 550);

  const dateStr = data.completionDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  ctx.fillStyle = '#94a3b8';
  ctx.font = '18px Georgia, serif';
  ctx.fillText(`Completed on ${dateStr}`, canvas.width / 2, 620);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 24px Georgia, serif';
  ctx.fillText('LearnHub LMS', canvas.width / 2, 720);

  return canvas.toDataURL('image/png');
}

export function downloadCertificate(data: CertificateData, filename?: string): void {
  const dataUrl = generateCertificate(data);
  const link = document.createElement('a');
  link.download = filename || `certificate-${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
}
