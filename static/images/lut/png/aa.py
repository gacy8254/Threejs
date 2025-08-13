import os
import re

def replace_special_chars_with_underscore(s):
    """将字符串中的非字母数字字符替换为下划线 _"""
    return re.sub(r'[^a-zA-Z0-9]', '_', s)

def name_starts_with_digit(s):
    return len(s) > 0 and s[0].isdigit()

def generate_js_code(folder_path):
    if not os.path.isdir(folder_path):
        raise ValueError(f"提供的路径不是一个文件夹: {folder_path}")

    base_import_prefix = './static/images/lut/png/'  # ✅ 强制所有 import 路径以此开头

    imports = []
    map_entries = []

    for root, dirs, files in os.walk(folder_path):
        for file in files:
            full_path = os.path.join(root, file)
            # 获取文件在目标文件夹内的相对路径，比如：png/1.png 或 other/2.png
            rel_path_in_lut = os.path.relpath(full_path, start=folder_path)

            # 强制拼接成：./static/images/lut/png/rel_path_in_lut
            full_import_path = base_import_prefix + rel_path_in_lut
            full_import_path = full_import_path.replace('\\', '/')  # 统一使用 /

            filename = os.path.basename(file)
            filename_without_ext, _ = os.path.splitext(filename)

            # 替换特殊字符为 _
            cleaned_name = replace_special_chars_with_underscore(filename_without_ext)

            # 判断是否以数字开头
            if name_starts_with_digit(cleaned_name):
                import_name = f'T{cleaned_name}'
            else:
                import_name = cleaned_name

            var_name = import_name

            # 生成 import 语句
            import_stmt = f"import {import_name} from '{full_import_path}';"
            imports.append(import_stmt)

            # 生成 Map 条目
            map_entries.append(f"  ['{import_name}', {var_name}]")

    # 拼接所有 import 语句
    imports_str = '\n'.join(imports)

    # 拼接 Map
    map_str = "let luts = new Map([\n" + ",\n".join(map_entries) + "\n]);"

    # 最终 JS 代码
    result = imports_str + "\n\n" + map_str
    return result

if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        folder_path = sys.argv[1]
    else:
        folder_path = input("请输入目标文件夹路径（如 static/images/lut/）: ").strip()

    try:
        js_code = generate_js_code(folder_path)
        print(js_code)  # 打印到控制台
        # 保存到文件：python script.py > output.js
    except Exception as e:
        print(f"发生错误: {e}")