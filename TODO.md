# Pill Counter PWA - Todo List

## 🎯 Phase 0: Project Setup (Day 1)

- [ ] **0.1.1** Create Next.js project with TypeScript & Tailwind
- [ ] **0.1.2** Install ONNX Runtime, Dexie, @serwist/next packages
- [ ] **0.2.1** Create public/manifest.json with app metadata
- [ ] **0.2.2** Generate app icons (192x192, 512x512 PNG)
- [ ] **0.2.3** Configure @serwist/next in next.config.js
- [ ] **0.3.1** Create PROJECT_RULES.md
- [ ] **0.3.2** Create README.md with setup instructions
- [ ] **0.3.3** Create ARCHITECTURE.md with tech decisions

**Completion Criteria**: `npm run dev` works, Lighthouse PWA audit passes

---

## 📱 Phase 1: Camera Capture (Days 2-3)

### Camera Component
- [ ] **1.1.1** Create components/CameraCapture.tsx
- [ ] **1.1.2** Implement getUserMedia API with rear camera default
- [ ] **1.1.3** Add capture button (save to canvas)
- [ ] **1.1.4** Implement camera permission handling
- [ ] **1.1.5** Add error messaging for permission denied

### Gallery Import
- [ ] **1.2.1** Create file upload input component
- [ ] **1.2.2** Implement HEIC to JPEG conversion (iOS)
- [ ] **1.2.3** Add drag-and-drop support
- [ ] **1.2.4** Add preview before submission

### Image Processing
- [ ] **1.3.1** Create lib/imageUtils.ts
- [ ] **1.3.2** Implement canvas resizing to 416x416
- [ ] **1.3.3** Add EXIF rotation correction
- [ ] **1.3.4** Add format validation (JPEG/PNG/WebP)

**Completion Criteria**: Camera preview works on mobile, clear captured images

---

## 🤖 Phase 2: AI Model Integration (Days 4-7)

### Model Preparation
- [ ] **2.1.1** Research Roboflow pill datasets
- [ ] **2.1.2** Download YOLOv8 pre-trained model
- [ ] **2.1.3** Convert model to ONNX format (yolo export format=onnx)
- [ ] **2.1.4** Verify model file size (target: < 10MB)
- [ ] **2.1.5** Place model in public/models/yolov8-pills.onnx

### ONNX Runtime Integration
- [ ] **2.2.1** Create lib/inferenceEngine.ts
- [ ] **2.2.2** Implement PillDetector class
- [ ] **2.2.3** Add image preprocessing (normalize, resize)
- [ ] **2.2.4** Implement model inference (.run())
- [ ] **2.2.5** Add post-processing (confidence filtering, counting)

### React Integration
- [ ] **2.3.1** Create hooks/usePillDetection.ts
- [ ] **2.3.2** Implement model lazy loading (memoized)
- [ ] **2.3.3** Add inference loading states
- [ ] **2.3.4** Handle WASM loading errors

### Performance Tuning
- [ ] **2.4.1** Test inference time on target device
- [ ] **2.4.2** Profile memory usage
- [ ] **2.4.3** Optimize for < 5 second inference
- [ ] **2.4.4** Consider Web Worker for non-blocking inference

**Completion Criteria**: Inference works, < 5s per image on mobile

---

## 🎨 Phase 3: Results UI (Days 8-10)

### Results Display
- [ ] **3.1.1** Create components/PillResults.tsx
- [ ] **3.1.2** Display detected pill count (large, prominent)
- [ ] **3.1.3** Show confidence score
- [ ] **3.1.4** Draw bounding boxes on image overlay

### Manual Correction
- [ ] **3.2.1** Add increment/decrement count buttons
- [ ] **3.2.2** Implement tap-to-select pills
- [ ] **3.2.3** Add remove false positive feature
- [ ] **3.2.4** Add manually detected pills feature

### Save & History
- [ ] **3.3.1** Add "Save Result" button
- [ ] **3.3.2** Show timestamp with result
- [ ] **3.3.3** Create result thumbnail
- [ ] **3.3.4** Add quick re-count option

### Responsive Design
- [ ] **3.4.1** Implement mobile-first layout
- [ ] **3.4.2** Test on tablet screen sizes
- [ ] **3.4.3** Add dark mode support
- [ ] **3.4.4** Implement WCAG 2.1 AA accessibility

**Completion Criteria**: Results UI responsive on mobile/tablet, intuitive UX

---

## 💾 Phase 4: Data Persistence (Days 11-12)

### Database Setup
- [ ] **4.1.1** Create lib/database.ts with Dexie schema
- [ ] **4.1.2** Define PillCount interface
- [ ] **4.1.3** Create PillCounterDB class
- [ ] **4.1.4** Test database initialization

