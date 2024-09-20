"use client";

import React, { useState } from "react";
import { LoaderIcon, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AIImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setGenerating(true);
  //   // In a real application, this is where you'd call your AI image generation API
  //   // For this example, we'll just use a placeholder image
  //   if (!prompt.trim()) {
  //     return;
  //   }

  //   const res = await fetch("/api/generate", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ prompt }),
  //   });
  //   console.log(res.json());

  //   setTimeout(() => {
  //     setPrompt(" ");
  //     setGenerating(false);
  //   }, 5000);
  //   // setImageUrl(`/api/placeholder/512/512?text=${encodeURIComponent(prompt)}`);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);

    // Check if prompt is empty or only whitespace
    if (!prompt.trim()) {
      setGenerating(false); // Stop the loading state
      return; // Exit if prompt is invalid
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      // Check for a successful response
      if (!res.ok) {
        const errorResult = await res.json();
        console.error("Error:", errorResult.message);
        toast.error(errorResult.message.slice(0, 62));

        // Handle error (you can set a state to show an error message)
        setGenerating(false);
        return;
      }

      const result = await res.json();
      if (result) {
        setImageUrl(result.data[3].url);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      // Clean up after the request
      setTimeout(() => {
        setPrompt("");
        setGenerating(false);
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen border-2 w-full bg-gradient-to-br from-purple-100 to-indigo-200 flex flex-col space-y-12 items-center justify-center p-4">
      <ToastContainer />{" "}
      <Card className="w-full max-w-md bg-slate-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-purple-700">
            AI Image Generator
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-gray-500 text-center">
            Write in the input box to begin generating AI images
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                readOnly={generating}
                placeholder="Enter your image description..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className={`flex-grow bg-gray-100 text-gray-600   text-[16px] `}
              />
              <Button
                disabled={generating || !prompt.trim()}
                type="submit"
                className={`bg-purple-600 hover:bg-purple-700 ${
                  !prompt.trim() &&
                  "bg-gray-600 hover:bg-gray-600 cursor-not-allowed"
                }`}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
          {imageUrl && (
            <div className="mt-6">
              <img
                src={imageUrl}
                alt="Generated"
                className="w-full h-auto rounded-lg shadow-lg"
              />

              <Button
                className="bg-purple-600 hover:bg-purple-700 mt-6 w-full font-bold"
                onClick={() => {
                  fetch(imageUrl) // Fetch the image
                    .then((response) => response.blob()) // Convert it to a blob
                    .then((blob) => {
                      const url = window.URL.createObjectURL(blob); // Create a download link
                      const a = window.document.createElement("a");
                      a.href = url;
                      a.download = "image.webp"; // Set the filename with .webp extension
                      a.click(); // Trigger the download
                      window.URL.revokeObjectURL(url); // Clean up after download
                    })
                    .catch((err) =>
                      console.error("Failed to download image", err)
                    );
                }}
              >
                Download
              </Button>
            </div>
          )}

          {generating && (
            <LoaderIcon className="h-8  animate-spin text-black text-center mt-12 w-full" />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIImageGenerator;
