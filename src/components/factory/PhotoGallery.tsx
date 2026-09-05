"use client";

import { useRef, useState } from "react";
import { EquipmentPhoto } from "@/types";
import { usePersistedList } from "@/lib/storage";
import { Camera, Trash2, Star, Upload } from "lucide-react";

const MAX_FILE_MB = 4;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const EMPTY_PHOTOS: EquipmentPhoto[] = [];

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function PhotoGallery({ equipmentId, equipmentName }: { equipmentId: string; equipmentName: string }) {
  const { items: photos, setItems: persist } = usePersistedList<EquipmentPhoto>(`photos:${equipmentId}`, EMPTY_PHOTOS);
  const [preview, setPreview] = useState<EquipmentPhoto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    const next = [...photos];
    for (const file of Array.from(files)) {
      if (!ACCEPTED.includes(file.type)) {
        setError("JPG·PNG·WEBP 이미지 파일만 업로드할 수 있습니다.");
        continue;
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        setError(`파일 크기는 ${MAX_FILE_MB}MB 이하만 가능합니다. (${file.name})`);
        continue;
      }
      const dataUrl = await readAsDataURL(file);
      next.push({
        id: `${equipmentId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        url: dataUrl,
        caption: "",
        takenAt: new Date().toISOString().slice(0, 10),
        isRepresentative: next.length === 0,
        uploadedAt: new Date().toISOString(),
      });
    }
    try {
      persist(next);
    } catch {
      setError("사진 저장에 실패했습니다. 브라우저 저장공간이 가득 찼을 수 있습니다.");
    }
  }

  function removePhoto(id: string) {
    if (!window.confirm("이 사진을 삭제하시겠습니까? 삭제 후에는 되돌릴 수 없습니다.")) return;
    persist(photos.filter((p) => p.id !== id));
  }

  function setRepresentative(id: string) {
    persist(photos.map((p) => ({ ...p, isRepresentative: p.id === id })));
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Camera size={14} /> 설비사진 ({photos.length}장)
        </p>
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1 rounded-md border border-[#e5e7eb] bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
        >
          <Upload size={12} /> 사진 추가
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && <p className="mb-2 rounded bg-red-50 px-2 py-1 text-[11px] text-red-600">{error}</p>}

      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#e5e7eb] bg-slate-50 py-6 text-center">
          <Camera className="mb-1 text-slate-400" size={22} />
          <p className="text-xs font-medium text-slate-500">사진 등록 예정</p>
          <p className="text-[10px] text-slate-400">{equipmentName}의 실제 현장사진을 업로드하세요</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
          {photos.map((p) => (
            <div key={p.id} className="group relative aspect-square overflow-hidden rounded-md border border-[#e5e7eb]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt={p.caption || equipmentName}
                className="h-full w-full cursor-pointer object-cover"
                onClick={() => setPreview(p)}
              />
              {p.isRepresentative && (
                <span className="absolute left-1 top-1 rounded bg-amber-400 px-1 text-[9px] font-bold text-white">
                  대표
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-end gap-0.5 bg-black/40 p-0.5 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => setRepresentative(p.id)}
                  className="rounded bg-white/90 p-1 text-amber-500"
                  title="대표사진으로 지정"
                >
                  <Star size={10} />
                </button>
                <button
                  onClick={() => removePhoto(p.id)}
                  className="rounded bg-white/90 p-1 text-red-500"
                  title="삭제"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-6"
          onClick={() => setPreview(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview.url} alt={preview.caption || ""} className="max-h-[85vh] max-w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
