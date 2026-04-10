"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials. Contact your HopeSpark admin.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1D1A3A] p-4">
      <div className="w-16 h-16 rounded-full bg-[#7F77DD] flex items-center justify-center mb-6 relative">
        <div className="w-3 h-3 bg-white rounded-full absolute top-4 right-4" />
      </div>
      
      <Card className="w-full max-w-[420px] rounded-2xl shadow-xl">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-[#2C2C2A]">NGO Partner Portal</CardTitle>
          <CardDescription className="text-[#5F5E5A]">Sign in to see cases in your area</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#2C2C2A]">Email address</label>
              <Input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="partner@ngo.org"
                className="w-full h-12"
              />
            </div>
            
            <div className="space-y-1 relative">
              <label className="text-sm font-medium text-[#2C2C2A]">Password</label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pr-10"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-[#1D9E75] hover:bg-[#085041] text-white text-base rounded-full mt-2" 
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            
            <div className="text-center pt-2">
              <button type="button" className="text-sm text-[#888780] hover:underline" disabled>
                Forgot password?
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-white/70 text-sm">
        Want to become a verified partner? <br/>
        <a href="mailto:partners@hopespark.in" className="text-[#1D9E75] font-semibold hover:underline mt-1 inline-block">Contact us</a>
      </div>
    </div>
  );
}
