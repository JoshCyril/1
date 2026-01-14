import json
from meilisearch import Client
import time

def index_embeddings_3d():
    """Index 3D embeddings data into Meilisearch"""
    
    print("Connecting to Meilisearch...")
    client = Client('http://localhost:7700')
    
    try:
        health = client.health()
        print(f"✓ Meilisearch is healthy: {health}")
    except Exception as e:
        print(f"✗ Cannot connect to Meilisearch: {e}")
        print("Make sure Docker container is running:")
        print("  docker run -d -p 7700:7700 getmeili/meilisearch:latest")
        return

    print("\nLoading embeddings_3d.json...")
    try:
        with open('embeddings_3d.json', 'r') as f:
            data = json.load(f)
        print(f"✓ Loaded {len(data)} documents with 3D coordinates")
    except FileNotFoundError:
        print("✗ embeddings_3d.json not found")
        print("Run umap_3d_preprocess.py first to generate the file")
        return

    print("\nCreating index 'embeddings_3d'...")
    index = client.index('embeddings_3d')

    print("Configuring index settings...")
    index.update_settings({
        'searchableAttributes': [
            'term',
            'description'
        ],
        'displayedAttributes': [
            'id',
            'term', 
            'description',
            'x',
            'y',
            'z',
            'x_internal',
            'y_internal',
            'z_internal'
        ],
        'filterableAttributes': [
            'id'
        ],
        'sortableAttributes': [],
        'rankingRules': [
            'words',
            'typo',
            'proximity',
            'attribute',
            'sort',
            'exactness'
        ],
        'typoTolerance': {
            'enabled': True,
            'minWordSizeForTypos': {
                'oneTypo': 5,
                'twoTypos': 9
            }
        },
    })

    print("✓ Index settings configured")

    print(f"\nIndexing {len(data)} documents...")
    batch_size = 1000
    
    for i in range(0, len(data), batch_size):
        batch = data[i:i + batch_size]
        task = index.add_documents(batch)
        print(f"  Batch {i//batch_size + 1}/{(len(data)-1)//batch_size + 1} queued (task ID: {task['taskUid']})")
    
    print("\nWaiting for indexing to complete...")
    time.sleep(2)
    
    stats = index.get_stats()
    print(f"\n✓ Indexing complete!")
    print(f"  Total documents: {stats['numberOfDocuments']}")

    print("\n--- Testing 3D Search ---")
    test_queries = ["data", "algorithm", "neural"]
    
    for query in test_queries:
        results = index.search(query, {'limit': 3})
        print(f"\nQuery: '{query}' → {results['estimatedTotalHits']} results")
        for hit in results['hits'][:2]:
            print(f"  • {hit['term']} (x:{hit['x']:.1f}, y:{hit['y']:.1f}, z:{hit['z']:.1f})")

    print("\n" + "="*60)
    print("✓ 3D Setup complete!")
    print("="*60)
    print(f"Meilisearch UI: http://localhost:7700")
    print(f"Index name: embeddings_3d")
    print(f"Total nodes: {stats['numberOfDocuments']}")
    print("="*60)

if __name__ == "__main__":
    index_embeddings_3d()