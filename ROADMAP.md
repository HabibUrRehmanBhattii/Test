# 🗺️ Pill Counter PWA - Development Roadmap

## Phase Timeline (15 Days)

```
DAY 1         DAY 2-3       DAY 4-7          DAY 8-10       DAY 11-12     DAY 13-14     DAY 15
┌─────────┬──────────┬──────────────────┬─────────────┬──────────────┬──────────────┬─────────┐
│ SETUP   │ CAMERA   │ AI INTEGRATION   │ RESULTS UI  │ DATA LAYER   │ TESTING      │ DEPLOY  │
├─────────┼──────────┼──────────────────┼─────────────┼──────────────┼──────────────┼─────────┤
│ • Init  │ • Capture│ • YOLOv8 Model   │ • Display   │ • Dexie.js   │ • Test Set   │ • Build │
│ • PWA   │ • Upload │ • ONNX Runtime   │ • Overlay   │ • IndexedDB  │ • Accuracy   │ • Deploy│
│ • Docs  │ • Preview│ • Inference      │ • Correct   │ • History    │ • Profile    │ • Launch│
└─────────┴──────────┴──────────────────┴─────────────┴──────────────┴──────────────┴─────────┘
  Phase 0   Phase 1      Phase 2           Phase 3       Phase 4        Phase 5       Phase 6
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PILL COUNTER PWA                         │
│                   (Offline-First App)                       │
└─────────────────────────────────────────────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    ┌────▼────┐      ┌──────▼──────┐    ┌─────▼──────┐
    │ INPUT   │      │ PROCESSING  │    │ OUTPUT     │
    └────┬────┘      └──────┬──────┘    └─────┬──────┘
         │                  │                  │
    ┌────▼─────────┐   ┌────▼──────────┐  ┌───▼──────────┐
    │ Camera       │   │ YOLOv8-nano   │  │ Detection    │
    │ (getUserM)  │   │ (ONNX Runtime)│  │ Results      │
    │             │   │               │  │              │
    │ OR          │   │ 416x416 Input │  │ Bounding     │
    │ Gallery     │   │ Inference (ms)│  │ Boxes        │
    │ (File API)  │   │               │  │              │
    │             │   │ >90% Accuracy │  │ Pill Count   │
    └─────────────┘   └───────────────┘  └──────────────┘
         │
         │ (Canvas)
         │
    ┌────▼─────────┐
    │ Preprocessing│
    │              │
    │ • Normalize  │
    │ • Resize     │
    │ • EXIF Fix   │
    └──────────────┘
```

---

## Data Flow Diagram

```
Mobile Camera/Gallery
         │
         ▼
    ┌─────────────┐
    │   Capture   │ (Phase 1)
    │   Component │
    └──────┬──────┘
           │
           ▼
    ┌──────────────┐
    │ Image        │ Canvas resize,
    │ Processing   │ normalize, EXIF
    └──────┬───────┘
           │
           ▼
    ┌──────────────────────┐
    │ ONNX Inference       │ (Phase 2)
    │                      │
    │ Model: yolov8-pills  │ 416x416 input
    │ Speed: ~29ms         │ 90%+ accuracy
    │ Size: 5-8MB          │
    └──────┬───────────────┘
           │
           ▼
    ┌──────────────────┐
    │ Post-Processing  │ Filter detections
    │                  │ Score & count
    └──────┬───────────┘
           │
           ▼
    ┌──────────────────┐
    │ Results UI       │ (Phase 3)
    │                  │ Display boxes
    │ • Overlay        │ Show count
    │ • Count          │ Manual adjust
    └──────┬───────────┘
           │
      ┌────┴─────┐
      │           │
      ▼           ▼
   [Save]    [Discard]
      │
      ▼
    ┌──────────────────┐
    │ IndexedDB        │ (Phase 4)
    │ (Dexie.js)       │
    │                  │
    │ • History        │ Persistent
    │ • Timestamps     │ 100+ results
    │ • Thumbnails     │ No cloud
    └──────────────────┘
```

---

## Technology Stack Map

