import json
import numpy as np
import umap

# Load your embeddings JSON file
with open('embeddings.json', 'r') as f:
    data = json.load(f)

print(f"Loaded {len(data)} items")

# Extract vectors (assuming each item has 'id', 'term', 'description', 'vector')
vectors = np.array([item['vector'] for item in data])
print(f"Vector shape: {vectors.shape}")

# Apply UMAP dimensionality reduction
print("Running UMAP dimensionality reduction...")
reducer = umap.UMAP(
    n_components=2,
    n_neighbors=15,      # Controls local vs global structure (5-50)
    min_dist=0.1,        # Minimum distance between points (0.0-0.99)
    metric='cosine',     # Good for embeddings
    random_state=42
)

embedding_2d = reducer.fit_transform(vectors)

# Normalize coordinates to a reasonable range for visualization
# Scale to roughly -1000 to 1000 range
x_coords = embedding_2d[:, 0]
y_coords = embedding_2d[:, 1]

x_min, x_max = x_coords.min(), x_coords.max()
y_min, y_max = y_coords.min(), y_coords.max()

scale_factor = 2000  # Adjust this for your desired spread

x_normalized = ((x_coords - x_min) / (x_max - x_min) - 0.5) * scale_factor
y_normalized = ((y_coords - y_min) / (y_max - y_min) - 0.5) * scale_factor

# Add coordinates to data
output_data = []
for i, item in enumerate(data):
    output_data.append({
        'id': item['id'],
        'term': item['term'],
        'description': item['description'],
        'x': float(x_normalized[i]),
        'y': float(y_normalized[i])
    })

# Save processed data
with open('embeddings_2d.json', 'w') as f:
    json.dump(output_data, f, indent=2)

print(f"Saved {len(output_data)} items with 2D coordinates to embeddings_2d.json")
print(f"X range: [{x_normalized.min():.2f}, {x_normalized.max():.2f}]")
print(f"Y range: [{y_normalized.min():.2f}, {y_normalized.max():.2f}]")