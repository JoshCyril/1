import json
import base64
import sys

def compress(data):
    """Compress data through multiple layers"""
    original_size = len(data)
    
    # Layer 1: Run-length encoding
    rle = []
    i = 0
    while i < len(data):
        char = data[i]
        count = 1
        while i + count < len(data) and data[i + count] == char and count < 999:
            count += 1
        rle.append(f"{ord(char)},{count}")
        i += count
    layer1 = "|".join(rle)
    print(f"Layer 1 (RLE):           {len(layer1):6} chars")
    
    # Layer 2: Remove duplicates and create index
    parts = layer1.split("|")
    unique = list(set(parts))
    index = {val: idx for idx, val in enumerate(unique)}
    layer2 = "|".join(str(index[p]) for p in parts)
    print(f"Layer 2 (Index):         {len(layer2):6} chars")
    
    # Layer 3: Compress to smaller base
    layer2_data = f"{json.dumps(unique)}:{layer2}"
    layer3 = base64.b64encode(layer2_data.encode()).decode()
    print(f"Layer 3 (Base64):        {len(layer3):6} chars")
    
    # Layer 4: Final compression with metadata
    final = {
        "c": layer3,
        "o": original_size
    }
    compressed = json.dumps(final)
    print(f"Layer 4 (JSON):          {len(compressed):6} chars")
    
    ratio = (original_size - len(compressed)) / original_size * 100
    print(f"\n{'='*50}")
    print(f"Original:     {original_size:,} chars")
    print(f"Compressed:   {len(compressed):,} chars")
    print(f"Ratio:        {ratio:.2f}% compressed")
    print(f"{'='*50}\n")
    
    return compressed

def decompress(compressed):
    """Decompress data from layers"""
    final = json.loads(compressed)
    layer3 = final["c"]
    original_size = final["o"]
    
    # Layer 3: Decode base64
    layer2_data = base64.b64decode(layer3).decode()
    unique_json, layer2 = layer2_data.split(":", 1)
    unique = json.loads(unique_json)
    
    # Layer 2: Restore from index
    indices = [int(x) for x in layer2.split("|")]
    parts = [unique[idx] for idx in indices]
    layer1 = "|".join(parts)
    
    # Layer 1: Reverse RLE
    data = []
    for part in layer1.split("|"):
        char_code, count = part.split(",")
        data.append(chr(int(char_code)) * int(count))
    
    result = "".join(data)
    
    print(f"Decompressed: {len(result):,} chars")
    print(f"Matches original: {len(result) == original_size}\n")
    
    return result

# Main
if __name__ == "__main__":
    # Read from file
    filename = input("Enter text file path: ").strip()
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            original_data = f.read()
        
        print(f"\n{'='*50}")
        print("COMPRESSION")
        print(f"{'='*50}\n")
        
        compressed = compress(original_data)
        
        print(f"{'='*50}")
        print("DECOMPRESSION")
        print(f"{'='*50}\n")
        
        decompressed = decompress(compressed)
        
        # Verify
        if original_data == decompressed:
            print("✓ SUCCESS: Data matches perfectly!")
        else:
            print("✗ ERROR: Data mismatch!")
            sys.exit(1)
    
    except FileNotFoundError:
        print(f"Error: File '{filename}' not found!")
        sys.exit(1)