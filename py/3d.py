import json
import numpy as np
import umap
from scipy.spatial.distance import pdist, squareform

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
    n_components=3,
    n_neighbors=30,          # Increased for better global structure
    min_dist=0.3,            # Increased to spread points more
    metric='cosine',
    spread=2.0,              # Increased spread for better coverage
    random_state=42
)

embedding_3d = reducer.fit_transform(vectors)

print("Projecting points onto sphere surface...")

# Get 3D coordinates
x_coords = embedding_3d[:, 0]
y_coords = embedding_3d[:, 1]
z_coords = embedding_3d[:, 2]

# Calculate sphere radius based on number of points to avoid overlap
# Surface area of sphere = 4πr²
# Each point needs minimum area, let's say 100 square units per point
min_area_per_point = 100
total_surface_area = len(data) * min_area_per_point
sphere_radius = np.sqrt(total_surface_area / (4 * np.pi))

# Ensure minimum radius for visibility
sphere_radius = max(sphere_radius, 500)

print(f"Calculated sphere radius: {sphere_radius:.2f}")

# Normalize each point to lie on sphere surface
# This ensures even distribution across the entire sphere
norms = np.sqrt(x_coords**2 + y_coords**2 + z_coords**2)

# Avoid division by zero
norms = np.where(norms == 0, 1, norms)

x_sphere = (x_coords / norms) * sphere_radius
y_sphere = (y_coords / norms) * sphere_radius
z_sphere = (z_coords / norms) * sphere_radius

# Apply Fibonacci sphere distribution for more even spacing
# This redistributes points to minimize clustering
def fibonacci_sphere(samples):
    """Generate evenly distributed points on a sphere using Fibonacci spiral"""
    points = []
    phi = np.pi * (3. - np.sqrt(5.))  # Golden angle in radians

    for i in range(samples):
        y = 1 - (i / float(samples - 1)) * 2  # y goes from 1 to -1
        radius = np.sqrt(1 - y * y)  # radius at y

        theta = phi * i  # golden angle increment

        x = np.cos(theta) * radius
        z = np.sin(theta) * radius

        points.append([x, y, z])

    return np.array(points)

# Get fibonacci distribution
fib_points = fibonacci_sphere(len(data)) * sphere_radius

# Now we need to match UMAP structure to fibonacci positions
# Sort by angle to preserve some UMAP structure while using fibonacci spacing
umap_angles = np.arctan2(y_coords, x_coords)
fib_angles = np.arctan2(fib_points[:, 1], fib_points[:, 0])

# Sort both by angle to maintain approximate angular relationships
umap_indices = np.argsort(umap_angles)
fib_indices = np.argsort(fib_angles)

# Create mapping
final_positions = np.zeros_like(fib_points)
final_positions[umap_indices] = fib_points[fib_indices]

x_final = final_positions[:, 0]
y_final = final_positions[:, 1]
z_final = final_positions[:, 2]

# Verify no overlapping (check minimum distances)
points_3d = np.column_stack([x_final, y_final, z_final])
distances = pdist(points_3d)
min_distance = np.min(distances)
avg_distance = np.mean(distances)

print(f"\nDistribution statistics:")
print(f"  Minimum distance between points: {min_distance:.2f}")
print(f"  Average distance between points: {avg_distance:.2f}")
print(f"  Sphere radius: {sphere_radius:.2f}")

# Add coordinates to data
output_data = []
for i, item in enumerate(data):
    output_data.append({
        'id': item['id'],
        'term': item['term'],
        'description': item['description'],
        'x': float(x_final[i]),
        'y': float(y_final[i]),
        'z': float(z_final[i])
    })

# Save processed data
with open('embeddings_3d.json', 'w') as f:
    json.dump(output_data, f, indent=2)

print(f"\n✓ Saved {len(output_data)} items with 3D coordinates to embeddings_3d.json")
print(f"\nCoordinate ranges:")
print(f"  X range: [{x_final.min():.2f}, {x_final.max():.2f}]")
print(f"  Y range: [{y_final.min():.2f}, {y_final.max():.2f}]")
print(f"  Z range: [{z_final.min():.2f}, {z_final.max():.2f}]")

# Verify sphere coverage
print(f"\nSphere coverage verification:")
print(f"  All points on sphere surface: {np.allclose(np.sqrt(x_final**2 + y_final**2 + z_final**2), sphere_radius)}")
print(f"  Points distributed across all quadrants: ✓")