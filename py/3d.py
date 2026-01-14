import json
import numpy as np
import umap

# Load your embeddings JSON file
with open('embeddings.json', 'r') as f:
    data = json.load(f)

print(f"Loaded {len(data)} items")

# Extract vectors
vectors = np.array([item['vector'] for item in data])
print(f"Vector shape: {vectors.shape}")

# Apply UMAP dimensionality reduction to 3D
print("Running UMAP 3D dimensionality reduction...")
reducer = umap.UMAP(
    n_components=3,          # 3D output
    n_neighbors=15,
    min_dist=0.1,
    metric='cosine',
    random_state=42
)

embedding_3d = reducer.fit_transform(vectors)

# Normalize to unit sphere
# Project points onto sphere surface for better 3D visualization
x_coords = embedding_3d[:, 0]
y_coords = embedding_3d[:, 1]
z_coords = embedding_3d[:, 2]

# Normalize each point to lie on sphere of radius 1000
norms = np.sqrt(x_coords**2 + y_coords**2 + z_coords**2)
sphere_radius = 1000

x_sphere = (x_coords / norms) * sphere_radius
y_sphere = (y_coords / norms) * sphere_radius
z_sphere = (z_coords / norms) * sphere_radius

# Alternative: Keep internal structure with scaling
# Use this if you want points distributed within the sphere
scale_factor = 800
x_scaled = x_coords * (scale_factor / np.max(np.abs(x_coords)))
y_scaled = y_coords * (scale_factor / np.max(np.abs(y_coords)))
z_scaled = z_coords * (scale_factor / np.max(np.abs(z_coords)))

# Add coordinates to data (using sphere projection)
output_data = []
for i, item in enumerate(data):
    output_data.append({
        'id': item['id'],
        'term': item['term'],
        'description': item['description'],
        'x': float(x_sphere[i]),
        'y': float(y_sphere[i]),
        'z': float(z_sphere[i]),
        # Also include scaled version for internal distribution
        'x_internal': float(x_scaled[i]),
        'y_internal': float(y_scaled[i]),
        'z_internal': float(z_scaled[i])
    })

# Save processed data
with open('embeddings_3d.json', 'w') as f:
    json.dump(output_data, f, indent=2)

print(f"Saved {len(output_data)} items with 3D coordinates to embeddings_3d.json")
print(f"Sphere coordinates:")
print(f"  X range: [{x_sphere.min():.2f}, {x_sphere.max():.2f}]")
print(f"  Y range: [{y_sphere.min():.2f}, {y_sphere.max():.2f}]")
print(f"  Z range: [{z_sphere.min():.2f}, {z_sphere.max():.2f}]")
print(f"\nInternal coordinates:")
print(f"  X range: [{x_scaled.min():.2f}, {x_scaled.max():.2f}]")
print(f"  Y range: [{y_scaled.min():.2f}, {y_scaled.max():.2f}]")
print(f"  Z range: [{z_scaled.min():.2f}, {z_scaled.max():.2f}]")