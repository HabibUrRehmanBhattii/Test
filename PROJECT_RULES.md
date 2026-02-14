# Pill Counter PWA - Project Rules & Constraints

## Core Objectives
- **Zero-cost, offline pill counting PWA** using Next.js and AI
- **Browser-based image recognition** for pharmaceutical counting
- **Progressive Web App** installable on mobile devices
- **100% offline functionality** - no cloud dependencies

## Technical Constraints

### Performance Budget
- **Bundle Size**: < 15MB total (PWA must load on 4G)
- **Model Size**: < 10MB (ONNX YOLO8-nano)
- **Inference Speed**: < 5 seconds per image on target devices
- **First Paint**: < 2 seconds
- **First Contentful Paint**: < 3 seconds

### Browser Support
- **Modern browsers**: Chrome, Firefox, Safari, Edge
- **Mobile-first**: iOS 12+, Android 8+
- **Offline-first**: Full functionality without internet
- **Storage**: Max 50MB (IndexedDB limit on most browsers)

### Technology Stack
- **Framework**: Next.js 14+ (React)
- **PWA**: @serwist/next (service worker)
- **AI Model**: YOLOv8-nano (ONNX Runtime for browser)
- **Database**: Dexie.js (IndexedDB wrapper)
- **Image Processing**: Canvas API + ONNX Runtime
- **Deployment**: GitHub Pages (static export)

### Cost Constraints
- **Development**: $0 (all free/open-source tools)
- **Hosting**: $0 (GitHub Pages)
- **AI Model**: $0 (YOLOv8 open-source)
- **Training Data**: Free (Roboflow public datasets)

## Feature Requirements

### MVP (Minimum Viable Product)
✅ Camera capture (photo & gallery import)  
✅ Real-time pill detection via YOLOv8-ONNX  
✅ Pill count display  
✅ Manual count adjustment  
✅ Single image analysis  

### Phase 1 Features
✅ Batch image processing  
✅ Detection history  
✅ Results export (JSON/CSV)  
✅ Offline data persistence  

### Phase 2 Features (Future)
- Multi-image batch upload
- OCR for pill identification
- AI model parameter tuning UI
- Custom training interface

## Project Constraints

### Accuracy Requirements
- **Target Accuracy**: > 90% on clear pharmacy images
- **Acceptable Error Range**: ±1-2 pills for counts 10-100
- **Edge Cases**: Overlapping pills, blurred images, mixed sizes

### Device Support
- **Target Devices**: iPhone 12+, Android flagship (2020+)
- **Minimum Requirements**: 4GB RAM, modern GPU
- **Storage Available**: 50MB+ free space

### Data Privacy
- **No cloud uploads**: All processing local
- **No tracking**: No analytics or telemetry
- **Data deletion**: User-controlled history management
- **GDPR compliant**: No personal data collection

## Development Timeline
- **Phase 0**: Setup (Day 1)
- **Phase 1**: Camera Foundation (Days 2-3)
- **Phase 2**: AI Integration with YOLOv8 (Days 4-7)
- **Phase 3**: Results UI (Days 8-10)
- **Phase 4**: Data Layer (Days 11-12)
- **Phase 5**: Polish & Test (Days 13-14)
- **Phase 6**: Deploy (Day 15)

## Success Metrics
- ✅ PWA installs on iOS and Android
- ✅ Accuracy > 90% on test dataset
- ✅ Detection time < 5 seconds
- ✅ Bundle size < 15MB
- ✅ Works offline with no internet
- ✅ Handles 100+ images in history
