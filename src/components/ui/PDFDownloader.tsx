"use client";

import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { useState } from "react";
import dynamic from "next/dynamic";

interface PDFDownloaderProps {
  complaint: any;
  className?: string;
}

function PDFDownloaderComponent({ complaint, className }: PDFDownloaderProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      // Dynamic imports only in browser
      const [{ jsPDF }, { default: autoTable }, { default: QRCode }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
        import("qrcode")
      ]);
      
      // Register autoTable plugin
      // @ts-ignore
      autoTable(jsPDF);
      
      const doc = new jsPDF();
      const ticketID = complaint.ticketId || `JSK-${new Date().getFullYear()}-${complaint.id.slice(-5).toUpperCase()}`;

      // --- Official Header ---
      doc.setFillColor(30, 58, 138); // Navy Blue
      doc.rect(0, 0, 210, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("JanSankalp AI", 105, 18, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("CIVIC INTELLIGENCE & GOVERNANCE PORTAL", 105, 28, { align: "center" });
      doc.text("Digital Sovereign Infrastructure of India", 105, 34, { align: "center" });

      // --- Receipt Title ---
      doc.setTextColor(30, 58, 138);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("OFFICIAL COMPLAINT ACKNOWLEDGMENT", 20, 55);

      doc.setDrawColor(30, 58, 138);
      doc.setLineWidth(1);
      doc.line(20, 60, 190, 60);

      // --- Content ---
      const data = [
        ["Ticket ID", ticketID],
        ["Citizen Name", (complaint.author?.name || "Registered Citizen").toUpperCase()],
        ["Category", complaint.category.toUpperCase()],
        ["Status", complaint.status === "PENDING" ? "REGISTERED" : complaint.status],
        ["Priority", `${complaint.severity}/5 (AI SCORED)`],
        ["Submission Date", new Date(complaint.createdAt).toLocaleString('en-IN')],
        ["Location", `${complaint.latitude.toFixed(4)}, ${complaint.longitude.toFixed(4)}`],
      ];

      // @ts-ignore
      doc.autoTable({
        startY: 70,
        head: [["Information Field", "Official Record"]],
        body: data,
        theme: "grid",
        headStyles: { fillColor: [30, 58, 138], fontSize: 11, fontStyle: 'bold' },
        bodyStyles: { fontSize: 10, cellPadding: 5 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 }, 1: { fontStyle: 'bold' } }
      });

      const finalY = (doc as any).lastAutoTable.finalY + 10;

      // --- Description Block ---
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("ISSUE DESCRIPTION:", 20, finalY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const description = complaint.description || "No description provided.";
      const splitDesc = doc.splitTextToSize(description, 170);
      doc.text(splitDesc, 20, finalY + 7);

      const afterDescY = finalY + 7 + (splitDesc.length * 5) + 10;

      // --- QR Code ---
      let qrDataUrl = "";
      try {
        const origin = window.location.origin;
        const trackingUrl = `${origin}/track/${ticketID}`;
        qrDataUrl = await QRCode.toDataURL(trackingUrl);
      } catch (e) {
        console.error("Could not generate QR code", e);
      }

      if (qrDataUrl) {
        try {
          const qrSize = 35;
          doc.addImage(qrDataUrl, 'PNG', 155, afterDescY, qrSize, qrSize);
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text("SCAN TO TRACK LIVE", 172.5, afterDescY + qrSize + 5, { align: "center" });
        } catch (qrAddError) {
          console.error("Failed to add QR code to PDF:", qrAddError);
        }
      }

      // --- Official Footer ---
      const pageHeight = doc.internal.pageSize.height;
      doc.setDrawColor(200);
      doc.line(20, pageHeight - 30, 190, pageHeight - 30);

      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text("This acknowledgment is electronically generated and does not require a physical signature.", 105, pageHeight - 20, { align: "center" });
      doc.text("JanSankalp AI Hub • Smart India Mission • © 2026", 105, pageHeight - 15, { align: "center" });

      // Save the PDF
      doc.save(`Acknowledgment_${ticketID}.pdf`);
      
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("PDF download failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={`${className} gap-2`}
      onClick={handleDownload}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <FileDown className="w-4 h-4" />
      )}
      {loading ? "Generating..." : "Download Receipt"}
    </Button>
  );
}

// Export as dynamic component to avoid SSR
export const PDFDownloader = dynamic(
  () => Promise.resolve(PDFDownloaderComponent),
  { 
    ssr: false,
    loading: () => (
      <Button variant="outline" size="sm" className="gap-2" disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading...
      </Button>
    )
  }
);
