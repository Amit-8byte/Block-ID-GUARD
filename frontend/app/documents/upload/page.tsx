"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
}

export default function UploadDocumentPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please select a document file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);
    formData.append("description", description);

    try {
      setLoading(true);

      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ FORCE DASHBOARD REFRESH AFTER UPLOAD
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      if (err instanceof AxiosError) {
        const apiError = err.response?.data as ApiErrorResponse;
        setError(apiError?.message || "Document upload failed");
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        Upload Document
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Upload a document along with its metadata for review and verification.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-lg p-6 space-y-6 shadow-sm"
      >
        {/* FILE INPUT */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Document File
          </label>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border rounded px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {file && (
            <p className="mt-1 text-sm text-gray-600">
              Selected file:{" "}
              <span className="font-medium text-gray-800">
                {file.name}
              </span>
            </p>
          )}
        </div>

        {/* DOCUMENT TYPE */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Document Type
          </label>
          <input
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            placeholder="Aadhaar, PAN, Passport, Invoice, Contract"
            className="w-full border rounded px-3 py-2 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add any additional context for reviewers"
            className="w-full border rounded px-3 py-2 h-28 text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </p>
        )}

        {/* SUBMIT */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Uploading…" : "Upload Document"}
          </button>
        </div>
      </form>
    </div>
  );
}
