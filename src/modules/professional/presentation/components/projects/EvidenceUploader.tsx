import { useRef } from 'react';

export interface LocalEvidence {
  file: File;
  previewUrl: string;
}

interface EvidenceUploaderProps {
  evidences: LocalEvidence[];
  onChange: (evidences: LocalEvidence[]) => void;
  onToast: (message: string, type: 'success' | 'error') => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg'];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function EvidenceUploader({
  evidences,
  onChange,
  onToast,
}: EvidenceUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

const handleFiles = async (files: FileList | null) => {
  if (!files) return;
  const newEvidences: LocalEvidence[] = [];
  for (const file of Array.from(files)) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      onToast(`El archivo tiene un tipo no permitido`, 'error');
      continue;
    }
    if (file.size > MAX_FILE_SIZE) {
      onToast(`El tamaño de la imagen supera los 10MB`, 'error');
      continue;
    }
    const isRealImage = await validateImageSignature(file);
    if (!isRealImage) {
      onToast(
        `"${file.name}" no es una imagen válida. El contenido no corresponde a su extensión`,
        'error'
      );
      continue;
    }
    newEvidences.push({
      file,
      previewUrl: URL.createObjectURL(file),
    });
  }
  if (newEvidences.length > 0) {
    onChange([...evidences, ...newEvidences]);
  }
};

  const handleRemove = (index: number) => {
    URL.revokeObjectURL(evidences[index].previewUrl);
    onChange(evidences.filter((_, i) => i !== index));
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
  const validateImageSignature = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      const arr = new Uint8Array(e.target?.result as ArrayBuffer);
      const isPNG =
        arr[0] === 0x89 && arr[1] === 0x50 &&
        arr[2] === 0x4e && arr[3] === 0x47;
      const isJPEG =
        arr[0] === 0xff && arr[1] === 0xd8 && arr[2] === 0xff;
      resolve(isPNG || isJPEG);
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
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <p className="text-white text-sm font-medium">
            Haz clic para subir o arrastra archivos
          </p>
          <p className="text-[#6b7280] text-xs">PNG, JPG o JPEG hasta 10MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Uploaded files list */}
      {evidences.length > 0 && (
        <div className="space-y-2">
          <p className="text-[#9ca3af] text-sm font-medium">
            Archivos subidos ({evidences.length})
          </p>
          {evidences.map((ev, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-[#1a1c29] rounded-xl p-3 border border-white/5"
            >
              <img
                src={ev.previewUrl}
                alt={ev.file.name}
                className="w-10 h-10 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{ev.file.name}</p>
                <p className="text-[#6b7280] text-xs">
                  {formatFileSize(ev.file.size)} •{' '}
                  {ev.file.type.split('/')[1]?.toUpperCase()}
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
