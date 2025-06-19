import bpy
import os
import sys
import argparse
import dotenv
from dotenv import dotenv_values


def apply_decimate(input_file_path: str, output_file_path: str, decimate_ratio: float = 0.008):
    # Check if the input file exists
    if not os.path.exists(input_file_path):
        print(f"Error: Input file does not exist at {input_file_path}")
        return

    # Deselect all objects
    bpy.ops.object.select_all(action='SELECT')
    # Delete selected objects
    bpy.ops.object.delete()

    # Import the .glb file
    bpy.ops.import_scene.gltf(filepath=input_file_path)

    # Ensure only the imported object is selected
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = bpy.context.scene.objects[-1]
    bpy.context.view_layer.objects.active.select_set(True)

    # Apply the Decimate modifier
    obj = bpy.context.object
    print(obj)
    decimate_modifier = obj.modifiers.new(name="Decimate", type='DECIMATE')
    print(decimate_modifier)

    # Set the decimate ratio (adjust as needed)
    decimate_modifier.ratio = decimate_ratio

    # Apply the modifier (this will make the decimation permanent)
    bpy.ops.object.modifier_apply(modifier=decimate_modifier.name)

    # Export the modified object to a new .glb file
    bpy.ops.export_scene.gltf(filepath=output_file_path, export_format='GLB')

    print(f"Decimated model saved to {output_file_path}")


if __name__ == "__main__":
    # input_file_path = os.environ.get("INPUT_FILE_PATH")
    # output_file_path = os.environ.get("OUTPUT_FILE_PATH")
    # print("input_file_path", input_file_path)
    # print("output_file_path", output_file_path)

    # Example usage from command line arguments
    # input_file_path = sys.argv[1]
    # output_file_path = sys.argv[2]
    # # decimate_ratio = float(sys.argv[3]) if len(sys.argv) > 3 else 0.008
    input_file_path = r"D:\3d-reconstruction\DeepLSD\moge-out-room-downsam\b01\mesh.glb"
    output_file_path = r"D:\3d-reconstruction\DeepLSD\moge-out-room-downsam\b01\mesh_optimized.glb"
    
    # config = dotenv_values(".env")
    # for key, value in config.items():
    #     globals()[key] = value

    apply_decimate(input_file_path, output_file_path, decimate_ratio=0.008)

# "C:\Program Files\Blender Foundation\Blender 4.0\blender.exe" --background --python decimate_blender.py



# if __name__ == "__main__":
#     # Set up argument parser
#     parser = argparse.ArgumentParser(description="Apply decimation to a 3D model.")
#     parser.add_argument('input_file', type=str, help="Path to the input .glb file.")
#     parser.add_argument('output_file', type=str, help="Path to save the decimated .glb file.")
#     parser.add_argument('--decimate_ratio', type=float, default=0.008, help="The decimate ratio (default: 0.008)")

#     # Parse the arguments
#     args = parser.parse_args()

#     # Call the decimate function with the parsed arguments
#     apply_decimate(args.input_file, args.output_file, args.decimate_ratio)

