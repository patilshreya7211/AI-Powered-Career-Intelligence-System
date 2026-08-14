import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

function ResumePreview() {
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [downloading, setDownloading] = useState(false);

  // ==============================
  // Load Resume Information
  // ==============================
  useEffect(() => {
    const savedContent = localStorage.getItem("resumeBuilderContent");

    if (savedContent) {
      setContent(savedContent);
    }
  }, []);

  // ==============================
  // Edit Resume
  // ==============================
  const handleEdit = () => {
    navigate("/resume-builder");
  };

  // ==============================
  // Go Dashboard
  // ==============================
  const handleDashboard = () => {
    navigate("/dashboard");
  };

  // ==============================
  // Download PDF
  // ==============================
  const handleDownloadPDF = () => {
    if (!content.trim()) {
      alert("No resume information found.");
      return;
    }

    try {
      setDownloading(true);

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // ==============================
      // PDF Settings
      // ==============================

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 15;
      const usableWidth = pageWidth - margin * 2;

      let y = 20;

      // ==============================
      // Title
      // ==============================

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);

      pdf.text("RESUME", pageWidth / 2, y, {
        align: "center",
      });

      y += 12;

      // Horizontal line
      pdf.setLineWidth(0.5);
      pdf.line(margin, y, pageWidth - margin, y);

      y += 10;

      // ==============================
      // Resume Content
      // ==============================

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);

      // Split resume into lines
      const originalLines = content.split("\n");

      originalLines.forEach((line) => {
        // Remove emojis and unsupported special symbols
        const cleanLine = line
          .replace(
            /[\u{1F300}-\u{1FAFF}]/gu,
            ""
          )
          .replace(
            /[\u{2600}-\u{27BF}]/gu,
            ""
          )
          .trim();

        // Empty line
        if (!cleanLine) {
          y += 5;

          // New page if required
          if (y > pageHeight - margin) {
            pdf.addPage();
            y = 20;
          }

          return;
        }

        // ==============================
        // Detect headings
        // ==============================

        const headingWords = [
          "CAREER OBJECTIVE",
          "OBJECTIVE",
          "EDUCATION",
          "SKILLS",
          "PROJECTS",
          "EXPERIENCE",
          "CERTIFICATIONS",
          "ACHIEVEMENTS",
          "LANGUAGES",
          "CAREER GOAL",
          "CONTACT",
          "PROFILE",
          "SUMMARY",
          "INTERNSHIP",
        ];

        const upperLine = cleanLine.toUpperCase();

        const isHeading = headingWords.some((heading) =>
          upperLine.startsWith(heading)
        );

        if (isHeading) {
          y += 3;

          // Check page space
          if (y > pageHeight - 30) {
            pdf.addPage();
            y = 20;
          }

          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(12);

          pdf.text(cleanLine, margin, y);

          y += 7;

          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(11);

          return;
        }

        // ==============================
        // Normal text
        // ==============================

        const wrappedLines = pdf.splitTextToSize(
          cleanLine,
          usableWidth
        );

        wrappedLines.forEach((wrappedLine) => {
          // Check if we need a new page
          if (y > pageHeight - margin) {
            pdf.addPage();
            y = 20;
          }

          pdf.text(wrappedLine, margin, y);

          y += 6;
        });
      });

      // ==============================
      // Footer on each page
      // ==============================

      const totalPages = pdf.getNumberOfPages();

      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);

        pdf.setTextColor(100, 100, 100);

        pdf.text(
          `AI Career Intelligence System | Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 8,
          {
            align: "center",
          }
        );

        pdf.setTextColor(0, 0, 0);
      }

      // ==============================
      // Download
      // ==============================

      pdf.save("AI_Career_Resume.pdf");

      alert("Resume downloaded successfully! 🎉");
    } catch (error) {
      console.error("PDF Download Error:", error);

      alert(
        "Unable to download resume. Please check the browser console."
      );
    } finally {
      setDownloading(false);
    }
  };

  // ==============================
  // No Resume
  // ==============================

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md">
          <div className="text-5xl mb-5">
            📄
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            No Resume Information Found
          </h2>

          <p className="text-gray-500 mt-3">
            Please enter your resume information first.
          </p>

          <button
            onClick={() => navigate("/resume-builder")}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Create Resume
          </button>
        </div>
      </div>
    );
  }

  // ==============================
  // Main UI
  // ==============================

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">

      {/* ==============================
          Header
      ============================== */}

      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-2xl shadow-xl p-6">

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">

            <div>
              <h1 className="text-3xl font-bold">
                Resume Preview
              </h1>

              <p className="text-blue-100 mt-2">
                Review your resume before downloading.
              </p>
            </div>

            <div className="flex gap-3">

              <button
                onClick={handleEdit}
                className="bg-white text-blue-700 hover:bg-blue-50 px-5 py-2 rounded-lg font-semibold"
              >
                ✏️ Edit
              </button>

              <button
                onClick={handleDashboard}
                className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg font-semibold"
              >
                Dashboard
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* ==============================
          Resume Preview
      ============================== */}

      <div className="max-w-5xl mx-auto">

        <div className="bg-white shadow-2xl rounded-xl p-8 md:p-12">

          <div className="whitespace-pre-wrap text-gray-800 leading-7 text-[15px]">

            {content}

          </div>

        </div>

      </div>

      {/* ==============================
          Bottom Actions
      ============================== */}

      <div className="max-w-5xl mx-auto mt-8">

        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <div>

            <h3 className="font-bold text-gray-800">
              Your resume is ready 🎉
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Edit your resume or download it as a PDF.
            </p>

          </div>

          <div className="flex gap-3">

            {/* Edit */}
            <button
              onClick={handleEdit}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              ✏️ Edit Resume
            </button>

            {/* Download */}
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white px-6 py-3 rounded-lg font-semibold"
            >
              {downloading
                ? "⏳ Preparing PDF..."
                : "📥 Download Resume"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ResumePreview;