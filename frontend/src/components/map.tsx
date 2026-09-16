import React, { useEffect, useRef, useState } from 'react';

export const FactoryMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMap = async () => {
      try {
        // 1. public/my_map.pgm からテキストデータを取得 (ASCII P2形式)
        const pgmRes = await fetch('/my_map.pgm');
        const pgmText = await pgmRes.text();

        // コメント行(#...)を除外してデータトークンに分解
        const tokens = pgmText
          .replace(/#.*/g, '')
          .trim()
          .split(/\s+/);

        if (tokens[0] !== 'P2') {
          console.error('P2形式のPGMファイルではありません');
          return;
        }

        const width = parseInt(tokens[1], 10);
        const height = parseInt(tokens[2], 10);
        const maxValue = parseInt(tokens[3], 10);
        const pixelValues = tokens.slice(4).map((v) => parseInt(v, 10));

        // 2. Canvas のサイズ設定とピクセル描画
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const imgData = ctx.createImageData(width, height);
        for (let i = 0; i < pixelValues.length; i++) {
          // PGMの輝度値を 0〜255 の RGB 値にマッピング
          const val = Math.floor((pixelValues[i] / maxValue) * 255);
          const idx = i * 4;
          imgData.data[idx] = val;     // R
          imgData.data[idx + 1] = val; // G
          imgData.data[idx + 2] = val; // B
          imgData.data[idx + 3] = 255; // Alpha
        }

        ctx.putImageData(imgData, 0, 0);
        setLoading(false);
      } catch (err) {
        console.error('マップの読み込みに失敗しました:', err);
      }
    };

    loadMap();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Factory Map</h2>
      {loading && <p>マップ画像を読み込み中...</p>}

      <div
        style={{
          width: '300px',  // 見やすく拡大して表示
          height: '300px',
          border: '2px solid #333',
          backgroundColor: '#ccc',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            imageRendering: 'pixelated', // ドットを輪郭くっきり表示
          }}
        />
      </div>
    </div>
  );
};