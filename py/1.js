'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import { MeiliSearch } from 'meilisearch';

interface Node {
  id: string;
  term: string;
  description: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  graphics?: PIXI.Graphics;
  text?: PIXI.Text;
  gridX?: number;
  gridY?: number;
}

interface SearchResult extends Node {
  _formatted?: {
    term: string;
    description: string;
  };
}

// Spatial grid for performance optimization
class SpatialGrid {
  private cellSize: number;
  private grid: Map<string, Node[]>;

  constructor(cellSize: number = 200) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  clear() {
    this.grid.clear();
  }

  insert(node: Node) {
    const cellX = Math.floor(node.x / this.cellSize);
    const cellY = Math.floor(node.y / this.cellSize);
    const key = `${cellX},${cellY}`;
    
    node.gridX = cellX;
    node.gridY = cellY;

    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }
    this.grid.get(key)!.push(node);
  }

  getNearby(node: Node): Node[] {
    const nearby: Node[] = [];
    const cellX = node.gridX!;
    const cellY = node.gridY!;

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${cellX + dx},${cellY + dy}`;
        const cells = this.grid.get(key);
        if (cells) nearby.push(...cells);
      }
    }
    return nearby;
  }
}

export default function GraphView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pixiAppRef = useRef<PIXI.Application | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const spatialGridRef = useRef<SpatialGrid>(new SpatialGrid(200));
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [meiliClient, setMeiliClient] = useState<MeiliSearch | null>(null);
  const highlightedNodesRef = useRef<Set<string>>(new Set());
  const scaleRef = useRef(1);

  // Initialize Meilisearch client
  useEffect(() => {
    const client = new MeiliSearch({
      host: 'http://localhost:7700', // Docker container host
      apiKey: '', // Add your master key if needed
    });
    setMeiliClient(client);
  }, []);

  // Debounced search
  const performSearch = useCallback(async (term: string) => {
    if (!meiliClient || !term.trim()) {
      setSearchResults([]);
      highlightedNodesRef.current.clear();
      updateNodeHighlights();
      return;
    }

    try {
      const index = meiliClient.index('embeddings');
      const results = await index.search<SearchResult>(term, {
        limit: 5,
        attributesToHighlight: ['term', 'description'],
      });

      setSearchResults(results.hits);
      
      // Update highlighted nodes
      highlightedNodesRef.current.clear();
      results.hits.forEach(hit => highlightedNodesRef.current.add(hit.id));
      updateNodeHighlights();
    } catch (error) {
      console.error('Search error:', error);
    }
  }, [meiliClient]);

  useEffect(() => {
    const timer = setTimeout(() => performSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, performSearch]);

  const updateNodeHighlights = () => {
    nodesRef.current.forEach(node => {
      if (node.graphics) {
        const isHighlighted = highlightedNodesRef.current.has(node.id);
        const isSelected = selectedNode?.id === node.id;
        
        node.graphics.clear();
        const size = isSelected ? 10 : (isHighlighted ? 7 : 4);
        const color = isSelected ? 0xf59e0b : (isHighlighted ? 0x10b981 : 0x6366f1);
        const alpha = isHighlighted || isSelected ? 1 : 0.6;
        
        node.graphics.circle(0, 0, size);
        node.graphics.fill({ color, alpha });
      }
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const app = new PIXI.Application();
    
    app.init({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      backgroundColor: 0x0f172a,
      antialias: true,
      resolution: window.devicePixelRatio,
      autoDensity: true,
    }).then(() => {
      containerRef.current?.appendChild(app.canvas);
      pixiAppRef.current = app;

      const graphContainer = new PIXI.Container();
      app.stage.addChild(graphContainer);

      graphContainer.eventMode = 'static';
      graphContainer.hitArea = app.screen;

      let isDragging = false;
      let dragStart = { x: 0, y: 0 };
      let scale = 0.5; // Start zoomed out
      scaleRef.current = scale;
      let offset = { x: 0, y: 0 };

      // Center the graph initially
      offset.x = app.screen.width / 2;
      offset.y = app.screen.height / 2;
      graphContainer.position.set(offset.x, offset.y);
      graphContainer.scale.set(scale);

      // Zoom with threshold for blob/text rendering
      app.canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        scale *= zoomFactor;
        scale = Math.max(0.1, Math.min(3, scale));
        scaleRef.current = scale;
        graphContainer.scale.set(scale);
        updateTextVisibility(scale);
      });

      app.canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0 && !e.ctrlKey) {
          isDragging = true;
          dragStart = { x: e.clientX - offset.x, y: e.clientY - offset.y };
        }
      });

      app.canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
          offset.x = e.clientX - dragStart.x;
          offset.y = e.clientY - dragStart.y;
          graphContainer.position.set(offset.x, offset.y);
        }
      });

      app.canvas.addEventListener('mouseup', () => {
        isDragging = false;
      });

      loadData(graphContainer, app);

      // Optimized physics with reduced frequency
      let frameCount = 0;
      const animate = () => {
        frameCount++;
        if (frameCount % 2 === 0) { // Run physics every other frame
          applyPhysics();
        }
        updateNodePositions();
      };

      app.ticker.add(animate);
    });

    return () => {
      if (pixiAppRef.current) {
        pixiAppRef.current.destroy(true, { children: true });
      }
    };
  }, []);

  const loadData = async (container: PIXI.Container, app: PIXI.Application) => {
    try {
      const response = await fetch('/embeddings_2d.json');
      const data: Node[] = await response.json();

      data.forEach(node => {
        node.vx = 0;
        node.vy = 0;
      });

      nodesRef.current = data;

      // Build spatial grid
      spatialGridRef.current.clear();
      data.forEach(node => spatialGridRef.current.insert(node));

      // Create nodes with text
      data.forEach((node) => {
        const graphics = new PIXI.Graphics();
        graphics.circle(0, 0, 4);
        graphics.fill({ color: 0x6366f1, alpha: 0.6 });
        graphics.position.set(node.x, node.y);
        graphics.eventMode = 'static';
        graphics.cursor = 'pointer';

        graphics.on('pointerover', () => {
          if (!highlightedNodesRef.current.has(node.id) && selectedNode?.id !== node.id) {
            graphics.clear();
            graphics.circle(0, 0, 6);
            graphics.fill({ color: 0x818cf8, alpha: 0.9 });
          }
          if (node.text && scaleRef.current > 0.8) node.text.visible = true;
        });

        graphics.on('pointerout', () => {
          updateNodeHighlights();
          if (node.text) node.text.visible = false;
        });

        graphics.on('pointertap', () => {
          setSelectedNode(node);
        });

        container.addChild(graphics);
        node.graphics = graphics;

        // Text label
        const text = new PIXI.Text({
          text: node.term,
          style: {
            fontSize: 11,
            fill: 0xffffff,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '500',
          }
        });
        text.position.set(node.x + 8, node.y - 6);
        text.visible = false;
        text.alpha = 0.9;
        container.addChild(text);
        node.text = text;
      });

      // Optimized connections - only draw for nearby nodes
      drawOptimizedConnections(container, data);

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  const drawOptimizedConnections = (container: PIXI.Container, nodes: Node[]) => {
    const graphics = new PIXI.Graphics();
    const maxDistance = 100; // Reduced for performance
    let connectionCount = 0;
    const maxConnections = 5000; // Limit total connections

    for (let i = 0; i < nodes.length && connectionCount < maxConnections; i++) {
      const nearby = spatialGridRef.current.getNearby(nodes[i]);
      
      for (const other of nearby) {
        if (nodes[i].id >= other.id) continue;
        
        const dx = nodes[i].x - other.x;
        const dy = nodes[i].y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const alpha = (1 - distance / maxDistance) * 0.1;
          graphics.moveTo(nodes[i].x, nodes[i].y);
          graphics.lineTo(other.x, other.y);
          graphics.stroke({ width: 1, color: 0x475569, alpha });
          connectionCount++;
        }
      }
    }

    container.addChildAt(graphics, 0);
  };

  const updateTextVisibility = (scale: number) => {
    const showText = scale > 0.8;
    nodesRef.current.forEach(node => {
      if (node.text) {
        node.text.visible = false; // Only show on hover when zoomed in
      }
    });
  };

  const applyPhysics = () => {
    const nodes = nodesRef.current;
    const centerForce = 0.00005;
    const repulsion = 250;
    const damping = 0.92;

    nodes.forEach(node => {
      node.vx! -= node.x * centerForce;
      node.vy! -= node.y * centerForce;

      // Only check nearby nodes using spatial grid
      const nearby = spatialGridRef.current.getNearby(node);
      nearby.forEach(other => {
        if (node === other) return;

        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const distSq = dx * dx + dy * dy + 0.1;
        const dist = Math.sqrt(distSq);

        if (dist < 150) {
          const force = repulsion / distSq;
          node.vx! += (dx / dist) * force;
          node.vy! += (dy / dist) * force;
        }
      });

      node.vx! *= damping;
      node.vy! *= damping;
      
      const oldX = node.x;
      const oldY = node.y;
      node.x += node.vx!;
      node.y += node.vy!;

      // Update spatial grid if cell changed
      if (Math.abs(node.x - oldX) > 10 || Math.abs(node.y - oldY) > 10) {
        const newCellX = Math.floor(node.x / 200);
        const newCellY = Math.floor(node.y / 200);
        if (newCellX !== node.gridX || newCellY !== node.gridY) {
          spatialGridRef.current.clear();
          nodes.forEach(n => spatialGridRef.current.insert(n));
        }
      }
    });
  };

  const updateNodePositions = () => {
    nodesRef.current.forEach(node => {
      if (node.graphics) {
        node.graphics.position.set(node.x, node.y);
      }
      if (node.text) {
        node.text.position.set(node.x + 8, node.y - 6);
      }
    });
  };

  const highlightText = (text: string, formatted?: string) => {
    if (!formatted) return text;
    return formatted.replace(/<em>/g, '<mark class="bg-yellow-300 text-gray-900 px-0.5">').replace(/<\/em>/g, '</mark>');
  };

  const handleResultClick = (result: SearchResult) => {
    setSelectedNode(result);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Left Panel - Search & Results (3/5) */}
      <div className="w-3/5 flex flex-col border-r border-gray-200 bg-white">
        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="relative">
            <input
              type="text"
              placeholder="Search terms..."
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
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-xs text-gray-400">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  ID: {result.id}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-lg">Start typing to search</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Graph View (2/5) */}
      <div className="w-2/5 relative bg-slate-900">
        {/* Controls */}
        <div className="absolute top-4 right-4 z-10 bg-slate-800/90 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-xs shadow-lg border border-slate-700">
          <div className="font-semibold mb-2 text-indigo-300">Controls</div>
          <div className="space-y-1 text-slate-300">
            <div>• Scroll: Zoom</div>
            <div>• Drag: Pan</div>
            <div>• Click: Details</div>
          </div>
        </div>

        {/* Status */}
        {!isLoading && (
          <div className="absolute bottom-4 right-4 z-10 bg-slate-800/90 backdrop-blur-sm text-slate-300 px-3 py-2 rounded-lg text-xs border border-slate-700">
            {nodesRef.current.length.toLocaleString()} nodes
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-white text-lg">Loading graph...</div>
            </div>
          </div>
        )}

        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
}