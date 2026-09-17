from PIL import Image, ImageDraw

# 10m x 10m のマップ（解像度 0.05m/pixel ⇒ 200x200 ピクセル）
width, height = 200, 200

# PGM形式の値: 254 = 自由領域（白/走れる）, 0 = 障害物（黒/壁）, 205 = 未探索（灰）
img = Image.new('L', (width, height), color=254)
draw = ImageDraw.Draw(img)

# 外枠（壁）を描画
draw.rectangle([0, 0, width-1, height-1], outline=0, width=3)

# 内部の障害物（柱や部屋の壁）
draw.rectangle([30, 30, 80, 80], outline=0, fill=0) # 中央の大きな障害物

# 部屋の壁とドアの隙間
draw.line([(120, 40), (170, 40)], fill=0, width=3)
draw.line([(120, 40), (120, 140)], fill=0, width=3)
draw.line([(170, 40), (170, 140)], fill=0, width=3)
draw.line([(120, 140), (145, 140)], fill=0, width=3) # ドア部分を開けておく

# 画像ファイル（demo_map.pgm）として保存
img.save("demo_map.pgm")
print("demo_map.pgm を作成しました。")
