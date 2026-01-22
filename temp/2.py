import json
import pickle
import base64

# Global storage for compressed data
storage = {}

def compress_to_hex(data):
    """Convert text to hex string"""
    return data.encode().hex()

def compress_sequences(hex_str, min_size=5):
    """Find and replace recurring sequences with codes"""
    sequences = {}
    code_idx = 0
    result = hex_str
    
    # Find sequences of length 4-16
    for seq_len in range(16, min_size - 1, -1):
        for i in range(len(result) - seq_len):
            seq = result[i:i + seq_len]
            if seq.count(seq) > 1 and seq not in sequences:  # Must repeat
                code = f"#{code_idx:X}"
                sequences[code] = seq
                result = result.replace(seq, code)
                code_idx += 1
                if len(result) < 20:
                    return result, sequences
    
    return result, sequences

def compress(original_text):
    """Multi-level compression"""
    print("\n" + "="*50)
    print("COMPRESSION PROCESS")
    print("="*50)
    
    size = len(original_text)
    print(f"Original text: {size:,} chars")
    
    # Level 1: Convert to hex
    hex_data = compress_to_hex(original_text)
    print(f"Level 1 (Hex): {len(hex_data):,} chars")
    
    # Level 2-N: Compress sequences until < 20 chars
    current = hex_data
    sequences = {}
    level = 2
    
    while len(current) > 20:
        current, new_seqs = compress_sequences(current, min_size=3)
        sequences.update(new_seqs)
        print(f"Level {level} (Seq):   {len(current):,} chars")
        level += 1
    
    # Final package
    package = {
        "data": current,
        "seqs": sequences,
        "orig_size": size
    }
    
    compressed_str = json.dumps(package)
    
    print(f"\n{'='*50}")
    print(f"Original:   {size:,} chars")
    print(f"Compressed: {len(current)} chars")
    ratio = (size - len(current)) / size * 100
    print(f"Ratio:      {ratio:.1f}% compressed")
    print(f"\nFinal compressed: {current}")
    print(f"{'='*50}\n")
    
    # Store for decompression
    storage['current'] = package
    
    return current

def decompress_from_code(compressed_str):
    """Decompress from 10-20 char code"""
    if 'current' not in storage:
        print("Error: No compressed data in storage!")
        return None
    
    package = storage['current']
    current = compressed_str if compressed_str == package['data'] else package['data']
    sequences = package['seqs']
    orig_size = package['orig_size']
    
    print("\n" + "="*50)
    print("DECOMPRESSION PROCESS")
    print("="*50)
    print(f"Compressed: {current}")
    
    # Reverse sequence replacements
    level = 2
    while sequences:
        for code in list(sequences.keys()):
            seq = sequences.pop(code)
            current = current.replace(code, seq)
            print(f"Level {level} (Seq):   {len(current):,} chars")
            level += 1
    
    print(f"Level 1 (Hex): {len(current):,} chars")
    
    # Convert hex back to text
    try:
        result = bytes.fromhex(current).decode()
        print(f"\n{'='*50}")
        print(f"Original size: {orig_size:,} chars")
        print(f"Decompressed: {len(result):,} chars")
        print(f"Match: {len(result) == orig_size}")
        print(f"{'='*50}\n")
        return result
    except:
        print("Error decoding hex!")
        return None

def main():
    while True:
        print("\n" + "="*50)
        print("DATA COMPRESSION TOOL")
        print("="*50)
        print("1. Compress file")
        print("2. Decompress")
        print("3. Exit")
        
        choice = input("\nSelect option (1-3): ").strip()
        
        if choice == "1":
            filename = input("Enter text file path: ").strip()
            try:
                with open(filename, 'r', encoding='utf-8') as f:
                    data = f.read()
                compress(data)
            except FileNotFoundError:
                print(f"Error: File '{filename}' not found!")
        
        elif choice == "2":
            code = input("Enter compressed code (10-20 chars): ").strip()
            result = decompress_from_code(code)
            if result:
                save = input("Save to file? (y/n): ").strip().lower()
                if save == 'y':
                    output_file = input("Enter output filename: ").strip()
                    with open(output_file, 'w', encoding='utf-8') as f:
                        f.write(result)
                    print(f"Saved to {output_file}")
        
        elif choice == "3":
            print("Goodbye!")
            break
        
        else:
            print("Invalid option!")

if __name__ == "__main__":
    main()