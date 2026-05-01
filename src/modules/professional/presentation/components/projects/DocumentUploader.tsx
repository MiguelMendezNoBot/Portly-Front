import { useRef } from 'react';
import { ProjectDocument } from '../../../domain/entities/Project';

export interface LocalDocument {
  file: File;
}

interface DocumentUploaderProps {
  documents: LocalDocument[];
  onChange: (documents: LocalDocument[]) => void;
  onToast: (message: string, type: 'success' | 'error') => void;
  existingDocuments?: ProjectDocument[];
  onRemoveExisting?: (index: number) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentUploader({
  documents,
  onChange,
  onToast,
  existingDocuments = [],
  onRemoveExisting,
}: DocumentUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const newDocuments: LocalDocument[] = [];
    for (const file of Array.from(files)) {
      if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
        onToast(`El archivo ${file.name} tiene un formato no permitido`, 'error');
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        onToast(`El tamaño del archivo ${file.name} supera los 10MB`, 'error');
        continue;
      }
      
      const isRealDocument = await validateDocumentSignature(file);
      if (!isRealDocument) {
        onToast(
          `"${file.name}" no parece un documento válido.`,
          'error'
        );
        continue;
      }

      newDocuments.push({
        file,
      });
    }
    if (newDocuments.length > 0) {
      onChange([...documents, ...newDocuments]);
    }
  };

  const handleRemove = (index: number) => {
    onChange(documents.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const validateDocumentSignature = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        const arr = new Uint8Array(e.target?.result as ArrayBuffer);
        // PDF Magic Number: %PDF (0x25 0x50 0x44 0x46)
        const isPDF = arr[0] === 0x25 && arr[1] === 0x50 && arr[2] === 0x44 && arr[3] === 0x46;
        // DOC/DOCX basic checks are more complex (OLE2 format or ZIP format), so we just allow them 
        // if they pass extension/mime type for simplicity in frontend, but PDF we can check.
        const name = file.name.toLowerCase();
        if (name.endsWith('.pdf')) {
            resolve(isPDF);
        } else {
            resolve(true); // Trust the extension/mime type for Word docs for now
        }
      };
      reader.readAsArrayBuffer(file.slice(0, 4));
    });
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-[#6c63ff]/40 transition-colors"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-[#1a1c29] rounded-xl flex items-center justify-center border border-white/10">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <p className="text-white text-sm font-medium">
            Haz clic para subir o arrastra documentos
          </p>
          <p className="text-[#6b7280] text-xs">PDF, DOC o DOCX hasta 10MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Uploaded files list */}
      {(documents.length > 0 || existingDocuments.length > 0) && (
        <div className="space-y-2">
          <p className="text-[#9ca3af] text-sm font-medium">
            Documentos subidos ({documents.length + existingDocuments.length})
          </p>
          
          {/* Existing Documents */}
          {existingDocuments.map((doc, index) => (
            <div
              key={`existing-${index}`}
              className="flex items-center gap-3 bg-[#1a1c29] rounded-xl p-3 border border-white/5"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{doc.nombre}</p>
                <p className="text-[#6b7280] text-xs">
                  {formatFileSize(doc.pesoBytes)} • {doc.tipo?.toUpperCase()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemoveExisting && onRemoveExisting(index)}
                className="text-[#9ca3af] hover:text-red-400 transition-colors shrink-0 p-1"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}

          {/* Local Documents */}
          {documents.map((doc, index) => (
            <div
              key={`local-${index}`}
              className="flex items-center gap-3 bg-[#1a1c29] rounded-xl p-3 border border-white/5"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{doc.file.name}</p>
                <p className="text-[#6b7280] text-xs">
                  {formatFileSize(doc.file.size)} •{' '}
                  {doc.file.name.split('.').pop()?.toUpperCase() || 'DOCUMENTO'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-[#9ca3af] hover:text-red-400 transition-colors shrink-0 p-1"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
