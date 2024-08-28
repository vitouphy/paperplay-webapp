import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const A4_WIDTH_IN_MM = 210;
const A4_HEIGHT_IN_MM = 295;

const createCanvas = async (element: HTMLElement) => {
  const numPages = Math.ceil(element.scrollHeight / A4_HEIGHT_IN_MM);
  const containerHeight = numPages * A4_HEIGHT_IN_MM;

  return {
    canvas: await html2canvas(element, {
      scale: 1,
      useCORS: true,
      logging: true,
      windowWidth: element.scrollWidth,
      windowHeight: containerHeight,
      height: containerHeight,
    }),
  };
};

const createPDF = (canvas: HTMLCanvasElement) => {
  const pdf = new jsPDF("p", "mm", "a4");
  const imgData = canvas.toDataURL("image/png");
  const imgHeight = (canvas.height * A4_WIDTH_IN_MM) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, A4_WIDTH_IN_MM, imgHeight);
  heightLeft -= A4_HEIGHT_IN_MM;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, A4_WIDTH_IN_MM, imgHeight);
    heightLeft -= A4_HEIGHT_IN_MM;
  }

  return pdf;
};

export { createCanvas, createPDF };
