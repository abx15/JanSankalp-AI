// Simple PDF generation service using browser print functionality
export async function generateComplaintReceipt(complaint: any) {
    try {
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            throw new Error('Failed to open print window');
        }

        const currentDate = new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>JanSankalp AI - Complaint Receipt</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background: #f5f5f5;
                    }
                    .header {
                        background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
                        color: white;
                        padding: 30px;
                        border-radius: 10px;
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 32px;
                        font-weight: 700;
                    }
                    .header p {
                        margin: 5px 0 0 0;
                        opacity: 0.9;
                        font-size: 14px;
                    }
                    .receipt-container {
                        background: white;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    .section-title {
                        font-size: 18px;
                        font-weight: 600;
                        color: #1e3a8a;
                        margin-bottom: 15px;
                        border-bottom: 2px solid #1e3a8a;
                        padding-bottom: 5px;
                    }
                    .info-grid {
                        display: grid;
                        grid-template-columns: 200px 1fr;
                        gap: 10px;
                        margin-bottom: 20px;
                    }
                    .info-label {
                        font-weight: 600;
                        color: #374151;
                        padding: 8px;
                        background: #f9fafb;
                        border-radius: 5px;
                    }
                    .info-value {
                        padding: 8px;
                        background: #f3f4f6;
                        border-radius: 5px;
                        font-family: monospace;
                    }
                    .description-box {
                        background: #f9fafb;
                        padding: 15px;
                        border-radius: 5px;
                        border-left: 4px solid #1e3a8a;
                        margin: 20px 0;
                    }
                    .photo-section {
                        margin: 20px 0;
                    }
                    .photo-container {
                        display: flex;
                        justify-content: center;
                        margin: 15px 0;
                    }
                    .photo-img {
                        max-width: 100%;
                        max-height: 300px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                        border: 1px solid #e5e7eb;
                    }
                    .no-photo {
                        text-align: center;
                        padding: 40px;
                        background: #f9fafb;
                        border-radius: 8px;
                        color: #6b7280;
                        font-style: italic;
                    }
                    .footer {
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 1px solid #e5e7eb;
                        text-align: center;
                        font-size: 12px;
                        color: #6b7280;
                    }
                    .verified-seal {
                        border: 2px solid #1e3a8a;
                        border-radius: 50%;
                        width: 80px;
                        height: 80px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 20px auto;
                        font-size: 10px;
                        font-weight: bold;
                        color: #1e3a8a;
                        text-align: center;
                    }
                    @media print {
                        body { background: white; }
                        .receipt-container { box-shadow: none; }
                        .photo-img { max-height: 200px; }
                    }
                </style>
            </head>
            <body>
                <div class="receipt-container">
                    <div class="header">
                        <h1>JanSankalp AI</h1>
                        <p>GOVERNMENT OF CIVIC EXCELLENCE</p>
                        <p>OFFICIAL COMPLAINT RECEIPT</p>
                    </div>

                    <div class="section-title">Grievance Details</div>
                    <div class="info-grid">
                        <div class="info-label">Ticket ID</div>
                        <div class="info-value">${complaint.ticketId || 'N/A'}</div>
                        
                        <div class="info-label">Category</div>
                        <div class="info-value">${complaint.category || 'General'}</div>
                        
                        <div class="info-label">Status</div>
                        <div class="info-value">${complaint.status || 'PENDING'}</div>
                        
                        <div class="info-label">Severity Score</div>
                        <div class="info-value">Level ${complaint.severity || 1}</div>
                        
                        <div class="info-label">Registration Date</div>
                        <div class="info-value">${new Date(complaint.createdAt || new Date()).toLocaleDateString('en-IN')}</div>
                        
                        <div class="info-label">Geo-Coordinates</div>
                        <div class="info-value">${Number(complaint.latitude).toFixed(6)}, ${Number(complaint.longitude).toFixed(6)}</div>
                        
                        <div class="info-label">Author</div>
                        <div class="info-value">${complaint.author?.name || 'Citizen'}</div>
                    </div>

                    <div class="section-title">Issue Description</div>
                    <div class="description-box">
                        ${complaint.description || 'No description provided.'}
                    </div>

                    ${complaint.imageUrl ? `
                    <div class="section-title">Evidence Photo</div>
                    <div class="photo-section">
                        <div class="photo-container">
                            <img src="${complaint.imageUrl}" alt="Complaint Evidence" class="photo-img" />
                        </div>
                    </div>
                    ` : `
                    <div class="section-title">Evidence Photo</div>
                    <div class="photo-section">
                        <div class="no-photo">
                            No photo evidence provided with this complaint
                        </div>
                    </div>
                    `}

                    <div class="verified-seal">
                        VERIFIED<br>
                        AI SYSTEMS
                    </div>

                    <div class="footer">
                        <p><strong>This receipt is a valid digital confirmation of your grievance registration.</strong></p>
                        <p>JanSankalp AI utilizes advanced intelligence to prioritize and resolve civic issues.</p>
                        <p>Generated by: JanSankalp Core System | Timestamp: ${new Date().toLocaleString('en-IN')}</p>
                    </div>
                </div>

                <script>
                    window.onload = function() {
                        setTimeout(() => {
                            window.print();
                            window.close();
                        }, 500);
                    }
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        return true;
    } catch (error) {
        console.error("PDF_GENERATION_ERROR:", error);
        return false;
    }
}
