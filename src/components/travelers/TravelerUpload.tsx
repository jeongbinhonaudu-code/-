"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

const MAX_FILE_MB = 20;

export function TravelerUpload({ onFiles }: { onFiles: (files: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function process(fileList: FileList | null) {
    if (!fileList) return;
    const files: File[] = [];
    for (const f of Array.from(fileList)) {
      if (f.type !== "application/pdf") {
        setError("PDF 파일만 업로드할 수 있습니다.");
        continue;
      }
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        setError(`파일 크기는 ${MAX_FILE_MB}MB 이하만 가능합니다. (${f.name})`);
        continue;
      }
      files.push(f);
    }
    if (files.length > 0) {
      setError(null);
      onFiles(files);
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          process(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors " +
          (dragging ? "border-sky-400 bg-sky-500/10" : "border-[#e5e7eb] bg-slate-50 hover:bg-slate-50")
        }
      >
        <UploadCloud className="mb-2 text-slate-400" size={28} />
        <p className="text-sm font-semibold text-slate-400">트레블러 PDF를 드래그하거나 클릭하여 업로드</p>
        <p className="mt-1 text-xs text-slate-400">다중 업로드 지원 · PDF만 · 파일당 {MAX_FILE_MB}MB 이하</p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={(e) => process(e.target.files)}
        />
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <p className="mt-2 text-[11px] text-slate-400">
        ※ 업로드 후 트레블러 번호·제품명·재질·수량·시작일·완료일은 OCR 자동인식을 시뮬레이션하지 않고 담당자가 원본과
        대조하여 직접 입력·검증합니다 (OCR 엔진 연동은 2단계 구현 예정).
      </p>
    </div>
  );
}