```
┌──────────────────────────────────────────────────────┐
│          BROWSER (JavaScript Runtime)                │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Next.js + React (UI Framework)                     │
│  ├─ App Router (routing)                            │
│  ├─ Server Components (SSR when needed)             │
│  └─ Client Components (interactive UI)              │
│                                                      │
│  Tailwind CSS (Styling)                             │
│  ├─ Responsive design                               │
│  └─ Dark mode support                               │
│                                                      │
│  @serwist/next (PWA - Service Workers)              │
│  ├─ Offline caching                                 │
│  ├─ Asset caching (model file)                      │
│  └─ Install prompt                                  │
│                                                      │
│  ONNX Runtime Web (AI Inference)                    │
│  ├─ WebAssembly execution                           │
│  ├─ Load yolov8-pills.onnx                          │
│  └─ CPU/GPU optimization                            │
│                                                      │
│  Canvas API (Image Processing)                      │
│  ├─ Resize/normalize images                         │
│  ├─ Draw overlays                                   │
│  └─ EXIF rotation fix                               │
│                                                      │
│  Dexie.js (Database Wrapper)                        │
│  └─ IndexedDB (Local Persistence)                   │
│     ├─ Save detection results                       │
│     ├─ Store thumbnails (compressed)                │
│     └─ 50MB storage quota                           │
│                                                      │
│  Web APIs                                           │
│  ├─ getUserMedia (camera)                           │
│  ├─ File API (gallery import)                       │
│  └─ Blob API (image storage)                        │
│                                                      │
└──────────────────────────────────────────────────────┘
           │
           │ Static Export (npm run build)
           ▼
┌──────────────────────────────────────────────────────┐
│          GitHub Pages (Static Hosting)               │
│  ├─ HTML/CSS/JS files                               │
│  ├─ Manifest.json                                   │
│  ├─ Service worker (sw.js)                          │
│  └─ yolov8-pills.onnx (5-8MB)                       │
└──────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
┌─ App (Next.js Root)
│
├─ Layout (Header, Nav)
│
├─ CameraCapture Component (Phase 1)
│  ├─ Video Preview
│  ├─ Capture Button
│  ├─ Gallery Import
│  └─ Permissions Handler
│
├─ PillDetection Hook (Phase 2)
│  ├─ Load ONNX Model
│  ├─ Run Inference
│  └─ Error Handling
│
├─ PillResults Component (Phase 3)
│  ├─ Image with Overlay
│  ├─ Pill Count Display
│  ├─ Confidence Score
│  ├─ Manual Correction
│  └─ Save Button
│
├─ History Component (Phase 4)
│  ├─ Results List
│  ├─ Search/Filter
│  ├─ Export Button
│  └─ Delete Entry
│
└─ Database Service (Phase 4)
   ├─ CRUD Operations
   ├─ Compression
   └─ Backup/Export
```

---

## State Management Flow

```
User Action
    │
    ▼
  React Hook (usePillDetection)
    │
    ├─ Loading state
    ├─ Error state
    ├─ Detection results
    └─ Manual corrections
         │
         ▼
  Component Re-render
    │
    ├─ Display results
    ├─ Show confidence
    └─ Update UI
         │
         ▼
  User Saves Result
    │
    ▼
  Dexie Database
    │
    ├─ Store in IndexedDB
    ├─ Timestamp
    ├─ Thumbnail image
    └─ Metadata
         │
         ▼
  History List Updated
```

---

## Performance Targets

```
Metric                  Target      YOLOv8    Status
────────────────────────────────────────────────────
Model Size              < 10MB      5-8MB     ✅
Bundle Size             < 15MB      12-14MB   ✅
Inference Time          < 5s        ~29ms     ✅ (220x faster)
First Paint             < 2s        Variable  🔄
Accuracy (pills)        > 90%       90-95%    ✅
Supported Devices       iOS/And     All       ✅
Offline Support         100%        Yes       ✅
Storage Capacity        50MB        <50MB     ✅
```

---

## Deployment Pipeline

```
┌──────────────────┐
│ Local Development│
│ (npm run dev)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Build             │
│ (npm run build)   │
└────────┬─────────┘
         │
         ▼ (out/ directory)
┌──────────────────┐
│ GitHub Repo      │
│ (git push)       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ GitHub Actions   │
│ Deploy to Pages  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Live PWA         │
│ (user.github.io) │
└──────────────────┘
         │
         ▼
    User Install
         │
         ▼
  Home Screen App
    (Offline)
```

---

## File Organization

