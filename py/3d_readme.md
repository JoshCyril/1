# 3D Sphere Graph Visualization with Three.js

## Why Three.js?

**Three.js is the fastest CPU-based 3D engine for web** because:
- ✅ Highly optimized WebGL renderer with CPU fallback
- ✅ Efficient geometry batching and instancing
- ✅ Minimal overhead - direct WebGL API access
- ✅ Battle-tested with millions of deployments
- ✅ Better CPU performance than Babylon.js, A-Frame, or PlayCanvas
- ✅ Smallest bundle size (~600KB minified)

## Prerequisites

### 1. Python Dependencies
```bash
pip install umap-learn numpy
```

### 2. Meilisearch (Docker)
```bash
docker run -d \
  --name meilisearch \
  -p 7700:7700 \
  -e MEILI_ENV='development' \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:latest
```

### 3. Next.js Dependencies
```bash
npm install three meilisearch
npm install --save-dev @types/three
```

## Step 1: Generate 3D Coordinates

Run the UMAP 3D preprocessing:
```bash
python umap_3d_preprocess.py
```

This creates `embeddings_3d.json` with:
- `x, y, z` - Points on sphere surface (radius 1000)
- `x_internal, y_internal, z_internal` - Points distributed within sphere

**Choose your layout:**
- **Sphere surface**: All points on outer shell (better for visualization)
- **Internal**: Points distributed throughout volume (better for clusters)

To switch, modify the preprocessing script to use `x_internal`, `y_internal`, `z_internal`.

## Step 2: Index in Meilisearch

```bash
pip install meilisearch
python index_meilisearch_3d.py
```

## Step 3: Setup Next.js

### Install Three.js types:
```bash
npm install --save-dev @types/three
```

### Project Structure:
```
my-3d-graph/
├── app/
│   ├── page.tsx
│   ├── graph-3d-view.tsx
│   └── globals.css
├── public/
│   └── embeddings_3d.json
├── package.json
└── tsconfig.json
```

### Update `app/page.tsx`:
```typescript
import Graph3DView from './graph-3d-view';

export default function Home() {
  return (
    <main className="h-screen">
      <Graph3DView />
    </main>
  );
}
```

## Step 4: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Performance Optimizations for CPU

### ✅ Implemented Optimizations

1. **Low-Poly Geometry**
   - Spheres with only 8 segments (vs default 32)
   - Reduces vertex processing by 75%

2. **Disabled Antialiasing**
   - Saves significant GPU/CPU cycles
   - Still looks good on modern displays

3. **Limited Pixel Ratio**
   - Capped at 1.5x instead of device ratio
   - Reduces pixel fill rate on retina displays

4. **Reduced Connection Count**
   - Max 3000 connections (vs unlimited)
   - Dramatically reduces draw calls

5. **Material Reuse**
   - 4 shared materials for all nodes
   - Prevents material creation overhead

6. **No Shadows**
   - Shadows are extremely CPU-intensive
   - Use basic lighting only

7. **Optimized Raycasting**
   - Only on click, not continuous hover
   - Reduces intersection tests

8. **BufferGeometry Only**
   - No Geometry objects (deprecated and slow)
   - Direct buffer manipulation

### Expected Performance

With 8K nodes on modern CPU:
- **60 FPS** - Smooth rotation and interaction
- **<50ms** - Click response time
- **<100ms** - Search highlighting
- **<200MB** - Memory usage

## Features

### 3D Visualization
- ✅ Nodes arranged on sphere surface
- ✅ Smooth rotation with mouse drag
- ✅ Zoom with scroll wheel
- ✅ Real-time highlighting of search results (green)
- ✅ Selected node highlight (amber)
- ✅ Fixed points in 3D space (no physics simulation)
- ✅ Wireframe sphere guide
- ✅ Connections between nearby nodes

### Search Integration
- ✅ Real-time Meilisearch integration
- ✅ Top 5 results with highlighting
- ✅ Click result → camera focuses on node
- ✅ Click node → appears in search panel
- ✅ Text labels appear on selection

