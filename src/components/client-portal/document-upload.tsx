"use client";

import { useState } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";

type Control = {
  id: string;
  control: {
    controlId: string;
    practice: string;
    domain: string;
  };
  evidence: any[];
};

type DocumentUploadSectionProps = {
  organizationId: string;
  controls: Control[];
};

export function DocumentUploadSection({
  organizationId,
  controls,
}: DocumentUploadSectionProps) {
  const [selectedControl, setSelectedControl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedControl) return;

    setUploading(true);

    try {
      // TODO: Implement actual file upload to S3/R2
      // For now, this is a placeholder
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("controlInstanceId", selectedControl);
      formData.append("description", description);
      formData.append("organizationId", organizationId);

      // await fetch("/api/evidence/upload", {
      //   method: "POST",
      //   body: formData,
      // });

      alert("File upload feature requires S3/R2 configuration");

      // Reset form
      setSelectedFile(null);
      setDescription("");
      setSelectedControl("");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-lg border-2 border-dashed border-slate-300 bg-white p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-full bg-blue-100 p-2">
          <Upload className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900">Upload Evidence</h2>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        {/* Control Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select Control <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedControl}
            onChange={(e) => setSelectedControl(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            required
          >
            <option value="">Choose a control...</option>
            {controls.map((control) => (
              <option key={control.id} value={control.id}>
                {control.control.controlId} - {control.control.domain} (
                {control.evidence.length} evidence)
              </option>
            ))}
          </select>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select File <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            {!selectedFile ? (
              <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 hover:border-blue-400 hover:bg-blue-50">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-slate-400" />
                  <p className="mt-2 text-sm font-medium text-slate-700">
                    Click to select file
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    PDF, Word, Excel, Images up to 50MB
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                />
              </label>
            ) : (
              <div className="flex items-center justify-between rounded-lg border border-slate-300 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="rounded-lg p-2 text-slate-600 hover:bg-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Add notes about this document..."
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Upload Notice */}
        <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            <strong>Note:</strong> File upload requires S3 or Cloudflare R2 configuration.
            Contact your MSP administrator to enable this feature.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedFile || !selectedControl || uploading}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : "Upload Document"}
        </button>
      </form>
    </div>
  );
}
