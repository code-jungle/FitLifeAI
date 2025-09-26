#!/usr/bin/env python3
import base64
import struct

def create_png_icon(size, r, g, b):
    """Create a simple PNG with gradient effect"""
    
    # Simple PNG header for a single color square
    width = height = size
    
    def write_png():
        def write_chunk(chunk_type, data):
            return struct.pack(">I", len(data)) + chunk_type + data + struct.pack(">I", zlib.crc32(data, zlib.crc32(chunk_type)) & 0xffffffff)
        
        import zlib
        
        # PNG signature
        png_data = b'\x89PNG\r\n\x1a\n'
        
        # IHDR chunk
        ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)  # 8-bit RGB
        png_data += write_chunk(b'IHDR', ihdr_data)
        
        # Create a simple gradient image data
        image_data = b''
        for y in range(height):
            image_data += b'\x00'  # Filter type
            for x in range(width):
                # Create a simple gradient from orange to pink
                ratio = x / width
                pixel_r = int(r + (236 - r) * ratio)  # From orange to pink
                pixel_g = int(g + (72 - g) * ratio)
                pixel_b = int(b + (153 - b) * ratio)
                
                # Add some circle/dumbbell pattern in center
                center_x, center_y = width // 2, height // 2
                dist_from_center = ((x - center_x) ** 2 + (y - center_y) ** 2) ** 0.5
                
                if dist_from_center < width * 0.4:  # Inside circle
                    # Add white dumbbell pattern
                    if (abs(x - center_x) < width * 0.15 and abs(y - center_y) < height * 0.05) or \
                       (abs(x - center_x + width * 0.1) < width * 0.06 and abs(y - center_y) < width * 0.06) or \
                       (abs(x - center_x - width * 0.1) < width * 0.06 and abs(y - center_y) < width * 0.06):
                        pixel_r, pixel_g, pixel_b = 255, 255, 255  # White for dumbbell
                
                image_data += struct.pack("BBB", pixel_r, pixel_g, pixel_b)
        
        # Compress image data
        compressed_data = zlib.compress(image_data)
        png_data += write_chunk(b'IDAT', compressed_data)
        
        # IEND chunk
        png_data += write_chunk(b'IEND', b'')
        
        return png_data
    
    return write_png()

# Create 192x192 icon (orange #f97316 = 249, 115, 22)
icon_192 = create_png_icon(192, 249, 115, 22)
with open('icon-192x192.png', 'wb') as f:
    f.write(icon_192)

# Create 512x512 icon
icon_512 = create_png_icon(512, 249, 115, 22)
with open('icon-512x512.png', 'wb') as f:
    f.write(icon_512)

print("FitLife AI PNG icons created successfully!")
print("Files: icon-192x192.png, icon-512x512.png")