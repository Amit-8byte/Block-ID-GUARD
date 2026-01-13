"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import Link from "next/link";

interface Document {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

interface DocumentsResponse {
  documents: Document[];
}

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await api.get<DocumentsResponse>("/documents");
        setDocuments(res.data.documents);
      } catch {
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-lg font-semibold text-black">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">
          Document Dashboard
        </h1>
        <p className="text-base font-medium text-black mt-2">
          All your uploaded documents appear below in order
        </p>
      </div>

      {/* UPLOAD BUTTON */}
      <div className="mb-10">
        <Link
          href="/documents/upload"
          className="inline-block px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          Upload New Document
        </Link>
      </div>

      {/* EMPTY STATE */}
      {documents.length === 0 ? (
        <div className="border-2 border-black rounded-lg p-10 text-center">
          <h2 className="text-xl font-bold text-black mb-3">
            No documents uploaded yet
          </h2>
          <p className="text-base font-medium text-black mb-6">
            Upload a document to start risk and sanction analysis
          </p>
          <Link
            href="/documents/upload"
            className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Upload Document
          </Link>
        </div>
      ) : (
        /* COLUMN-WISE DOCUMENT LIST */
        <div className="flex flex-col gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="border-2 border-black rounded-lg p-6 bg-white hover:shadow-lg transition"
            >
              <div className="mb-2">
                <h2 className="text-xl font-bold text-black">
                  {doc.title}
                </h2>
              </div>

              <p className="text-base font-medium text-black mb-4">
                {doc.content}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-black">
                  Document ID: {doc.id}
                </span>
                <span className="text-sm font-semibold text-black">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
