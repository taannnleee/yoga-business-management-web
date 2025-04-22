import pandas as pd
import json
from collections import defaultdict

df = pd.read_csv(r"D:\Year4\Laptrinhdidongnangcao\Group\yoga-business-management-web\ml\classification model\train_data.csv")


# Chuẩn hóa tên tư thế
df["pose"] = df["class_name"].apply(lambda x: x.split("_", 1)[1] if "_" in x else x)

# Lọc ra các phần cơ thể (bỏ cột có "_score")
body_parts = sorted(set(col.rsplit('_', 1)[0] for col in df.columns if '_score' not in col and '_' in col and col not in ['class_name', 'pose']))

# Tính trung bình
pose_sums = defaultdict(lambda: defaultdict(lambda: [0.0, 0.0]))
pose_counts = defaultdict(int)

for _, row in df.iterrows():
    pose = row['pose']
    pose_counts[pose] += 1
    for part in body_parts:
        x = row.get(f'{part}_x', 0.0)
        y = row.get(f'{part}_y', 0.0)
        pose_sums[pose][part][0] += x
        pose_sums[pose][part][1] += y

pose_averages = {}
for pose, parts in pose_sums.items():
    pose_averages[pose] = {}
    for part, (sum_x, sum_y) in parts.items():
        count = pose_counts[pose]
        pose_averages[pose][part] = [sum_x / count, sum_y / count]

# Xuất ra JSON
with open("expected_pose_points.json", "w") as f:
    json.dump(pose_averages, f, indent=2)