### Layout
- ✅ 3/5 search panel (left)
- ✅ 2/5 3D view (right)
- ✅ Modern card design
- ✅ Smooth transitions

## Configuration

### Camera Settings (in `graph-3d-view.tsx`):
```typescript
const camera = new THREE.PerspectiveCamera(
  60,        // Field of view (wider = more visible)
  aspect,    // Aspect ratio
  1,         // Near clipping plane
  10000      // Far clipping plane
);
camera.position.z = 2000; // Initial distance
```

### Sphere Settings:
```typescript
const sphereRadius = 1000;  // Adjust in preprocessing script
const maxDistance = 200;    // Max distance for connections
const maxConnections = 3000; // Limit total connections
```

### Node Appearance:
```typescript
const nodeGeometry = new THREE.SphereGeometry(
  3,  // Radius (size of nodes)
  8,  // Width segments (lower = faster)
  8   // Height segments (lower = faster)
);
```

### Rotation Speed:
```typescript
const rotationSpeed = 0.005; // Mouse drag sensitivity
sphereMesh.rotation.y += 0.0005; // Auto-rotation speed
```

## Advanced CPU Optimizations

### For 10K+ Nodes:

**1. Use Instanced Mesh:**
```typescript
const instancedMesh = new THREE.InstancedMesh(
  geometry,
  material,
  nodeCount
);
```

**2. Frustum Culling:**
```typescript
// Only render nodes in view
mesh.frustumCulled = true;
```

**3. Level of Detail:**
```typescript
const lod = new THREE.LOD();
lod.addLevel(detailedMesh, 0);
lod.addLevel(simpleMesh, 500);
lod.addLevel(pointMesh, 1000);
```

**4. Web Workers:**
```typescript
// Offload raycasting to worker
const worker = new Worker('raycast-worker.js');
```

## Switching to Internal Distribution

To use points distributed within the sphere (not just on surface):

In `graph-3d-view.tsx`, change:
```typescript
mesh.position.set(node.x, node.y, node.z);
```

To:
```typescript
mesh.position.set(node.x_internal, node.y_internal, node.z_internal);
```

## Troubleshooting

### Graph appears empty
- Check console for loading errors
- Verify `embeddings_3d.json` is in `/public` folder
- Check coordinate ranges in preprocessing output

### Poor performance
1. Reduce `maxConnections` to 1000
2. Increase node geometry segments to 6
3. Disable antialiasing: `antialias: false`
4. Lower pixel ratio: `setPixelRatio(1)`

### Nodes too small/large
- Adjust `SphereGeometry(3, 8, 8)` first parameter
- Or adjust `sphereRadius` in preprocessing

### Search not working
- Check Meilisearch is running: `docker ps`
- Verify index exists: Visit `http://localhost:7700`
- Check browser console for errors

### Camera controls not smooth
- Increase `rotationSpeed` for faster rotation
- Reduce it for more precise control

## Why Not GPU-Based Engines?

**GPU-based options like Unity WebGL or Unreal Engine:**
- ❌ 10-50MB+ bundle sizes
- ❌ Longer initial load times
- ❌ Overkill for point cloud visualization
- ❌ Harder to integrate with React/Next.js
- ❌ More complex build pipeline

**Three.js wins for web-based data visualization:**
- ✅ Native web integration
- ✅ Small bundle size
- ✅ React-friendly
- ✅ Better for data visualization
- ✅ Easier to maintain

## Production Checklist

- [ ] Enable production mode for Three.js
- [ ] Implement WebGL feature detection
- [ ] Add fallback for non-WebGL browsers
- [ ] Optimize texture sizes
- [ ] Enable compression for JSON data
- [ ] Add loading progress indicators
- [ ] Implement error boundaries
- [ ] Monitor FPS and memory usage
- [ ] Test on low-end devices
- [ ] Add accessibility controls

## Next Steps

- Implement camera animation on search result selection
- Add clustering visualization with colors
- Create VR mode with WebXR
- Add export to 3D formats (OBJ, GLTF)
- Implement time-series animation
- Add particle effects for highlighted nodes
- Create mini-map with orthographic view