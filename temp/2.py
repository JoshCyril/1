import json
import base64

class LayeredCompressor:
    def __init__(self):
        self.metadata = {}
    
    def compress(self, data):
        """Compress data through multiple layers"""
        current = data
        layers = []
        
        # Layer 1: Convert string to bytes and encode
        print(f"Original: {len(current)} chars")
        
        # Layer 2: Delta encoding + position mapping (5000 -> ~2000)
        current = self._compress_layer_delta(current)
        layers.append(('delta', current))
        print(f"After delta: {len(current)} chars")
        
        # Layer 3: Run-length encoding (2000 -> ~500)
        current = self._compress_layer_rle(current)
        layers.append(('rle', current))
        print(f"After RLE: {len(current)} chars")
        
        # Layer 4: Position mapping (500 -> ~100)
        current = self._compress_layer_position(current)
        layers.append(('position', current))
        print(f"After position: {len(current)} chars")
        
        # Layer 5: Frequency + substitution (100 -> ~20)
        current = self._compress_layer_freq(current)
        layers.append(('freq', current))
        print(f"After frequency: {len(current)} chars")
        
        # Layer 6: Base62 encoding (20 -> ~10)
        current = self._compress_layer_base62(current)
        layers.append(('base62', current))
        print(f"After base62: {len(current)} chars")
        
        self.metadata = {
            'layers': [name for name, _ in layers],
            'final_size': len(current),
            'original_size': len(data)
        }
        
        return current
    
    def decompress(self, compressed):
        """Decompress data through reverse layers"""
        current = compressed
        
        # Reverse order
        layers = ['base62', 'freq', 'position', 'rle', 'delta']
        
        for layer in layers:
            if layer == 'base62':
                current = self._decompress_layer_base62(current)
            elif layer == 'freq':
                current = self._decompress_layer_freq(current)
            elif layer == 'position':
                current = self._decompress_layer_position(current)
            elif layer == 'rle':
                current = self._decompress_layer_rle(current)
            elif layer == 'delta':
                current = self._decompress_layer_delta(current)
            
            print(f"After decompressing {layer}: {len(current)} chars")
        
        return current
    
    # Layer 2: Delta Encoding
    def _compress_layer_delta(self, data):
        """Store differences between consecutive chars"""
        result = [str(ord(data[0]))]
        for i in range(1, len(data)):
            delta = ord(data[i]) - ord(data[i-1])
            result.append(str(delta))
        return '|'.join(result)
    
    def _decompress_layer_delta(self, data):
        """Reverse delta encoding"""
        values = [int(x) for x in data.split('|')]
        result = [chr(values[0])]
        for i in range(1, len(values)):
            result.append(chr(ord(result[-1]) + values[i]))
        return ''.join(result)
    
    # Layer 3: Run-Length Encoding
    def _compress_layer_rle(self, data):
        """Compress runs of identical values"""
        result = []
        i = 0
        while i < len(data):
            char = data[i]
            count = 1
            while i + count < len(data) and data[i + count] == char and count < 255:
                count += 1
            result.append(f"{char}:{count}")
            i += count
        return '|'.join(result)
    
    def _decompress_layer_rle(self, data):
        """Reverse run-length encoding"""
        result = []
        for pair in data.split('|'):
            char, count = pair.rsplit(':', 1)
            result.append(char * int(count))
        return ''.join(result)
    
    # Layer 4: Position Mapping
    def _compress_layer_position(self, data):
        """Map unique values to positions"""
        unique_vals = list(set(data.split('|')))
        mapping = {val: str(i) for i, val in enumerate(unique_vals)}
        compressed = '|'.join(mapping[val] for val in data.split('|'))
        return f"{json.dumps(mapping)}#{compressed}"
    
    def _decompress_layer_position(self, data):
        """Reverse position mapping"""
        mapping_json, compressed = data.split('#', 1)
        mapping = json.loads(mapping_json)
        reverse_map = {v: k for k, v in mapping.items()}
        return '|'.join(reverse_map[val] for val in compressed.split('|'))
    
    # Layer 5: Frequency Substitution
    def _compress_layer_freq(self, data):
        """Replace most common values with shorter codes"""
        parts = data.split('|')
        freq = {}
        for part in parts:
            freq[part] = freq.get(part, 0) + 1
        
        # Sort by frequency
        sorted_freq = sorted(freq.items(), key=lambda x: x[1], reverse=True)[:10]
        substitution = {val: chr(97 + i) for i, (val, _) in enumerate(sorted_freq)}
        
        reverse_sub = {v: k for k, v in substitution.items()}
        compressed = '|'.join(substitution.get(p, p) for p in parts)
        
        return f"{json.dumps(reverse_sub)}#{compressed}"
    
    def _decompress_layer_freq(self, data):
        """Reverse frequency substitution"""
        sub_json, compressed = data.split('#', 1)
        substitution = json.loads(sub_json)
        return '|'.join(substitution.get(p, p) for p in compressed.split('|'))
    
    # Layer 6: Base62 Encoding
    def _compress_layer_base62(self, data):
        """Encode to base62 for final compression"""
        return base64.b64encode(data.encode()).decode()
    
    def _decompress_layer_base62(self, data):
        """Decode from base62"""
        return base64.b64decode(data.encode()).decode()


# Test
if __name__ == "__main__":
    # Sample 5000 char data
    sample_text = """The quick brown fox jumps over the lazy dog. """ * 120
    sample_text = sample_text[:5000]
    
    print(f"Original length: {len(sample_text)} chars\n")
    print("=" * 50)
    print("COMPRESSION LAYERS")
    print("=" * 50)
    
    compressor = LayeredCompressor()
    compressed = compressor.compress(sample_text)
    
    print("\n" + "=" * 50)
    print("DECOMPRESSION LAYERS")
    print("=" * 50 + "\n")
    
    decompressed = compressor.decompress(compressed)
    
    print("\n" + "=" * 50)
    print("RESULTS")
    print("=" * 50)
    print(f"Original: {len(sample_text)} chars")
    print(f"Compressed: {len(compressed)} chars")
    print(f"Compression ratio: {len(sample_text) / len(compressed):.1f}x")
    print(f"Match: {sample_text == decompressed}")