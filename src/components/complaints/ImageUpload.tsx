"use client";

import { useState } from "react";
import { Image as ImageIcon, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  value?: string;
}

export function ImageUpload({ onUpload, value }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "jansankalp_preset"); // You'll need to set this up in Cloudinary

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();
      if (data.secure_url) {
        onUpload(data.secure_url);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 w-full">
      {value ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
          <img
            src={value}
            alt="Complaint Attachment"
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            onClick={() => onUpload("")}
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted border-muted-foreground/25 hover:border-primary/50 transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
              ) : (
                <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
              )}
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> Issue
                Photo
              </p>
              <p className="text-xs text-muted-foreground/60">
                PNG, JPG or WEBP
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
              disabled={isUploading}
            />
          </label>
        </div>
      )}
    </div>
  );
}
