"use client";

import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { useState } from "react";

interface SimplePDFDownloaderProps {
  complaint: any;
  className?: string;
}

export function SimplePDFDownloader({ complaint, className }: SimplePDFDownloaderProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const ticketID = complaint.ticketId || `JSK-${new Date().getFullYear()}-${complaint.id.slice(-5).toUpperCase()}`;
      
      // Create HTML content for receipt
      const receiptContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>JanSankalp AI - Complaint Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            .header { background: #1e3a8a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .field { margin: 10px 0; display: flex; }
            .label { font-weight: bold; width: 150px; }
            .value { flex: 1; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; font-size: 12px; color: #666; }
            .qr-code { text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>JanSankalp AI</h1>
            <p>CIVIC INTELLIGENCE & GOVERNANCE PORTAL</p>
            <p>Digital Sovereign Infrastructure of India</p>
          </div>
          
          <div class="content">
            <h2>OFFICIAL COMPLAINT ACKNOWLEDGMENT</h2>
            
            <div class="field">
              <span class="label">Ticket ID:</span>
              <span class="value">${ticketID}</span>
            </div>
            
            <div class="field">
              <span class="label">Citizen Name:</span>
              <span class="value">${(complaint.author?.name || "Registered Citizen").toUpperCase()}</span>
            </div>
            
            <div class="field">
              <span class="label">Category:</span>
              <span class="value">${complaint.category.toUpperCase()}</span>
            </div>
            
            <div class="field">
              <span class="label">Status:</span>
              <span class="value">${complaint.status === "PENDING" ? "REGISTERED" : complaint.status}</span>
            </div>
            
            <div class="field">
              <span class="label">Priority:</span>
              <span class="value">${complaint.severity}/5 (AI SCORED)</span>
            </div>
            
            <div class="field">
              <span class="label">Submission Date:</span>
              <span class="value">${new Date(complaint.createdAt).toLocaleString('en-IN')}</span>
            </div>
            
            <div class="field">
              <span class="label">Location:</span>
              <span class="value">${complaint.latitude.toFixed(4)}, ${complaint.longitude.toFixed(4)}</span>
            </div>
            
            <h3>ISSUE DESCRIPTION:</h3>
            <p>${complaint.description || "No description provided."}</p>
            
            <div class="qr-code">
              <p>Track your complaint: ${window.location.origin}/track/${ticketID}</p>
            </div>
          </div>
          
          <div class="footer">
            <p>This acknowledgment is electronically generated and does not require a physical signature.</p>
            <p>JanSankalp AI Hub • Smart India Mission • © 2026</p>
          </div>
        </body>
        </html>
      `;
      
      // Create blob and download
      const blob = new Blob([receiptContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Acknowledgment_${ticketID}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Receipt generation failed:", error);
      alert("Receipt download failed. Please try again.");
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
