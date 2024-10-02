"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const [username, setUsername] = useState("");
  const { publicKey } = useWallet();
  const router = useRouter();
  const address = publicKey?.toString();
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  const handleJoin = async () => {
    //username not unique checking will be done later.
    try {
      const resp = await axios.post("/api/username", {
        username: username,
        walletAddress: address,
      });
      if (resp.status == 200) {
        toast.info("User created successfully");
        router.push("/dashboard");
      } else {
        toast.info("Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.info("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-2xl font-bold text-center">Hello There!</h1>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Create a Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wallet-address">Wallet Address</Label>
            <div className="flex">
              <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm bg-slate-100">
                {address}
              </div>
            </div>
          </div>
          <Button onClick={handleJoin}>Join</Button>
        </div>
      </div>
    </div>
  );
}
