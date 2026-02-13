import { jsPDF } from "jspdf";
import "jspdf-autotable";

export function generateComplaintReceipt(complaint: any) {
    const doc = new jsPDF();

    // Branding
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138); // Primary color #1E3A8A
    doc.text("JanSankalp AI", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Smart Governance - Complaint Receipt", 105, 28, { align: "center" });

    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);

    // Content
    doc.setFontSize(12);
    doc.setTextColor(0);

    const data = [
        ["Complaint ID", `#JS-${complaint.id.toUpperCase()}`],
        ["Category", complaint.category],
        ["Status", complaint.status],
        ["Severity", `${complaint.severity}/5`],
        ["Date Submitted", new Date(complaint.createdAt).toLocaleDateString()],
        ["Description", complaint.description],
        ["Location", `${complaint.latitude}, ${complaint.longitude}`],
    ];

    // @ts-ignore - jspdf-autotable extends jsPDF but types can be tricky in some environments
    doc.autoTable({
        startY: 45,
        head: [["Field", "Details"]],
        body: data,
        theme: "striped",
        headStyles: { fillStyle: [30, 58, 138] },
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("This is an AI-generated receipt by JanSankalp AI platform.", 105, pageHeight - 20, { align: "center" });

    doc.save(`Complaint_${complaint.id}.pdf`);
}
