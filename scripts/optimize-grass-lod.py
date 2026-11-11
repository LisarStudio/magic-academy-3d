"""Create the authored low-poly grass GLB with compact versions of its source albedo maps."""
import json
import struct
from io import BytesIO
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ENV = ROOT / "public" / "assets" / "environment"
SOURCE = ENV / "wukong-grass-clumps.glb"
LOD = ENV / "wukong-grass-clumps-lod.glb"
OUTPUT = ENV / "wukong-grass-clumps-lod-textured.glb"


def read_glb(path: Path) -> tuple[dict, bytes]:
    data = path.read_bytes()
    magic, version, declared_length = struct.unpack_from("<III", data)
    if magic != 0x46546C67 or version != 2 or declared_length != len(data):
        raise ValueError(f"Invalid GLB: {path}")
    offset = 12
    document = None
    binary = b""
    while offset < len(data):
        size, kind = struct.unpack_from("<II", data, offset)
        offset += 8
        chunk = data[offset:offset + size]
        offset += size
        if kind == 0x4E4F534A:
            document = json.loads(chunk.decode("utf-8").rstrip("\0 "))
        elif kind == 0x004E4942:
            binary = chunk
    if document is None:
        raise ValueError(f"GLB has no JSON chunk: {path}")
    return document, binary


def write_glb(path: Path, document: dict, binary: bytes) -> None:
    document["buffers"][0]["byteLength"] = len(binary)
    json_chunk = json.dumps(document, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    json_chunk += b" " * ((-len(json_chunk)) % 4)
    binary += b"\0" * ((-len(binary)) % 4)
    total_length = 12 + 8 + len(json_chunk) + 8 + len(binary)
    path.write_bytes(
        struct.pack("<III", 0x46546C67, 2, total_length)
        + struct.pack("<II", len(json_chunk), 0x4E4F534A) + json_chunk
        + struct.pack("<II", len(binary), 0x004E4942) + binary
    )


source_doc, source_binary = read_glb(SOURCE)
lod_doc, lod_binary = read_glb(LOD)
sampler_index = len(lod_doc.setdefault("samplers", []))
lod_doc["samplers"].append({"magFilter": 9729, "minFilter": 9987, "wrapS": 10497, "wrapT": 10497})
texture_indices = []

for source_material_index in (0, 2, 3):  # short, lush, tall source clump albedo
    source_material = source_doc["materials"][source_material_index]
    source_texture_index = source_material["pbrMetallicRoughness"]["baseColorTexture"]["index"]
    source_image_index = source_doc["textures"][source_texture_index]["source"]
    source_image = source_doc["images"][source_image_index]
    view = source_doc["bufferViews"][source_image["bufferView"]]
    start = view.get("byteOffset", 0)
    image_bytes = source_binary[start:start + view["byteLength"]]
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    image.thumbnail((512, 512), Image.Resampling.LANCZOS)
    encoded = BytesIO()
    image.save(encoded, format="JPEG", quality=90, optimize=True, progressive=False, subsampling=0)
    compact_bytes = encoded.getvalue()
    lod_binary += b"\0" * ((-len(lod_binary)) % 4)
    byte_offset = len(lod_binary)
    lod_binary += compact_bytes
    view_index = len(lod_doc.setdefault("bufferViews", []))
    lod_doc["bufferViews"].append({"buffer": 0, "byteOffset": byte_offset, "byteLength": len(compact_bytes)})
    image_index = len(lod_doc.setdefault("images", []))
    lod_doc["images"].append({"bufferView": view_index, "mimeType": "image/jpeg", "name": source_image.get("name", "grass") + "_mobile_lod"})
    texture_index = len(lod_doc.setdefault("textures", []))
    lod_doc["textures"].append({"sampler": sampler_index, "source": image_index})
    material_index = len(lod_doc.setdefault("materials", []))
    lod_doc["materials"].append({
        "name": source_material.get("name", f"grass_{source_material_index}") + "_lod",
        "doubleSided": True,
        "pbrMetallicRoughness": {
            "baseColorTexture": {"index": texture_index},
            "metallicFactor": 0,
            "roughnessFactor": source_material.get("pbrMetallicRoughness", {}).get("roughnessFactor", 0.8),
        },
    })
    texture_indices.append(material_index)

node_material = {"Grass_Short_LOD": texture_indices[0], "Grass_Lush_LOD": texture_indices[1], "Grass_Tall_LOD": texture_indices[2]}
for node in lod_doc["nodes"]:
    material_index = node_material.get(node.get("name"))
    if material_index is not None:
        mesh = lod_doc["meshes"][node["mesh"]]
        for primitive in mesh["primitives"]:
            primitive["material"] = material_index

lod_doc["asset"]["generator"] = "Wukong mobile-friendly authored grass LOD; source geometry preserved"
write_glb(OUTPUT, lod_doc, lod_binary)
print(f"Created {OUTPUT.name}: {OUTPUT.stat().st_size:,} bytes (source {SOURCE.stat().st_size:,} bytes; LOD {LOD.stat().st_size:,} bytes)")
