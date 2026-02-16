import { jsPDF } from "jspdf";
import "jspdf-autotable";
import QRCode from 'qrcode';

export async function generateComplaintReceipt(complaint: any) {
    const doc = new jsPDF();
    const ticketID = complaint.ticketId || `JSK-${new Date().getFullYear()}-${complaint.id.slice(-5).toUpperCase()}`;

    // --- Official Header ---
    // National Emblem Placeholder or Logo
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

    // --- QR Code & Image Thumbnail ---
    let qrDataUrl = "";
    try {
        const origin = typeof window !== "undefined" ? window.location.origin : "https://jansankalp.ai";
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

    // Image Thumbnail if exists
    if (complaint.imageUrl) {
        try {
            // we attempt to add it. jsPDF addImage supports base64 and some URL types.
            // Using an image object to ensure it's loaded if in browser
            if (typeof window !== "undefined") {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = complaint.imageUrl;
                });
                doc.addImage(img, 'JPEG', 20, afterDescY, 60, 45);
            } else {
                doc.addImage(complaint.imageUrl, 'JPEG', 20, afterDescY, 60, 45);
            }
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text("EVIDENCE ATTACHED", 50, afterDescY + 50, { align: "center" });
        } catch (e) {
            console.error("Could not add image to PDF", e);
            doc.setFontSize(8);
            doc.setTextColor(200, 0, 0);
            doc.text("[IMAGE ATTACHMENT FAILED TO LOAD]", 20, afterDescY + 10);
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

    doc.save(`Acknowledgment_${ticketID}.pdf`);
}
