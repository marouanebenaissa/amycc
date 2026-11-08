'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Flaticon } from '@/components/ui/Flaticon'

export interface ImageCropperModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string | null
  title?: string
  memberName?: string
  initialAspectRatio?: number // 1 for 1:1 square, 4/5 for portrait, etc.
  onCropComplete: (file: File, previewUrl: string) => Promise<void> | void
}

type AspectRatioPreset = {
  id: string
  labelAr: string
  labelFr: string
  ratio: number | null // null for free
  defaultWidth: number
  defaultHeight: number
  icon: string
}

const ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  {
    id: '1:1',
    labelAr: '1:1 مربع (للأعضاء والبروفايل)',
    labelFr: '1:1 Carré (Membres & Profil)',
    ratio: 1,
    defaultWidth: 600,
    defaultHeight: 600,
    icon: '👤',
  },
  {
    id: '4:5',
    labelAr: '4:5 بورتريه عمودي',
    labelFr: '4:5 Portrait',
    ratio: 4 / 5,
    defaultWidth: 600,
    defaultHeight: 750,
    icon: '📱',
  },
  {
    id: '3:4',
    labelAr: '3:4 عمودي كلاسيكي',
    labelFr: '3:4 Vertical',
    ratio: 3 / 4,
    defaultWidth: 600,
    defaultHeight: 800,
    icon: '🖼️',
  },
  {
    id: '16:9',
    labelAr: '16:9 عريض (أفقي)',
    labelFr: '16:9 Paysage',
    ratio: 16 / 9,
    defaultWidth: 800,
    defaultHeight: 450,
    icon: '🖥️',
  },
  {
    id: 'free',
    labelAr: 'حر (بدون تقييد)',
    labelFr: 'Libre',
    ratio: null,
    defaultWidth: 600,
    defaultHeight: 600,
    icon: '✂️',
  },
]

