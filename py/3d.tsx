'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { MeiliSearch } from 'meilisearch';

interface Node {
  id: string;
  term: string;
  description: string;
  x: number;
  y: number;
  z: number;
  mesh?: THREE.Mesh;
  sprite?: THREE.Sprite;
}

interface SearchResult extends Node {
  _formatted?: {
    term: string;
    description: string;
  };
}

export default function Graph3DView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const nodeMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [meiliClient, setMeiliClient] = useState<MeiliSearch | null>(null);
  const highlightedNodesRef = useRef<Set<string>>(new Set());
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Materials for different states
  const materialsRef = useRef({
    normal: new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.8 }),
    highlighted: new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 1 }),
    selected: new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 1 }),
    hover: new THREE.MeshBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.9 })
  });

  // Initialize Meilisearch
  useEffect(() => {
    const client = new MeiliSearch({
      host: 'http://localhost:7700',
      apiKey: '',
    });
    setMeiliClient(client);
  }, []);

  // Search functionality
  const performSearch = useCallback(async (term: string) => {
    if (!meiliClient || !term.trim()) {
      setSearchResults([]);
      highlightedNodesRef.current.clear();
      updateNodeMaterials();
      return;
    }

    try {
      const index = meiliClient.index('embeddings_3d');
      const results = await index.search<SearchResult>(term, {
        limit: 5,
        attributesToHighlight: ['term', 'description'],
      });

      setSearchResults(results.hits);
      
      highlightedNodesRef.current.clear();
      results.hits.forEach(hit => highlightedNodesRef.current.add(hit.id));
      updateNodeMaterials();
    } catch (error) {
      console.error('Search error:', error);
    }
  }, [meiliClient]);

  useEffect(() => {
    const timer = setTimeout(() => performSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, performSearch]);

  const updateNodeMaterials = () => {
    nodeMeshesRef.current.forEach((mesh, id) => {
      const isHighlighted = highlightedNodesRef.current.has(id);
      const isSelected = selectedNode?.id === id;
      
      if (isSelected) {
        mesh.material = materialsRef.current.selected;
        mesh.scale.setScalar(2.5);
      } else if (isHighlighted) {
        mesh.material = materialsRef.current.highlighted;
        mesh.scale.setScalar(2);
      } else {
        mesh.material = materialsRef.current.normal;
        mesh.scale.setScalar(1);
      }
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      1,
      10000
    );
    camera.position.z = 2000;
    cameraRef.current = camera;

    // Renderer setup with optimizations
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, // Disable for better CPU performance
      powerPreference: 'high-performance'
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit pixel ratio for performance
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add sphere wireframe for reference
    const sphereGeometry = new THREE.SphereGeometry(1000, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x1e293b, 
      wireframe: true,
      transparent: true,
      opacity: 0.1
    });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphereMesh);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Mouse controls for rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const rotationSpeed = 0.005;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      // Update mouse position for raycasting
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        // Rotate camera around scene
        const phi = deltaY * rotationSpeed;
        const theta = deltaX * rotationSpeed;

        const position = camera.position;
        const radius = position.length();

        // Spherical coordinates
        let currentTheta = Math.atan2(position.x, position.z);
        let currentPhi = Math.acos(position.y / radius);

        currentTheta -= theta;
        currentPhi -= phi;
        currentPhi = Math.max(0.1, Math.min(Math.PI - 0.1, currentPhi));

        position.x = radius * Math.sin(currentPhi) * Math.sin(currentTheta);
        position.y = radius * Math.cos(currentPhi);
        position.z = radius * Math.sin(currentPhi) * Math.cos(currentTheta);

        camera.lookAt(0, 0, 0);

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.5;
      const distance = camera.position.length();
      const newDistance = Math.max(500, Math.min(5000, distance + delta));
      camera.position.setLength(newDistance);
    };

    const onClick = (e: MouseEvent) => {
      if (isDragging) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(
        Array.from(nodeMeshesRef.current.values())
      );

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const node = nodesRef.current.find(n => n.mesh === clickedMesh);
        if (node) {
          setSelectedNode(node);
        }
      }
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel);
    renderer.domElement.addEventListener('click', onClick);

    // Load data
    loadData(scene);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // Subtle auto-rotation when not dragging
      if (!isDragging) {
        sphereMesh.rotation.y += 0.0005;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  const loadData = async (scene: THREE.Scene) => {
    try {
      const response = await fetch('/embeddings_3d.json');
      const data: Node[] = await response.json();

      nodesRef.current = data;

      // Use instanced geometry for better performance
      const nodeGeometry = new THREE.SphereGeometry(3, 8, 8); // Low poly sphere
      
      data.forEach((node) => {
        // Create mesh for each node
        const mesh = new THREE.Mesh(nodeGeometry, materialsRef.current.normal);
        mesh.position.set(node.x, node.y, node.z);
        scene.add(mesh);
        
        node.mesh = mesh;
        nodeMeshesRef.current.set(node.id, mesh);

        // Add text label sprite (visible on hover/selection)
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = 256;
        canvas.height = 64;
        context.fillStyle = 'rgba(255, 255, 255, 0.9)';
        context.font = 'bold 20px Arial';
        context.textAlign = 'center';
        context.fillText(node.term, 128, 40);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
          map: texture,
          transparent: true,
          opacity: 0
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(100, 25, 1);
        sprite.position.copy(mesh.position).add(new THREE.Vector3(0, 20, 0));
        scene.add(sprite);
        node.sprite = sprite;
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  const drawConnections = (scene: THREE.Scene, nodes: Node[]) => {
    const maxDistance = 200;
    const maxConnections = 3000; // Limit for performance
    let connectionCount = 0;

    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x475569,
      transparent: true,
      opacity: 0.1
    });

    for (let i = 0; i < nodes.length && connectionCount < maxConnections; i++) {
      for (let j = i + 1; j < nodes.length && connectionCount < maxConnections; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < maxDistance) {
          const points = [
            new THREE.Vector3(nodes[i].x, nodes[i].y, nodes[i].z),
            new THREE.Vector3(nodes[j].x, nodes[j].y, nodes[j].z)
          ];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(geometry, lineMaterial);
          scene.add(line);
          connectionCount++;
        }
      }
    }
  };

  const highlightText = (text: string, formatted?: string) => {
    if (!formatted) return text;
    return formatted.replace(/<em>/g, '<mark class="bg-yellow-300 text-gray-900 px-0.5">').replace(/<\/em>/g, '</mark>');
  };

  const handleResultClick = (result: SearchResult) => {
    setSelectedNode(result);
    
    // Animate camera to focus on selected node
    if (cameraRef.current && result.mesh) {
      const targetPosition = new THREE.Vector3(result.x, result.y, result.z);
      const cameraDistance = 500;
      const direction = targetPosition.clone().normalize();
      const newCameraPosition = direction.multiplyScalar(cameraDistance).add(targetPosition);
      
      // Smooth transition (you can use GSAP or similar for smoother animation)
      cameraRef.current.position.copy(newCameraPosition);
      cameraRef.current.lookAt(targetPosition);
    }
  };

  useEffect(() => {
    updateNodeMaterials();
    
    // Update sprite visibility
    nodesRef.current.forEach(node => {
      if (node.sprite) {
        const isSelected = selectedNode?.id === node.id;
        const isHighlighted = highlightedNodesRef.current.has(node.id);
        (node.sprite.material as THREE.SpriteMaterial).opacity = (isSelected || isHighlighted) ? 1 : 0;
      }
    });
  }, [selectedNode, searchResults]);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Left Panel - Search & Results (3/5) */}
      <div className="w-3/5 flex flex-col border-r border-gray-200 bg-white">
        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="relative">
            <input
              type="text"
              placeholder="Search 3D space..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3.5 pr-12 text-lg bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm"
            />
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <div
                key={result.id}
                onClick={() => handleResultClick(result)}
                className={`group cursor-pointer bg-white border-2 rounded-2xl p-6 transition-all hover:shadow-lg hover:border-indigo-400 hover:-translate-y-0.5 ${
                  selectedNode?.id === result.id ? 'border-indigo-500 shadow-lg ring-4 ring-indigo-100' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 
                    className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors"
                    dangerouslySetInnerHTML={{ 
                      __html: highlightText(result.term, result._formatted?.term) 
                    }}
                  />
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-sm font-semibold">
                    {searchResults.indexOf(result) + 1}
                  </span>
                </div>
                <div 
                  className="text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: highlightText(result.description, result._formatted?.description) 
                  }}
                />
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    ID: {result.id}
                  </div>
                  <div className="text-indigo-500 font-medium">
                    Click to view in 3D →
                  </div>
                </div>
              </div>
            ))
          ) : searchTerm ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg">No results found</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium mb-1">Explore the 3D Space</p>
              <p className="text-sm">Search or rotate to discover connections</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - 3D Graph View (2/5) */}
      <div className="w-2/5 relative bg-slate-900">
        {/* Controls */}
        <div className="absolute top-4 right-4 z-10 bg-slate-800/90 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-xs shadow-lg border border-slate-700">
          <div className="font-semibold mb-2 text-indigo-300">3D Controls</div>
          <div className="space-y-1 text-slate-300">
            <div>• Drag: Rotate sphere</div>
            <div>• Scroll: Zoom in/out</div>
            <div>• Click node: View details</div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute top-4 left-4 z-10 bg-slate-800/90 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-xs shadow-lg border border-slate-700">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="text-slate-300">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-slate-300">Search Result</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-slate-300">Selected</span>
            </div>
          </div>
        </div>

        {/* Status */}
        {!isLoading && (
          <div className="absolute bottom-4 right-4 z-10 bg-slate-800/90 backdrop-blur-sm text-slate-300 px-3 py-2 rounded-lg text-xs border border-slate-700">
            {nodesRef.current.length.toLocaleString()} nodes in 3D space
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-white text-lg">Rendering 3D space...</div>
            </div>
          </div>
        )}

        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
}