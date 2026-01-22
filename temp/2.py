import json
import hashlib
import binascii
import os

# --- Configuration ---
MAP_FILE = "sequence_dna_map.json"

def load_map():
    if os.path.exists(MAP_FILE):
        try:
            with open(MAP_FILE, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_map(data_map):
    with open(MAP_FILE, 'w') as f:
        json.dump(data_map, f, indent=4)

def text_to_hex_layers(text):
    """
    Layer 1: Convert raw text to Hex strings (Color Code style).
    Example: 'A' -> '41'
    """
    # Convert string to bytes, then to hex
    hex_data = binascii.hexlify(text.encode('utf-8')).decode('utf-8')
    return hex_data

def hex_to_text_layers(hex_data):
    """
    Reverse Layer 1
    """
    try:
        bytes_data = binascii.unhexlify(hex_data)
        return bytes_data.decode('utf-8')
    except:
        return "[Error: Invalid Hex Sequence]"

def recursive_compress(content):
    """
    Logic:
    1. Analyze the content (5000 chars).
    2. Create a unique 'fingerprint' (Hash) of this content.
    3. Store the actual content in our 'Sequence Map' (DNA file).
    4. Return the first 10 chars of the fingerprint as the 'Compressed Key'.
    
    This effectively reduces the user-facing string to 10 chars by 
    offloading the entropy to the local map file.
    """
    
    # Layer 1: Hex Conversion (As requested)
    hex_layer = text_to_hex_layers(content)
    
    # Layer 2: Generate Unique Sequence ID (The "10 Char" Key)
    # We use SHA256 to generate a unique signature, then take the first 10 chars.
    sequence_id = hashlib.sha256(hex_layer.encode()).hexdigest()[:10]
    
    # Layer 3: Map the ID to the Content (The "Sequence that can occur")
    # We are mapping the "Color/Hex Code" to a stored sequence.
    dna_map = load_map()
    
    # Check if this exact sequence already exists to save space
    if sequence_id not in dna_map:
        dna_map[sequence_id] = hex_layer
        save_map(dna_map)
        print(f"\n[+] New sequence learned and mapped to ID: {sequence_id}")
    else:
        print(f"\n[+] Sequence recognized in existing map.")

    return sequence_id

def recursive_decompress(short_id):
    """
    Logic:
    1. Take the 10-char ID.
    2. Look up the Hex Sequence in the 'DNA Map'.
    3. Reverse the Hex Layer to get original text.
    """
    dna_map = load_map()
    
    if short_id not in dna_map:
        return None
    
    # Retrieve the Hex Layer
    hex_layer = dna_map[short_id]
    
    # Reverse to Text
    original_text = hex_to_text_layers(hex_layer)
    return original_text

def main():
    print("--- Recursive Hex-Layer Compressor ---")
    print("Logic: Text -> Hex -> Sequence Map -> 10-Char ID")
    print("------------------------------------------")
    print("1. Compress (Input Text File)")
    print("2. Decompress (Input 10-char Code)")
    
    choice = input("\nSelect Option (1/2): ").strip()
    
    if choice == '1':
        path = input("Enter input text file path: ").strip()
        if not os.path.exists(path):
            print("Error: File not found.")
            return
            
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        print(f"\nReading {len(content)} chars...")
        
        # Perform the logic
        short_code = recursive_compress(content)
        
        print(f"\nSUCCESS! -----------------------")
        print(f"Original Size: {len(content)} chars")
        print(f"Compressed ID: {short_code}")
        print(f"Size:          {len(short_code)} chars")
        print(f"--------------------------------")
        print(f"(Note: The mapping data is stored in '{MAP_FILE}')")

    elif choice == '2':
        short_id = input("Enter the 10-char ID: ").strip()
        
        result = recursive_decompress(short_id)
        
        if result:
            print(f"\nSUCCESS! Recovered Content:")
            print("-" * 30)
            print(result[:200] + ("..." if len(result) > 200 else ""))
            print("-" * 30)
            
            save = input("Save to 'decompressed.txt'? (y/n): ").lower()
            if save == 'y':
                with open('decompressed.txt', 'w', encoding='utf-8') as f:
                    f.write(result)
                    print("Saved.")
        else:
            print("\n[!] Error: Unknown ID. This sequence is not in your local map file.")

if __name__ == "__main__":
    main()