export function ImageCropperModal({
  isOpen,
  onClose,
  imageSrc,
  title = 'التحكم في أبعاد وقص الصورة',
  memberName,
  initialAspectRatio = 1,
  onCropComplete,
}: ImageCropperModalProps) {
  // Crop Transform State
  const [zoom, setZoom] = useState(1.0)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0) // 0, 90, 180, 270
  const [flipH, setFlipH] = useState(false)
  const [showGrid, setShowGrid] = useState(true)

  // Aspect ratio and output size
  const [selectedRatioId, setSelectedRatioId] = useState<string>(() => {
    if (initialAspectRatio === 1) return '1:1'
    if (Math.abs(initialAspectRatio - 4 / 5) < 0.05) return '4:5'
    if (Math.abs(initialAspectRatio - 16 / 9) < 0.05) return '16:9'
    return '1:1'
  })
  const [outputResolution, setOutputResolution] = useState<'standard' | 'high' | 'compact'>('standard')
  const [isProcessing, setIsProcessing] = useState(false)
  const [cropError, setCropError] = useState<string | null>(null)

  // Dragging state
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // Elements
  const viewportRef = useRef<HTMLDivElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imageElementRef = useRef<HTMLImageElement | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Find active preset
  const activePreset = ASPECT_RATIO_PRESETS.find((p) => p.id === selectedRatioId) || ASPECT_RATIO_PRESETS[0]

  // Reset transforms when new image is loaded
  useEffect(() => {
    if (!imageSrc || !isOpen) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      imageElementRef.current = img
      setImageLoaded(true)
      setZoom(1.0)
      setPan({ x: 0, y: 0 })
      setRotation(0)
      setFlipH(false)
      setCropError(null)
    }
    img.onerror = () => {
      setCropError('تعذر تحميل الصورة الأصلية. يرجى اختيار ملف صورة صالح.')
    }
    img.src = imageSrc
  }, [imageSrc, isOpen])

  // Target output dimensions based on preset and resolution
  const getTargetDimensions = useCallback(() => {
    let baseW = activePreset.defaultWidth
    let baseH = activePreset.defaultHeight

    if (outputResolution === 'high') {
      baseW = Math.round(baseW * 1.33)
      baseH = Math.round(baseH * 1.33)
    } else if (outputResolution === 'compact') {
      baseW = Math.round(baseW * 0.67)
      baseH = Math.round(baseH * 0.67)
    }

    return { width: baseW, height: baseH }
  }, [activePreset, outputResolution])

  // Draw the preview onto the small live preview canvas
  const drawPreview = useCallback(() => {
    const canvas = previewCanvasRef.current
    const img = imageElementRef.current
    if (!canvas || !img || !imageLoaded) return

    const { width: targetW, height: targetH } = getTargetDimensions()
    canvas.width = targetW
    canvas.height = targetH

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.clearRect(0, 0, targetW, targetH)

    ctx.save()
    // Move to center of canvas
    ctx.translate(targetW / 2, targetH / 2)

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180)

    // Apply flip
    if (flipH) {
      ctx.scale(-1, 1)
    }

    // Determine rotated dimensions
    const isSideways = rotation % 180 !== 0
    const rotatedW = isSideways ? img.naturalHeight : img.naturalWidth
    const rotatedH = isSideways ? img.naturalWidth : img.naturalHeight

    // Scale factor between target canvas and UI viewport (assuming 320px base viewport)
    const viewportBase = 320
    const scaleToCanvas = targetW / viewportBase

    // Apply pan offset
    ctx.translate(pan.x * scaleToCanvas, pan.y * scaleToCanvas)

    // Base scale to cover target
    const coverScale = Math.max(targetW / rotatedW, targetH / rotatedH)
    const finalScale = coverScale * zoom

    // Draw image centered
    ctx.drawImage(
      img,
      (-img.naturalWidth * finalScale) / 2,
      (-img.naturalHeight * finalScale) / 2,
      img.naturalWidth * finalScale,
      img.naturalHeight * finalScale
    )

    ctx.restore()
  }, [imageLoaded, rotation, flipH, pan, zoom, getTargetDimensions])

  useEffect(() => {
    drawPreview()
  }, [drawPreview])

  // Mouse / Touch Drag handlers for panning
  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    setIsDragging(true)
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    panStartRef.current = { ...pan }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    })
  }

  function handleMouseUp() {
    setIsDragging(false)
  }

  // Touch handlers
  function handleTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 1) {
      setIsDragging(true)
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      panStartRef.current = { ...pan }
    }
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!isDragging || e.touches.length !== 1) return
    const dx = e.touches[0].clientX - dragStartRef.current.x
    const dy = e.touches[0].clientY - dragStartRef.current.y
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    })
  }

  function handleTouchEnd() {
    setIsDragging(false)
  }

  // Wheel zoom inside viewport
  function handleWheel(e: React.WheelEvent) {
    e.preventDefault()
    const delta = -e.deltaY * 0.0015
    setZoom((prev) => Math.min(3.0, Math.max(0.8, Number((prev + delta).toFixed(2)))))
  }

  // Rotate 90 degrees clockwise
  function handleRotateClockwise() {
    setRotation((prev) => (prev + 90) % 360)
  }

  // Reset to default
  function handleReset() {
    setZoom(1.0)
    setPan({ x: 0, y: 0 })
    setRotation(0)
    setFlipH(false)
  }

  // Handle final crop & upload
  async function handleConfirmCrop() {
    const canvas = previewCanvasRef.current
    if (!canvas) return

    setIsProcessing(true)
    setCropError(null)

    try {
      // Force high-quality final draw
      drawPreview()

      // Convert canvas to blob (prefer webp, fallback to jpeg)
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b)
            else {
              canvas.toBlob((fallback) => resolve(fallback), 'image/jpeg', 0.92)
            }
          },
          'image/webp',
          0.92
        )
      })

      if (!blob) {
        throw new Error('فشل استخراج ملف الصورة المقصوصة.')
      }

      const randomSuffix = Math.random().toString(36).substring(2, 7)
      const fileName = `member-crop-${Date.now()}-${randomSuffix}.webp`
      const croppedFile = new File([blob], fileName, { type: 'image/webp' })
      const previewObjectUrl = URL.createObjectURL(blob)

      await onCropComplete(croppedFile, previewObjectUrl)
      onClose()
    } catch (err: unknown) {
      setCropError(err instanceof Error ? err.message : 'حدث خطأ أثناء معالجة وقص الصورة')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  const { width: currentTargetW, height: currentTargetH } = getTargetDimensions()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#e5e0d6] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#231f20] via-[#1a1718] to-[#231f20] text-white border-b-2 border-[#d2a82b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xl shrink-0">
              ✂️
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{title}</span>
                {memberName && (
                  <span className="text-xs font-bold text-[#ffd22f] bg-white/10 px-2 py-0.5 rounded-full">
                    {memberName}
                  </span>
                )}
              </h3>
              <p className="text-xs text-white/70">
                حدد الأبعاد والنسبة المطلوبة، واضبط التكبير والتموضع بالماوس، ثم احفظ للتطبيق المباشر.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Error message */}
        {cropError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-2">
            <span>⚠</span>
            <span>{cropError}</span>
          </div>
        )}

        {/* Modal Body: Two Columns (Interactive Crop Viewport + Controls & Previews) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Main Column: Crop Viewport (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-3">
            <div
              ref={viewportRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
              className={`relative w-full max-w-[380px] aspect-square rounded-2xl bg-[#181516] border-2 border-[#d2a82b] overflow-hidden select-none touch-none shadow-inner flex items-center justify-center ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            >
              {/* Image element being manipulated visually */}
              {imageSrc && imageLoaded && (
                <div
                  className="absolute pointer-events-none transition-transform duration-75"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${
                      flipH ? -zoom : zoom
                    }, ${zoom})`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt="Source"
                    className="max-w-none select-none pointer-events-none"
                    style={{
                      maxHeight: '360px',
                      maxWidth: '360px',
                      objectFit: 'contain',
                    }}
                    draggable={false}
                  />
                </div>
              )}

              {/* Aspect Ratio Framing Mask */}
              <div
                className="absolute inset-0 pointer-events-none border-2 border-[#ffd22f] shadow-[0_0_0_9999px_rgba(0,0,0,0.6)]"
                style={{
                  margin:
                    selectedRatioId === '4:5'
                      ? '10px 30px'
                      : selectedRatioId === '16:9'
                      ? '40px 10px'
                      : selectedRatioId === '3:4'
                      ? '10px 25px'
                      : '15px',
                  borderRadius: selectedRatioId === '1:1' ? '20px' : '14px',
                }}
              >
                {/* Rule of Thirds Grid */}
                {showGrid && (
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                    <div className="border-r border-b border-dashed border-white/70" />
                    <div className="border-r border-b border-dashed border-white/70" />
                    <div className="border-b border-dashed border-white/70" />
                    <div className="border-r border-b border-dashed border-white/70" />
                    <div className="border-r border-b border-dashed border-white/70" />
                    <div className="border-b border-dashed border-white/70" />
                    <div className="border-r border-dashed border-white/70" />
                    <div className="border-r border-dashed border-white/70" />
                    <div />
                  </div>
                )}
              </div>

              {/* Viewport instruction badge */}
              <div className="absolute bottom-2 inset-x-2 flex items-center justify-between pointer-events-none px-2 text-3xs text-white/80 font-bold bg-black/60 backdrop-blur-xs rounded-lg py-1">
                <span>🖱️ اسحب الصورة بالماوس لتحريك موضع الوجه</span>
                <span>عجلة الماوس للتكبير</span>
              </div>
            </div>

            {/* Quick Adjustment Toolbar */}
            <div className="w-full max-w-[380px] bg-[#FAF8F5] border border-[#e5e0d6] rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs font-bold">
              {/* Zoom Controls */}
              <div className="flex items-center gap-2 flex-1">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.8, Number((z - 0.1).toFixed(2))))}
                  className="w-7 h-7 rounded-lg bg-white border border-[#e5e0d6] hover:bg-gray-100 flex items-center justify-center font-bold text-sm cursor-pointer"
                  title="تصغير"
                >
                  −
                </button>
                <input
                  type="range"
                  min="0.8"
                  max="3.0"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-[#bd3227] cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3.0, Number((z + 0.1).toFixed(2))))}
                  className="w-7 h-7 rounded-lg bg-white border border-[#e5e0d6] hover:bg-gray-100 flex items-center justify-center font-bold text-sm cursor-pointer"
                  title="تكبير"
                >
                  +
                </button>
                <span className="text-3xs font-mono text-[#5C5A55] w-9 text-center">
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              <div className="h-4 w-px bg-[#e5e0d6]" />

              {/* Rotation & Flip */}
              <button
                type="button"
                onClick={handleRotateClockwise}
                className="p-1.5 rounded-lg bg-white border border-[#e5e0d6] hover:bg-gray-100 text-3xs flex items-center gap-1 cursor-pointer"
                title="تدوير 90 درجة"
              >
                <span>🔄</span>
                <span className="hidden sm:inline">تدوير</span>
              </button>

              <button
                type="button"
                onClick={() => setFlipH((f) => !f)}
                className={`p-1.5 rounded-lg border text-3xs flex items-center gap-1 cursor-pointer ${
                  flipH ? 'bg-[#bd3227] text-white border-[#bd3227]' : 'bg-white border-[#e5e0d6] hover:bg-gray-100 text-[#231f20]'
                }`}
                title="عكس أفقي"
              >
                <span>⇄</span>
              </button>

              <button
                type="button"
                onClick={() => setShowGrid((g) => !g)}
                className={`p-1.5 rounded-lg border text-3xs flex items-center gap-1 cursor-pointer ${
                  showGrid ? 'bg-[#d2a82b] text-white border-[#d2a82b]' : 'bg-white border-[#e5e0d6] hover:bg-gray-100 text-[#231f20]'
                }`}
                title="إظهار / إخفاء شبكة الأثلاث"
              >
                <span>▦</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-white border border-[#e5e0d6] hover:bg-gray-100 text-3xs text-rose-700 cursor-pointer"
                title="إعادة ضبط الموضع والتكبير"
              >
                ↺
              </button>
            </div>
          </div>

          {/* Right Column: Aspect Ratio Presets, Dimensions & Live Previews (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Aspect Ratio Selector */}
              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider text-[#5C5A55] mb-2">
                  📐 نسبة الأبعاد المطلوبة (Aspect Ratio):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ASPECT_RATIO_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedRatioId(preset.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-start flex items-center gap-2 cursor-pointer ${
                        selectedRatioId === preset.id
                          ? 'bg-[#231f20] text-white border-[#231f20] shadow-sm'
                          : 'bg-[#FAF8F5] text-[#231f20] border-[#e5e0d6] hover:bg-white'
                      }`}
                    >
                      <span>{preset.icon}</span>
                      <span className="truncate">{preset.id}</span>
                      {preset.id === '1:1' && (
                        <span className="ms-auto text-4xs bg-[#ffd22f] text-[#231f20] font-black px-1.5 py-0.2 rounded">
                          موصى به
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Output Resolution Presets */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-2xs font-bold uppercase tracking-wider text-[#5C5A55]">
                    🎯 دقة وأبعاد الإخراج النهائية:
                  </label>
                  <span className="text-2xs font-mono font-bold text-[#bd3227]">
                    {currentTargetW} × {currentTargetH} px
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setOutputResolution('standard')}
                    className={`py-1.5 px-2 rounded-xl text-3xs font-bold border text-center transition-all cursor-pointer ${
                      outputResolution === 'standard'
                        ? 'bg-[#bd3227] text-white border-[#bd3227]'
                        : 'bg-[#FAF8F5] text-[#5C5A55] border-[#e5e0d6] hover:bg-white'
                    }`}
                  >
                    قياسية (500-600px)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOutputResolution('high')}
                    className={`py-1.5 px-2 rounded-xl text-3xs font-bold border text-center transition-all cursor-pointer ${
                      outputResolution === 'high'
                        ? 'bg-[#bd3227] text-white border-[#bd3227]'
                        : 'bg-[#FAF8F5] text-[#5C5A55] border-[#e5e0d6] hover:bg-white'
                    }`}
                  >
                    عالية (800px)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOutputResolution('compact')}
                    className={`py-1.5 px-2 rounded-xl text-3xs font-bold border text-center transition-all cursor-pointer ${
                      outputResolution === 'compact'
                        ? 'bg-[#bd3227] text-white border-[#bd3227]'
                        : 'bg-[#FAF8F5] text-[#5C5A55] border-[#e5e0d6] hover:bg-white'
                    }`}
                  >
                    خفيفة (400px)
                  </button>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="bg-[#FAF8F5] rounded-2xl border border-[#e5e0d6] p-4 space-y-3">
                <div className="flex items-center justify-between text-2xs font-bold text-[#5C5A55]">
                  <span>👁️ المعاينة الحية المباشرة في الموقع:</span>
                  <span className="text-emerald-700">تحديث فوري تلقائي</span>
                </div>

                <div className="flex items-center justify-center gap-6 py-2">
                  {/* Square Card Member Avatar Preview */}
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-18 h-18 rounded-2xl overflow-hidden border-2 border-[#d2a82b] shadow-md bg-white relative">
                      <canvas
                        ref={previewCanvasRef}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-4xs font-bold text-[#5C5A55]">بطاقة الفريق (1:1)</span>
                  </div>

                  {/* Circular Avatar Preview */}
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-18 h-18 rounded-full overflow-hidden border-2 border-[#bd3227] shadow-md bg-white relative">
                      <canvas
                        ref={(el) => {
                          // Mirror drawing to circle canvas
                          if (!el || !previewCanvasRef.current) return
                          el.width = previewCanvasRef.current.width
                          el.height = previewCanvasRef.current.height
                          const ctx = el.getContext('2d')
                          if (ctx) {
                            ctx.drawImage(previewCanvasRef.current, 0, 0)
                          }
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-4xs font-bold text-[#5C5A55]">أيقونة دائرية</span>
                  </div>
                </div>

                <p className="text-3xs text-[#8a857b] text-center leading-relaxed">
                  سيتم حفظ الصورة المنسقة بصيغة WebP فائقة الجودة وسريعة التحميل لضمان سرعة تصفح استثنائية.
                </p>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e5e0d6]">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#5C5A55] hover:bg-gray-100 cursor-pointer transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmCrop}
                disabled={isProcessing || !imageLoaded}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#bd3227] hover:bg-[#a3261c] shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span>⏳</span>
                    <span>جارٍ المعالجة والرفع...</span>
                  </>
                ) : (
                  <>
                    <Flaticon name="check" size={14} className="text-white shrink-0" />
                    <span>قص وتأكيد الصورة ({currentTargetW}×{currentTargetH})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
