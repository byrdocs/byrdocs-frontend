import { useEffect, useRef } from 'react';
import { pdfjs, PDFViewer } from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer = ({ url }: { url: string }) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = viewerRef.current;
    if (!container) return;

    const loadingTask = pdfjs.getDocument(url);
    loadingTask.promise.then((pdf) => {
      const pdfViewer = new PDFViewer({
        container,
      });

      pdfViewer.setDocument(pdf);
    });

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [url]);

  return <div ref={viewerRef} className="pdfViewer" />;
};

export default PdfViewer;
