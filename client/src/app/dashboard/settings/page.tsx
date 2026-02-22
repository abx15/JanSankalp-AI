"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Home,
  Save,
  Loader2,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
import { toast } from "sonner";

const MapPicker = dynamic(() => import("@/components/complaints/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-muted animate-pulse rounded-lg" />
  ),
});

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
    latitude: 20.5937,
    longitude: 78.9629,
  });

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          address: data.address || "",
          latitude: data.latitude || 20.5937,
          longitude: data.longitude || 78.9629,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Profile updated successfully!");
        // Update session if needed
        update();
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal information and city service preferences.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Sidebar Info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="h-24 bg-primary relative" />
            <CardContent className="pt-0 -mt-10 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-xl">
                  <div className="w-full h-full rounded-xl bg-muted flex items-center justify-center text-primary font-bold text-2xl overflow-hidden">
                    {formData.name?.[0] || "U"}
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-lg">
                  {formData.name || session?.user?.name || "Citizen"}
                </h3>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                  {(session?.user as any)?.role || "CITIZEN"}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">
              Privacy & Security
            </p>
            <Button
              variant="ghost"
              className="w-full justify-start font-bold gap-3 rounded-xl hover:bg-primary/5"
            >
              <Mail className="w-4 h-4" /> Change Email
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start font-bold gap-3 rounded-xl hover:bg-primary/5"
            >
              <Save className="w-4 h-4" /> Security Logs
            </Button>
          </div>
        </div>

        {/* Form Area */}
        <div className="md:col-span-2 space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Profile Information
              </CardTitle>
              <CardDescription>
                Your public identity on JanSankalp AI.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-xs font-black uppercase tracking-widest opacity-70"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Rahul Sharma"
                    className="rounded-xl border-muted bg-muted/20 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-xs font-black uppercase tracking-widest opacity-70"
                  >
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+91 98765 43210"
                      className="rounded-xl border-muted bg-muted/20 pl-10 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="bio"
                  className="text-xs font-black uppercase tracking-widest opacity-70"
                >
                  Bio / About You
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Passionate about urban development..."
                  className="rounded-xl border-muted bg-muted/20 min-h-[100px] font-medium"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Primary Location
              </CardTitle>
              <CardDescription>
                Set your home or office location for localized alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest opacity-70">
                  Pick on Map
                </Label>
                <MapPicker
                  initialLocation={[formData.latitude, formData.longitude]}
                  onLocationSelect={(lat, lng) =>
                    setFormData({ ...formData, latitude: lat, longitude: lng })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="address"
                  className="text-xs font-black uppercase tracking-widest opacity-70"
                >
                  Formatted Address
                </Label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Apartment, Street Name, City"
                    className="rounded-xl border-muted bg-muted/20 pl-10 font-medium"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="rounded-full px-8 py-6 text-lg font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
