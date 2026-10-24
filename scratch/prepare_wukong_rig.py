"""Transfer the matching Mixamo weights to the user's unrigged Wukong 2.0 GLB."""
import bpy
import os
import sys


def args_after_separator():
    return sys.argv[sys.argv.index("--") + 1:]


model_path, rig_source_path, output_path = args_after_separator()
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

bpy.ops.import_scene.gltf(filepath=model_path)
new_meshes = {obj.name: obj for obj in bpy.context.scene.objects if obj.type == "MESH"}

bpy.ops.import_scene.fbx(filepath=rig_source_path, use_anim=True)
armature = next(obj for obj in bpy.context.scene.objects if obj.type == "ARMATURE")
source_meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH" and len(obj.vertex_groups) > 0]
transferred = []

for source in source_meshes:
    base_name = source.name.rsplit(".", 1)[0] if source.name.rsplit(".", 1)[-1].isdigit() else source.name
    target = new_meshes.get(base_name)
    if target is None:
        continue

    for bone in armature.data.bones:
        if target.vertex_groups.get(bone.name) is None:
            target.vertex_groups.new(name=bone.name)

    modifier = target.modifiers.new(name="Mixamo weight transfer", type="DATA_TRANSFER")
    modifier.object = source
    modifier.use_vert_data = True
    modifier.data_types_verts = {"VGROUP_WEIGHTS"}
    modifier.vert_mapping = "POLYINTERP_NEAREST"
    modifier.layers_vgroup_select_src = "ALL"
    modifier.layers_vgroup_select_dst = "NAME"

    bpy.context.view_layer.objects.active = target
    target.select_set(True)
    bpy.ops.object.modifier_apply(modifier=modifier.name)
    target.select_set(False)

    world_matrix = target.matrix_world.copy()
    target.parent = armature
    target.matrix_parent_inverse = armature.matrix_world.inverted()
    target.matrix_world = world_matrix
    skin = target.modifiers.new(name="Wukong 2.0 skin", type="ARMATURE")
    skin.object = armature
    transferred.append(target)

if len(transferred) != len(new_meshes):
    missing = sorted(set(new_meshes) - {obj.name for obj in transferred})
    raise RuntimeError(f"Only transferred {len(transferred)}/{len(new_meshes)} mesh weights; missing {missing}")

# Keep the new GLB geometry and materials, and only the rig needed to animate it.
for obj in list(bpy.context.scene.objects):
    if obj != armature and obj not in transferred:
        bpy.data.objects.remove(obj, do_unlink=True)

armature.name = "WukongRig"
armature.animation_data_clear()
bpy.ops.object.select_all(action="DESELECT")
armature.select_set(True)
for obj in transferred:
    obj.select_set(True)
bpy.context.view_layer.objects.active = armature

os.makedirs(os.path.dirname(output_path), exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format="GLB",
    use_selection=True,
    export_animations=False,
    export_skins=True,
    export_cameras=False,
    export_lights=False,
    export_materials="EXPORT",
    export_texcoords=True,
    export_normals=True,
    export_apply=False,
)
print(f"Wrote {output_path}; transferred vertex weights for {len(transferred)} matching meshes to {len(armature.data.bones)} Mixamo bones.")
