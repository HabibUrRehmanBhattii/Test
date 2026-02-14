# Pill Counter PWA - Implementation Plan (YOLOv8-ONNX)

## Overview
Replace generic OpenCV contour detection with **YOLOv8-nano pill-specific model** via ONNX Runtime for 90%+ accuracy and 29ms inference time.

---

## Phase 0: Project Setup (Day 1)

### Task 0.1: Initialize Repository
```bash
# Initialize Next.js with TypeScript
npx create-next-app@latest pill-counter --typescript --tailwind

# Add dependencies
npm install onnxruntime-web dexie @serwist/next
npm install --save-dev typescript @types/node @types/react
```

### Task 0.2: Configure PWA (@serwist/next)
- Create `public/manifest.json` (app metadata)
- Generate app icons (192x192, 512x512)
- Update `next.config.js` for PWA
- Create service worker config

### Task 0.3: Create Project Documentation
- ✅ PROJECT_RULES.md (constraints & requirements)
- ✅ README.md (quick start guide)
- ✅ ARCHITECTURE.md (tech decisions)

**Verification**: `npm run dev` runs without errors

---

## Phase 1: Camera Capture (Days 2-3)

### Task 1.1: Camera Component
Create `components/CameraCapture.tsx`:
- Real camera preview (getUserMedia API)
- Capture button (save image to canvas)
- Toggle front/rear camera
- Permission handling

### Task 1.2: Gallery Import Fallback
- Image file upload from device
- HEIC to JPEG conversion (iOS support)
- Preview before submission
- Drag-and-drop support

### Task 1.3: Image Preprocessing
- Canvas-based image resizing
- Orientation correction (EXIF metadata)
- Format validation (JPEG/PNG/WebP)
- Memory optimization

**Acceptance**: Camera works on mobile, captures clear images

---

## Phase 2: AI Model Integration (Days 4-7)

### Task 2.1: Download & Prepare YOLOv8 Model
**Model Sources:**
- Use Roboflow public pill dataset: https://universe.roboflow.com/?search=pill
- Or download pre-trained: https://github.com/ultralytics/ultralytics
- Convert to ONNX format: `yolo export format=onnx imgsz=416`

**Store in**: `public/models/yolov8-pills.onnx` (5-8MB)

### Task 2.2: ONNX Runtime Setup
Create `lib/inferenceEngine.ts`:
```typescript
import * as ort from 'onnxruntime-web';

export class PillDetector {
  private session: ort.InferenceSession | null = null;
  
  async initialize() {
    // Load model from public/models/yolov8-pills.onnx
    this.session = await ort.InferenceSession.create(
      '/models/yolov8-pills.onnx'
    );
  }
  
  async detectPills(imageData: ImageData) {
    // Preprocess: resize to 416x416, normalize
    const tensor = this.preprocessImage(imageData);
    
    // Run inference
    const results = await this.session!.run({
      images: tensor
    });
    
    // Post-process: extract detections, filter by confidence
    return this.postprocessDetections(results);
  }
  
  private preprocessImage(imageData: ImageData): ort.Tensor {
    // Resize to 416x416, convert RGB to normalized float
    // Return ONNX Tensor format
  }
  
  private postprocessDetections(results: any) {
    // Extract bounding boxes, classes, confidences
    // Filter: confidence > 0.5
    // Count: number of detections = pill count
    // Return: { count, boxes, confidences }
  }
}
```

### Task 2.3: Integration with React
Create `hooks/usePillDetection.ts`:
- Load model once (memoized)
- Inference on image change
- Error handling for WASM loading
- Loading states (UI feedback)

### Task 2.4: Performance Optimization
- Model lazy loading (only load when camera/upload used)
- Worker thread for inference (non-blocking UI)
- Confidence scoring visualization

**Performance Target**: < 5 seconds for 416x416 image on mobile CPU

---

## Phase 3: Results UI (Days 8-10)

### Task 3.1: Results Display Component
Create `components/PillResults.tsx`:
- Detected pill count (large, prominent)
- Confidence score visualization
- Bounding box overlay on image
- Pill location highlighting

### Task 3.2: Manual Correction Tools
- Increment/decrement count buttons
- Tap-to-select/deselect individual pills
- Remove false positives
- Add missed detections (tap empty area)

### Task 3.3: History & Save
- Save result with timestamp
- Display detection thumbnail
- Save to local state
- Quick re-count option

### Task 3.4: Responsive Design
- Mobile-first layout
- Tablet optimization
- Dark mode support
- Accessibility (WCAG 2.1 AA)