```
pill-counter/
├── public/
│   ├── models/
│   │   └── yolov8-pills.onnx      ◄─ AI Model (5-8MB)
│   ├── icons/
│   │   ├── icon-192x192.png       ◄─ App icon
│   │   └── icon-512x512.png
│   ├── manifest.json              ◄─ PWA metadata
│   └── sw.js                      ◄─ Service worker (generated)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx             ◄─ Root layout
│   │   ├── page.tsx               ◄─ Main page
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── CameraCapture.tsx      ◄─ Phase 1
│   │   ├── PillResults.tsx        ◄─ Phase 3
│   │   ├── History.tsx            ◄─ Phase 4
│   │   └── Layout.tsx
│   │
│   ├── lib/
│   │   ├── inferenceEngine.ts     ◄─ Phase 2
│   │   ├── database.ts            ◄─ Phase 4
│   │   └── utils.ts
│   │
│   └── hooks/
│       └── usePillDetection.ts    ◄─ Phase 2
│
├── next.config.js                ◄─ PWA + export config
├── tsconfig.json
├── package.json
├── PROJECT_RULES.md              ◄─ This project
├── IMPLEMENTATION_PLAN.md
├── TODO.md
└── SUMMARY.md
```

---

## Decision Tree: AI Model Selection

```
                START: Choose AI Model
                       │
           ┌───────────┴───────────┐
           │                       │
      Need >90%              Need Quick MVP?
      Accuracy?                  │
           │                 ────┴────
           │                │        │
          YES              NO      YES
           │               │        │
           ▼               ▼        ▼
    Use YOLO8      Use Generic   Use MediaPipe
    (Roboflow)     OpenCV        EfficientDet
           │               │        │
           │               │        │
      Train or       Manual Tune  Out-of-box
      Download       Detection    Detection
      Pre-trained
           │               │        │
           │               │        │
      Convert to      Python-only Browser-ready
      ONNX format      Tool        ✅
           │               │
           │               │
      ONNX Runtime    Not suitable
      (Browser)       for browser
           │
      ✅ RECOMMENDED
```

---

## Testing Strategy

```
Phase 1: Manual Testing
├─ Camera capture works
├─ Gallery import works
└─ Images display correctly

Phase 2: Accuracy Testing
├─ Test on 50+ pill images
├─ Measure precision/recall
├─ Calculate F1-score
└─ Target: >90%

Phase 3: Performance Testing
├─ Measure inference time
├─ Profile memory usage
├─ Check bundle size
└─ Optimize if needed

Phase 4: Device Testing
├─ iOS 12+ (Safari)
├─ Android 8+ (Chrome)
├─ Tablet responsiveness
└─ Offline mode

Phase 5: UAT (User Acceptance)
├─ Edge cases (overlapping pills)
├─ Blurred images
├─ Mixed sizes/colors
└─ Error handling

Phase 6: PWA Testing
├─ Install prompt
├─ App icon display
├─ Splash screen
└─ Offline functionality
```

---

## Success Checklist ✅

**Phase 0 Complete:**
- [ ] Next.js project initializes
- [ ] Service worker setup working
- [ ] App icons created
- [ ] Manifest valid (Lighthouse)

**Phase 1 Complete:**
- [ ] Camera preview displays
- [ ] Capture button works
- [ ] Gallery import functional
- [ ] Images display with correct orientation

**Phase 2 Complete:**
- [ ] YOLOv8 model loads
- [ ] ONNX runtime initialized
- [ ] Inference runs < 5s
- [ ] Accuracy > 90% on test set

**Phase 3 Complete:**
- [ ] Results display correctly
- [ ] Overlay shows detections
- [ ] Manual correction tools work
- [ ] Save button functional

**Phase 4 Complete:**
- [ ] IndexedDB stores results
- [ ] History list displays
- [ ] Export works (JSON/CSV)
- [ ] 100+ results supported

**Phase 5 Complete:**
- [ ] Accuracy validated
- [ ] Performance profiled
- [ ] All devices tested
- [ ] Critical bugs fixed

**Phase 6 Complete:**
- [ ] App live on GitHub Pages
- [ ] Installs on iOS
- [ ] Installs on Android
- [ ] Works offline
- [ ] Documentation complete

---

## 🎯 Ready to Start?

1. **Read** [SUMMARY.md](SUMMARY.md) for quick overview
2. **Review** [PROJECT_RULES.md](PROJECT_RULES.md) for constraints
3. **Check** [TODO.md](TODO.md) for Phase 0 tasks
4. **Follow** [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) step-by-step

**Good luck! 🚀**
