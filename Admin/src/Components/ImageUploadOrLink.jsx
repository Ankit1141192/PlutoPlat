import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Link as LinkIcon, Upload, X, CheckCircle2 } from 'lucide-react';

const ImageUploadOrLink = ({
  value = '',
  onChange,
  label = 'Property Image',
  required = false,
  helperText = 'Provide a high-resolution image via web link or direct file upload.',
}) => {
  // Decide initial mode based on value: if it starts with data:image, default to 'upload', else 'link'
  const isDataUrl = typeof value === 'string' && value.startsWith('data:image');
  const [mode, setMode] = useState(isDataUrl ? 'upload' : 'link'); // 'link' | 'upload'
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert('Image file size must be under 15MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange?.(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    onChange?.('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {/* Label and mode toggle buttons */}
      <div className="flex items-center justify-between">
        <label className="block text-[12px] font-medium text-[#3F433E]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {/* Condition Toggle: Link OR Upload */}
        <div className="inline-flex rounded-lg border border-[#DDD8CE] bg-[#F1EDE3]/50 p-0.5 text-[11px]">
          <button
            type="button"
            onClick={() => setMode('link')}
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
              mode === 'link'
                ? 'bg-[#1C201C] text-white shadow-xs'
                : 'text-[#6E6D66] hover:text-[#1C201C]'
            }`}
          >
            <LinkIcon size={12} />
            <span>Image Link</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
              mode === 'upload'
                ? 'bg-[#1C201C] text-white shadow-xs'
                : 'text-[#6E6D66] hover:text-[#1C201C]'
            }`}
          >
            <Upload size={12} />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Input depending on mode */}
      {mode === 'link' ? (
        <div className="space-y-2">
          <div className="relative">
            <input
              type="url"
              required={required && !value}
              placeholder=" any image link"
              // value={value || ''}
              onChange={(e) => onChange?.(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#DDD8CE] bg-[#FBFAF7] pr-9 pl-3.5 text-xs text-[#1C201C] transition focus:border-[#B49A70] focus:outline-none focus:ring-2 focus:ring-[#B49A70]/20"
            />
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#9A978C] hover:text-[#1C201C] cursor-pointer"
                title="Clear image"
              >
                {/* <X size={15} /> */}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
          />
          <label
            htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#DDD8CE] bg-[#FAF8F5] p-4 text-center cursor-pointer transition hover:border-[#B49A70] hover:bg-white"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAE6DE] text-[#B49A70]">
              <Upload size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1C201C]">
                Click to browse & upload image from your device
              </p>
              <p className="text-[10px] text-[#77766E] mt-0.5">Supports PNG, JPEG, WebP, GIF up to 15MB</p>
            </div>
          </label>
        </div>
      )}

      

      {helperText && !value && <p className="text-[11px] text-[#8A887F]">{helperText}</p>}
    </div>
  );
};

export default ImageUploadOrLink;
