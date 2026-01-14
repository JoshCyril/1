import json
from meilisearch import Client
import time

def index_embeddings():
    """Index embeddings data into Meilisearch"""
    
    # Connect to Meilisearch (Docker container)
    print("Connecting to Meilisearch...")
    client = Client('http://localhost:7700')
    
    # Check if Meilisearch is healthy
    try:
        health = client.health()
        print(f"✓ Meilisearch is healthy: {health}")
    except Exception as e:
        print(f"✗ Cannot connect to Meilisearch: {e}")
        print("Make sure Docker container is running:")
        print("  docker run -d -p 7700:7700 getmeili/meilisearch:latest")
        return

    # Load processed data
    print("\nLoading embeddings_2d.json...")
    try:
        with open('embeddings_2d.json', 'r') as f:
            data = json.load(f)
        print(f"✓ Loaded {len(data)} documents")
    except FileNotFoundError:
        print("✗ embeddings_2d.json not found")
        print("Run umap_preprocess.py first to generate the file")
        return

    # Create/get index
    print("\nCreating index 'embeddings'...")
    index = client.index('embeddings')

    # Configure index settings for optimal search
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
            'y'
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
        'stopWords': [],
        'synonyms': {},
        'distinctAttribute': None,
        'typoTolerance': {
            'enabled': True,
            'minWordSizeForTypos': {
                'oneTypo': 5,
                'twoTypos': 9
            }
        },
        'faceting': {
            'maxValuesPerFacet': 100
        },
        'pagination': {
            'maxTotalHits': 1000
        }
    })

    print("✓ Index settings configured")

    # Add documents in batches for better performance
    print(f"\nIndexing {len(data)} documents...")
    batch_size = 1000
    
    for i in range(0, len(data), batch_size):
        batch = data[i:i + batch_size]
        task = index.add_documents(batch)
        print(f"  Batch {i//batch_size + 1}/{(len(data)-1)//batch_size + 1} queued (task ID: {task['taskUid']})")
    
    # Wait for indexing to complete
    print("\nWaiting for indexing to complete...")
    time.sleep(2)
    
    # Check indexing status
    stats = index.get_stats()
    print(f"\n✓ Indexing complete!")
    print(f"  Total documents: {stats['numberOfDocuments']}")
    print(f"  Index size: {stats['fieldDistribution']}")

    # Test search
    print("\n--- Testing Search ---")
    test_queries = ["data", "algorithm", "neural"]
    
    for query in test_queries:
        results = index.search(query, {'limit': 3})
        print(f"\nQuery: '{query}' → {results['estimatedTotalHits']} results")
        for hit in results['hits'][:2]:
            print(f"  • {hit['term']}")

    print("\n" + "="*60)
    print("✓ Setup complete!")
    print("="*60)
    print(f"Meilisearch UI: http://localhost:7700")
    print(f"API endpoint: http://localhost:7700")
    print(f"Index name: embeddings")
    print("="*60)

if __name__ == "__main__":
    index_embeddings()