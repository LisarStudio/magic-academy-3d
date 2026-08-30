import json, math, os, base64, struct

output_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'assets', 'environment')
os.makedirs(output_dir, exist_ok=True)

def create_gltf(name, vertices, normals, uvs, indices, material_color, material_emissive=(0,0,0)):
    # Convert vertex data to binary buffer
    pos_data = bytearray()
    norm_data = bytearray()
    uv_data = bytearray()
    idx_data = bytearray()

    min_pos = [float('inf')]*3
    max_pos = [float('-inf')]*3

    for v in vertices:
        pos_data.extend(struct.pack('<fff', v[0], v[1], v[2]))
        for i in range(3):
            if v[i] < min_pos[i]: min_pos[i] = v[i]
            if v[i] > max_pos[i]: max_pos[i] = v[i]

    for n in normals:
        norm_data.extend(struct.pack('<fff', n[0], n[1], n[2]))

    for u in uvs:
        uv_data.extend(struct.pack('<ff', u[0], u[1]))

    for idx in indices:
        idx_data.extend(struct.pack('<H', idx))

    # Pad buffers to 4-byte boundaries
    def pad(b):
        while len(b) % 4 != 0: b.append(0)

    pad(pos_data); pad(norm_data); pad(uv_data); pad(idx_data)

    buf_total = bytearray()
    off_pos = len(buf_total); buf_total.extend(pos_data)
    off_norm = len(buf_total); buf_total.extend(norm_data)
    off_uv = len(buf_total); buf_total.extend(uv_data)
    off_idx = len(buf_total); buf_total.extend(idx_data)

    uri = "data:application/octet-stream;base64," + base64.b64encode(buf_total).decode('utf-8')

    gltf = {
        "asset": {"version": "2.0", "generator": "Lisar3D Foliage Generator"},
        "scenes": [{"nodes": [0]}],
        "nodes": [{"mesh": 0, "name": name}],
        "meshes": [{
            "name": name,
            "primitives": [{
                "attributes": {
                    "POSITION": 0,
                    "NORMAL": 1,
                    "TEXCOORD_0": 2
                },
                "indices": 3,
                "material": 0
            }]
        }],
        "materials": [{
            "name": name + "_mat",
            "pbrMetallicRoughness": {
                "baseColorFactor": [material_color[0], material_color[1], material_color[2], 1.0],
                "metallicFactor": 0.1,
                "roughnessFactor": 0.7
            },
            "emissiveFactor": list(material_emissive)
        }],
        "buffers": [{
            "byteLength": len(buf_total),
            "uri": uri
        }],
        "bufferViews": [
            {"buffer": 0, "byteOffset": off_pos, "byteLength": len(pos_data), "target": 34962},
            {"buffer": 0, "byteOffset": off_norm, "byteLength": len(norm_data), "target": 34962},
            {"buffer": 0, "byteOffset": off_uv, "byteLength": len(uv_data), "target": 34962},
            {"buffer": 0, "byteOffset": off_idx, "byteLength": len(idx_data), "target": 34963}
        ],
        "accessors": [
            {"bufferView": 0, "byteOffset": 0, "componentType": 5126, "count": len(vertices), "type": "VEC3", "min": min_pos, "max": max_pos},
            {"bufferView": 1, "byteOffset": 0, "componentType": 5126, "count": len(normals), "type": "VEC3"},
            {"bufferView": 2, "byteOffset": 0, "componentType": 5126, "count": len(uvs), "type": "VEC2"},
            {"bufferView": 3, "byteOffset": 0, "componentType": 5123, "count": len(indices), "type": "SCALAR"}
        ]
    }

    out_path = os.path.join(output_dir, name + ".gltf")
    with open(out_path, "w") as f:
        json.dump(gltf, f)
    print(f"Generated {name}.gltf ({len(vertices)} verts)")

# 1. TREE CONIFER
def make_conifer():
    verts, norms, uvs, idxs = [], [], [], []
    def add_cone(base_y, r, h, segs):
        top_idx = len(verts)
        verts.append([0, base_y + h, 0])
        norms.append([0, 1, 0])
        uvs.append([0.5, 1.0])
        base_start = len(verts)
        for i in range(segs):
            a = (i / segs) * math.pi * 2
            x = math.cos(a) * r
            z = math.sin(a) * r
            verts.append([x, base_y, z])
            norms.append([x/r, 0.3, z/r])
            uvs.append([i / segs, 0.0])
        for i in range(segs):
            nxt = (i + 1) % segs
            idxs.extend([top_idx, base_start + i, base_start + nxt])

    # Trunk
    def add_trunk(r, h, segs):
        st = len(verts)
        for row in [0, 1]:
            y = row * h
            for i in range(segs):
                a = (i / segs) * math.pi * 2
                verts.append([math.cos(a)*r, y, math.sin(a)*r])
                norms.append([math.cos(a), 0, math.sin(a)])
                uvs.append([i/segs, row])
        for i in range(segs):
            n = (i+1)%segs
            idxs.extend([st+i, st+n, st+segs+i, st+n, st+segs+n, st+segs+i])

    add_trunk(0.4, 6.0, 8)
    add_cone(2.2, 2.2, 2.0, 8)
    add_cone(3.6, 1.8, 1.8, 8)
    add_cone(4.8, 1.3, 1.6, 8)
    add_cone(5.8, 0.8, 1.4, 8)
    create_gltf("tree_conifer", verts, norms, uvs, idxs, (0.15, 0.38, 0.22))

