import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports a DOM element as a high-fidelity downloadable A4 PDF.
 * Uses an offscreen isolated staging clone so that mobile viewport constraints,
 * CSS zoom/scale transforms, and scroll boundaries never clip or distort the PDF.
 *
 * Supports landscape (for 3-column Fee Chalan, Timetables) and portrait (Receipts, Marksheets).
 * Automatically calculates page bounds and handles single-page / multi-page cleanly.
 */
export async function downloadElementAsPdf(elementId, filename = 'document.pdf', options = {}) {
  const { orientation = 'portrait' } = options;

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found for PDF export.`);
    return false;
  }

  const isLandscape = orientation === 'landscape';
  // Standard A4 dimensions in pixels at 96 DPI:
  // Portrait: 794px x 1123px (Aspect 1 : 1.414)
  // Landscape: 1123px x 794px (Aspect 1.414 : 1)
  const targetBaseWidth = isLandscape ? 1123 : 794;

  let stagingWrapper = null;

  try {
    // 1. Create an isolated off-screen staging wrapper attached to body
    stagingWrapper = document.createElement('div');
    stagingWrapper.id = 'slc-pdf-staging-sandbox';
    stagingWrapper.style.position = 'fixed';
    stagingWrapper.style.top = '-99999px';
    stagingWrapper.style.left = '-99999px';
    stagingWrapper.style.width = `${targetBaseWidth}px`;
    stagingWrapper.style.minWidth = `${targetBaseWidth}px`;
    stagingWrapper.style.maxWidth = `${targetBaseWidth}px`;
    stagingWrapper.style.backgroundColor = '#ffffff';
    stagingWrapper.style.zIndex = '-99999';
    stagingWrapper.style.overflow = 'visible';
    stagingWrapper.style.opacity = '1';
    stagingWrapper.style.visibility = 'visible';

    // 2. Deep clone the document node
    const clone = element.cloneNode(true);

    // Reset any interactive or mobile scale transforms on the clone
    clone.style.transform = 'none';
    clone.style.webkitTransform = 'none';
    clone.style.width = `${targetBaseWidth}px`;
    clone.style.minWidth = `${targetBaseWidth}px`;
    clone.style.maxWidth = `${targetBaseWidth}px`;
    clone.style.margin = '0 auto';
    clone.style.boxSizing = 'border-box';
    clone.style.backgroundColor = '#ffffff';
    clone.style.display = 'block';

    stagingWrapper.appendChild(clone);
    document.body.appendChild(stagingWrapper);

    // 3. Allow layout, web fonts, and images to settle in clone
    await new Promise((resolve) => setTimeout(resolve, 200));

    const totalHeight = Math.max(clone.scrollHeight, clone.offsetHeight, isLandscape ? 794 : 1123);

    // 4. Render high-resolution canvas from the clean staged clone
    const canvas = await html2canvas(clone, {
      scale: 2, // 2x crisp print density
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      width: targetBaseWidth,
      height: totalHeight,
      windowWidth: targetBaseWidth + 50,
      windowHeight: totalHeight + 100,
      scrollY: 0,
      scrollX: 0
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // 5. Setup standard A4 jsPDF
    // Portrait: 210 x 297 mm
    // Landscape: 297 x 210 mm
    const pdfPageWidth = isLandscape ? 297 : 210;
    const pdfPageHeight = isLandscape ? 210 : 297;

    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const margin = 8; // 8mm margin
    const usableWidth = pdfPageWidth - (margin * 2);
    const usableHeight = pdfPageHeight - (margin * 2);

    // Height of image when scaled to usableWidth in mm
    const imgHeight = (canvas.height * usableWidth) / canvas.width;

    // 6. Handle single-page vs multi-page
    // If it fits within 1 page (or with negligible threshold of 12mm), fit cleanly on 1 page
    if (imgHeight <= usableHeight + 12) {
      const finalFitHeight = Math.min(imgHeight, usableHeight);
      pdf.addImage(imgData, 'JPEG', margin, margin, usableWidth, finalFitHeight);
    } else {
      // Multi-page export with clean pagination
      let heightLeft = imgHeight;
      let position = margin;

      // Page 1
      pdf.addImage(imgData, 'JPEG', margin, position, usableWidth, imgHeight);
      heightLeft -= usableHeight;

      // Subsequent pages
      while (heightLeft > 0) {
        position = margin - (imgHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, position, usableWidth, imgHeight);
        heightLeft -= usableHeight;
      }
    }

    pdf.save(filename);
    return true;
  } catch (err) {
    console.error('Error generating PDF:', err);
    return false;
  } finally {
    // 7. Always remove temporary staging container
    if (stagingWrapper && stagingWrapper.parentNode) {
      stagingWrapper.parentNode.removeChild(stagingWrapper);
    }
  }
}