**UX Target**: 5 taps to complete pill count from app open

---

## Phase 4: Data Persistence (Days 11-12)

### Task 4.1: Dexie.js Database Setup
Create `lib/database.ts`:
```typescript
import Dexie, { Table } from 'dexie';

export interface PillCount {
  id?: number;
  timestamp: Date;
  count: number;
  confidence: number;
  image: Blob;
  notes?: string;
}

export class PillCounterDB extends Dexie {
  pillCounts!: Table<PillCount>;

  constructor() {
    super('PillCounterDB');
    this.version(1).stores({
      pillCounts: '++id, timestamp'
    });
  }
}

export const db = new PillCounterDB();
```

### Task 4.2: CRUD Operations
- Create: Save detection result
- Read: Display history list
- Update: Modify count/notes
- Delete: Remove entry

### Task 4.3: Export Functionality
- JSON export (all history)
- CSV export (tabular format)
- Download to device

### Task 4.4: Storage Management
- Compressed image storage (thumbnails)
- Prune old entries (optional)
- Storage quota monitoring

**Data Target**: Support 100+ entries without exceeding 50MB

---

## Phase 5: Testing & Optimization (Days 13-14)

### Task 5.1: Create Test Dataset
- Gather 50+ real pharmacy pill photos
- Include edge cases: overlapping, blurred, mixed sizes
- Annotate ground truth counts

### Task 5.2: Accuracy Measurement
- Test model on dataset
- Calculate: Precision, Recall, F1-Score
- Target: > 90% accuracy
- Document failure cases

### Task 5.3: Performance Profiling
- Measure inference time per device
- Monitor memory usage
- Optimize bottlenecks
- Verify bundle size < 15MB

### Task 5.4: Cross-Device Testing
- Test on iPhone 12, 13, 14+
- Test on Android flagship (2020+)
- Verify camera permissions
- Check offline functionality

### Task 5.5: Bug Fixes & Polish
- Fix UI glitches
- Handle edge cases
- Complete documentation

**QA Gate**: All tests pass, 90%+ accuracy confirmed

---

## Phase 6: Deployment (Day 15)

### Task 6.1: Static Export Configuration
```javascript
// next.config.js
module.exports = {
  output: 'export',
  images: { unoptimized: true }
};
```

### Task 6.2: GitHub Pages Setup
```bash
npm run build  # Generates out/ directory
# Deploy out/ to gh-pages branch
```

### Task 6.3: PWA Installation Testing
- Test "Add to Home Screen" on iOS
- Test "Install" on Android
- Verify offline functionality
- Test background sync (if added)

### Task 6.4: Launch
- Update README with setup instructions
- Create issue template
- Tag v1.0.0 release
- Publish on GitHub

---

## File Structure
```
pill-counter/
├── public/
│   ├── models/
│   │   └── yolov8-pills.onnx         # AI model (5-8MB)
│   ├── icons/
│   │   ├── icon-192x192.png
│   │   └── icon-512x512.png
│   └── manifest.json
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                   # Main UI
│   │   └── globals.css
│   ├── components/
│   │   ├── CameraCapture.tsx          # Camera + upload
│   │   ├── PillResults.tsx            # Detection UI
│   │   └── History.tsx                # Past results
│   ├── lib/
│   │   ├── inferenceEngine.ts         # ONNX inference
│   │   ├── database.ts                # Dexie setup
│   │   └── utils.ts
│   └── hooks/
│       └── usePillDetection.ts        # React hook
├── next.config.js                     # PWA + export config
├── tsconfig.json
├── package.json
├── PROJECT_RULES.md
├── README.md
└── ARCHITECTURE.md
```

---

## Key Differences from Generic OpenCV
| Aspect | OpenCV.js | YOLOv8-ONNX |
|--------|-----------|------------|
| **Accuracy** | ~60% (contours) | 90%+ (pills) |
| **Speed** | Variable | 29ms guaranteed |
| **Training** | Not trained | Pill dataset |
| **Bundle** | 8MB | 5-8MB |
| **Setup** | Contour detection | Direct inference |
| **Scaling** | Manual parameter tuning | Pre-optimized |

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Model inference too slow | Use YOLO-nano, test on device early |
| Accuracy insufficient | Use Roboflow dataset, fine-tune if needed |
| Bundle too large | Lazy load model, use compression |
| iOS permission issues | Request camera permission early, provide fallback |
| IndexedDB quota exceeded | Implement storage cleanup, compress images |