# 2. TREE OAK
def make_oak():
    verts, norms, uvs, idxs = [], [], [], []
    def add_sphere(cx, cy, cz, r, segs):
        st = len(verts)
        for i in range(segs + 1):
            lat = (i / segs) * math.pi
            for j in range(segs + 1):
                lon = (j / segs) * math.pi * 2
                x = math.sin(lat) * math.cos(lon)
                y = math.cos(lat)
                z = math.sin(lat) * math.sin(lon)
                noise = (math.sin(x*4) + math.cos(y*4)) * 0.12
                verts.append([cx + (x+noise)*r, cy + (y+noise)*r, cz + (z+noise)*r])
                norms.append([x, y, z])
                uvs.append([j/segs, i/segs])
        for i in range(segs):
            for j in range(segs):
                p1 = st + i * (segs + 1) + j
                p2 = p1 + segs + 1
                idxs.extend([p1, p2, p1 + 1, p2, p2 + 1, p1 + 1])

    # Trunk
    st = len(verts)
    for row in [0, 1]:
        y = row * 3.5
        for i in range(8):
            a = (i / 8) * math.pi * 2
            verts.append([math.cos(a)*0.4, y, math.sin(a)*0.4])
            norms.append([math.cos(a), 0, math.sin(a)])
            uvs.append([i/8, row])
    for i in range(8):
        n = (i+1)%8
        idxs.extend([st+i, st+n, st+8+i, st+n, st+8+n, st+8+i])

    add_sphere(0, 4.5, 0, 1.8, 8)
    add_sphere(1.2, 3.8, 0.4, 1.4, 8)
    add_sphere(-1.2, 3.6, -0.4, 1.3, 8)
    add_sphere(0, 5.4, 0, 1.2, 8)
    create_gltf("tree_oak", verts, norms, uvs, idxs, (0.2, 0.5, 0.22))

# 3. BUSH MEADOW
def make_bush():
    verts, norms, uvs, idxs = [], [], [], []
    def add_sphere(cx, cy, cz, r, segs):
        st = len(verts)
        for i in range(segs + 1):
            lat = (i / segs) * math.pi
            for j in range(segs + 1):
                lon = (j / segs) * math.pi * 2
                x = math.sin(lat) * math.cos(lon)
                y = math.cos(lat)
                z = math.sin(lat) * math.sin(lon)
                noise = math.sin(x*5)*0.08
                verts.append([cx + (x+noise)*r, cy + (y+noise)*r, cz + (z+noise)*r])
                norms.append([x, y, z])
                uvs.append([j/segs, i/segs])
        for i in range(segs):
            for j in range(segs):
                p1 = st + i * (segs + 1) + j
                p2 = p1 + segs + 1
                idxs.extend([p1, p2, p1 + 1, p2, p2 + 1, p1 + 1])

    add_sphere(0, 0.6, 0, 0.7, 8)
    add_sphere(0.4, 0.5, 0.3, 0.5, 6)
    add_sphere(-0.4, 0.45, -0.2, 0.45, 6)
    create_gltf("bush_meadow", verts, norms, uvs, idxs, (0.25, 0.58, 0.25))

# 4. FLOWER DAISY
def make_daisy():
    verts, norms, uvs, idxs = [], [], [], []
    # Stem
    st = len(verts)
    for row in [0, 1]:
        y = row * 0.45
        for i in range(6):
            a = (i / 6) * math.pi * 2
            verts.append([math.cos(a)*0.018, y, math.sin(a)*0.018])
            norms.append([math.cos(a), 0, math.sin(a)])
            uvs.append([i/6, row])
    for i in range(6):
        n = (i+1)%6
        idxs.extend([st+i, st+n, st+6+i, st+n, st+6+n, st+6+i])

    # 6 Petals (3D geometry)
    for p in range(6):
        pa = (p / 6) * math.pi * 2
        px = math.cos(pa) * 0.12
        pz = math.sin(pa) * 0.12
        st = len(verts)
        verts.append([0, 0.45, 0])
        verts.append([px, 0.44, pz])
        verts.append([px * 1.3, 0.46, pz * 1.3])
        norms.extend([[0, 1, 0], [0, 1, 0], [0, 1, 0]])
        uvs.extend([[0,0], [0.5, 0.5], [1,1]])
        idxs.extend([st, st+1, st+2])

    create_gltf("flower_daisy", verts, norms, uvs, idxs, (0.95, 0.95, 0.95))

# 5. FLOWER BUTTERCUP
def make_buttercup():
    verts, norms, uvs, idxs = [], [], [], []
    st = len(verts)
    for row in [0, 1]:
        y = row * 0.4
        for i in range(6):
            a = (i / 6) * math.pi * 2
            verts.append([math.cos(a)*0.018, y, math.sin(a)*0.018])
            norms.append([math.cos(a), 0, math.sin(a)])
            uvs.append([i/6, row])
    for i in range(6):
        n = (i+1)%6
        idxs.extend([st+i, st+n, st+6+i, st+n, st+6+n, st+6+i])

    for p in range(5):
        pa = (p / 5) * math.pi * 2
        px = math.cos(pa) * 0.1
        pz = math.sin(pa) * 0.1
        st = len(verts)
        verts.append([0, 0.4, 0])
        verts.append([px, 0.43, pz])
        verts.append([px * 1.25, 0.45, pz * 1.25])
        norms.extend([[0, 1, 0], [0, 1, 0], [0, 1, 0]])
        uvs.extend([[0,0], [0.5, 0.5], [1,1]])
        idxs.extend([st, st+1, st+2])

    create_gltf("flower_buttercup", verts, norms, uvs, idxs, (1.0, 0.84, 0.0))

make_conifer()
make_oak()
make_bush()
make_daisy()
make_buttercup()
