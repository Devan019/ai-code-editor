// components/AuthComponent.tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import axios from "axios";

const AuthComponent = () => {
  const { data: session, status } = useSession();
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function FolderCheck() {
    const api = await axios.post("/api/dfolder", {
      accessToken: session?.accessToken,
    });

    const data = api.data;

    if(data.folderId){
      localStorage.setItem("folderId", data.folderId);
    }
  }

  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false);
      // If not authenticated, open the login dialog after a short delay
      if (status === "unauthenticated") {
        const timer = setTimeout(() => {
          setOpenLoginDialog(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [status]);

  useEffect(()=>{
    if(session?.user){
      FolderCheck()
    }
  }, [session])

  const handleLogin = () => {
    signIn("google");
    setOpenLoginDialog(false);
  };

  const handleClose = () => {
    setOpenLoginDialog(false);
  };

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  return (
    <div className="relative">
      {session?.user ? (
        <div className="flex items-center space-x-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={session.user.image || "/default-avatar.png"}
              alt={session.user.name || "User"}
              fill
              className="object-cover"
            />
          </div>
          <button
            onClick={() => signOut()}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Sign out
          </button>
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
      )}

      {!session?.user && (
        <Dialog open={openLoginDialog}>
          <div className="p-6 max-w-sm">
            <h2 className="text-xl font-bold mb-4">Login Required</h2>
            <p className="mb-6">You need to sign in to access this feature.</p>
            <div className="flex justify-center">
              <Button
                variant="destructive"
                onClick={handleLogin}
                className="bg-white text-gray-800 hover:bg-gray-100"
              >
                Sign in with Google
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default AuthComponent;