### CRUD Operations
- [ ] **4.2.1** Implement create (save detection result)
- [ ] **4.2.2** Implement read (fetch history)
- [ ] **4.2.3** Implement update (modify count/notes)
- [ ] **4.2.4** Implement delete (remove entry)

### UI for History
- [ ] **4.3.1** Create components/History.tsx
- [ ] **4.3.2** Display results list with timestamps
- [ ] **4.3.3** Add search/filter functionality
- [ ] **4.3.4** Implement virtualized scrolling (100+ items)

### Export & Backup
- [ ] **4.4.1** Implement JSON export
- [ ] **4.4.2** Implement CSV export
- [ ] **4.4.3** Add download button
- [ ] **4.4.4** Test on mobile browsers

**Completion Criteria**: Can save 100+ results, export works, no quota errors

---

## ✅ Phase 5: Testing & Optimization (Days 13-14)

### Test Dataset
- [ ] **5.1.1** Gather 50+ pharmacy pill photos
- [ ] **5.1.2** Include edge cases (overlapping, blurred, mixed sizes)
- [ ] **5.1.3** Annotate ground truth pill counts
- [ ] **5.1.4** Organize test dataset in folder

### Accuracy Testing
- [ ] **5.2.1** Run model on all test images
- [ ] **5.2.2** Calculate precision, recall, F1-score
- [ ] **5.2.3** Document accuracy metrics
- [ ] **5.2.4** Identify and fix failure cases
- [ ] **5.2.5** Verify > 90% accuracy achieved

### Performance Profiling
- [ ] **5.3.1** Measure inference time per device type
- [ ] **5.3.2** Monitor peak memory usage
- [ ] **5.3.3** Profile bundle size
- [ ] **5.3.4** Optimize if exceeds 15MB budget

### Cross-Device Testing
- [ ] **5.4.1** Test on iPhone 12/13/14+
- [ ] **5.4.2** Test on Android flagship (2020+)
- [ ] **5.4.3** Verify camera permissions flow
- [ ] **5.4.4** Test offline functionality (disconnect internet)
- [ ] **5.4.5** Test PWA installation on each device

### Bug Fixes & Polish
- [ ] **5.5.1** Fix identified UI glitches
- [ ] **5.5.2** Handle edge cases gracefully
- [ ] **5.5.3** Complete code documentation
- [ ] **5.5.4** Add error boundaries

**Completion Criteria**: 90%+ accuracy, all tests pass, production ready

---

## 🚀 Phase 6: Deployment (Day 15)

### Build Configuration
- [ ] **6.1.1** Update next.config.js for static export
- [ ] **6.1.2** Test `npm run build` locally
- [ ] **6.1.3** Verify out/ directory generated correctly

### GitHub Pages Setup
- [ ] **6.2.1** Configure GitHub repo for GitHub Pages
- [ ] **6.2.2** Deploy out/ to gh-pages branch
- [ ] **6.2.3** Verify site live at GitHub URL
- [ ] **6.2.4** Test functionality on live site

### PWA Installation Testing
- [ ] **6.3.1** Test PWA install on iOS Safari
- [ ] **6.3.2** Test PWA install on Android Chrome
- [ ] **6.3.3** Verify offline mode works
- [ ] **6.3.4** Test app icon and splash screen

### Launch & Documentation
- [ ] **6.4.1** Create comprehensive README.md
- [ ] **6.4.2** Write quick start guide
- [ ] **6.4.3** Document API/usage
- [ ] **6.4.4** Tag v1.0.0 release on GitHub
- [ ] **6.4.5** Share on social/forums

**Completion Criteria**: Live app, installable on iOS/Android, fully functional offline

---

## 📋 Ongoing / Cross-Phase

- [ ] **Daily** Commit changes to git with descriptive messages
- [ ] **Daily** Test on actual mobile device (not just browser dev tools)
- [ ] **Weekly** Review PROJECT_RULES.md compliance
- [ ] **Weekly** Update documentation with learnings
- [ ] **Post-launch** Collect user feedback and plan enhancements

---

## Legend
- ✅ = Completed
- 🚧 = In Progress
- ⏱️ = Blocked/On Hold
- ❌ = Won't Do / Deferred

---

## Quick Stats
- **Total Tasks**: 90+ individual items
- **Estimated Duration**: 15 days (full-time)
- **Success Criteria**: 
  - ✅ 90%+ pill detection accuracy
  - ✅ < 5s inference time
  - ✅ < 15MB bundle size
  - ✅ Works 100% offline
  - ✅ Installable on iOS & Android
