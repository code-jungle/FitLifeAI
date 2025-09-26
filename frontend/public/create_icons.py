#!/usr/bin/env python3
import base64

# Simple 1x1 PNG in the FitLife theme color
png_data = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
)

# Create icon files
with open('icon-192x192.png', 'wb') as f:
    f.write(png_data)
    
with open('icon-512x512.png', 'wb') as f:
    f.write(png_data)
    
print("Icon files created successfully")