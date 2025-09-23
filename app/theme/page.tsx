export default function ThemePage() {
  return (
    <main className="p-8 space-y-8">
      <h1 className="text-4xl font-bold mb-8">Font Theme Examples</h1>
      
      {/* Ringside Compressed Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Ringside Compressed</h2>
        <div className="space-y-2">
          <p className="font-ringside-compressed-light text-lg">
            Light (300): Maps to Medium.otf - This is light weight text using Ringside Compressed
          </p>
          <p className="font-ringside-compressed-regular text-lg">
            Regular (400): Maps to Bold.otf - This is regular weight text using Ringside Compressed
          </p>
          <p className="font-ringside-compressed-medium text-lg">
            Medium (500): Maps to Black.otf - This is medium weight text using Ringside Compressed
          </p>
          <p className="font-ringside-compressed-bold text-lg">
            Bold (700): Maps to Black.otf - This is bold weight text using Ringside Compressed
          </p>
          <p className="font-ringside-compressed-black text-lg">
            Black (900): Maps to Black.otf - This is black weight text using Ringside Compressed
          </p>
        </div>
      </section>

      {/* Ringside Narrow Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Ringside Narrow</h2>
        <div className="space-y-2">
          <p className="font-ringside-narrow-light text-lg">
            Light (300): Maps to Book.otf - This is light weight text using Ringside Narrow
          </p>
          <p className="font-ringside-narrow-regular text-lg">
            Regular (400): Maps to Bold.otf - This is regular weight text using Ringside Narrow
          </p>
          <p className="font-ringside-narrow-regular-italic text-lg">
            Regular Italic (400): Maps to Book-Italic.otf - This is italic weight text using Ringside Narrow
          </p>
          <p className="font-ringside-narrow-medium text-lg">
            Medium (500): Maps to Bold.otf - This is medium weight text using Ringside Narrow
          </p>
          <p className="font-ringside-narrow-bold text-lg">
            Bold (700): Maps to Bold.otf - This is bold weight text using Ringside Narrow
          </p>
        </div>
      </section>

      {/* Typography Scale Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Typography Scale (Ringside Compressed)</h2>
        <div className="space-y-2">
          <p className="text-ringside-compressed-xs">Extra Small Text</p>
          <p className="text-ringside-compressed-sm">Small Text</p>
          <p className="text-ringside-compressed-base">Base Text</p>
          <p className="text-ringside-compressed-lg">Large Text</p>
          <p className="text-ringside-compressed-xl">Extra Large Text</p>
          <p className="text-ringside-compressed-2xl">2X Large Text</p>
          <p className="text-ringside-compressed-3xl">3X Large Text</p>
          <p className="text-ringside-compressed-4xl">4X Large Text</p>
        </div>
      </section>

      {/* Color Palette Showcase */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Color Palette</h2>
        
        {/* Peppes Red Colors */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Peppes Red Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--Peppes-Red)' }}></div>
              <p className="text-sm font-mono">--Peppes-Red</p>
              <p className="text-xs text-gray-600">#cd1719</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--peppes-80)' }}></div>
              <p className="text-sm font-mono">--peppes-80</p>
              <p className="text-xs text-gray-600">80% opacity</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--peppes-60)' }}></div>
              <p className="text-sm font-mono">--peppes-60</p>
              <p className="text-xs text-gray-600">60% opacity</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--peppes-40)' }}></div>
              <p className="text-sm font-mono">--peppes-40</p>
              <p className="text-xs text-gray-600">40% opacity</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--peppes-20)' }}></div>
              <p className="text-sm font-mono">--peppes-20</p>
              <p className="text-xs text-gray-600">20% opacity</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--peppes-10)' }}></div>
              <p className="text-sm font-mono">--peppes-10</p>
              <p className="text-xs text-gray-600">10% opacity</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--peppes-red-20-black)' }}></div>
              <p className="text-sm font-mono">--peppes-red-20-black</p>
              <p className="text-xs text-gray-600">80% opacity</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--peppes-red-40-black)' }}></div>
              <p className="text-sm font-mono">--peppes-red-40-black</p>
              <p className="text-xs text-gray-600">60% opacity</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--peppes-red-60-black)' }}></div>
              <p className="text-sm font-mono">--peppes-red-60-black</p>
              <p className="text-xs text-gray-600">40% opacity</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--peppes-red-80-black)' }}></div>
              <p className="text-sm font-mono">--peppes-red-80-black</p>
              <p className="text-xs text-gray-600">20% opacity</p>
            </div>
          </div>
        </div>

        {/* Glowing Red Colors */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Glowing Red Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--Glowing-Red)' }}></div>
              <p className="text-sm font-mono">--Glowing-Red</p>
              <p className="text-xs text-gray-600">#ee1d25</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--glowing-red-80)' }}></div>
              <p className="text-sm font-mono">--glowing-red-80</p>
              <p className="text-xs text-gray-600">80% opacity</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--glowing-red-60)' }}></div>
              <p className="text-sm font-mono">--glowing-red-60</p>
              <p className="text-xs text-gray-600">60% opacity</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--glowing-red-40)' }}></div>
              <p className="text-sm font-mono">--glowing-red-40</p>
              <p className="text-xs text-gray-600">40% opacity</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--glowing-red-20)' }}></div>
              <p className="text-sm font-mono">--glowing-red-20</p>
              <p className="text-xs text-gray-600">20% opacity</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--glowing-red-10)' }}></div>
              <p className="text-sm font-mono">--glowing-red-10</p>
              <p className="text-xs text-gray-600">10% opacity</p>
            </div>
          </div>
        </div>

        {/* Coal Colors */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Coal Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--Coal)' }}></div>
              <p className="text-sm font-mono">--Coal</p>
              <p className="text-xs text-gray-600">#323232</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--coal-80)' }}></div>
              <p className="text-sm font-mono">--coal-80</p>
              <p className="text-xs text-gray-600">80% opacity</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--coal-60)' }}></div>
              <p className="text-sm font-mono">--coal-60</p>
              <p className="text-xs text-gray-600">60% opacity</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--Invisible-White)' }}></div>
              <p className="text-sm font-mono">--Invisible-White</p>
              <p className="text-xs text-gray-600">20% opacity</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--coal-10)' }}></div>
              <p className="text-sm font-mono">--coal-10</p>
              <p className="text-xs text-gray-600">5% opacity</p>
            </div>
          </div>
        </div>

        {/* Base Colors */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Base Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--Light-BG)' }}></div>
              <p className="text-sm font-mono">--Light-BG</p>
              <p className="text-xs text-gray-600">#fffdf9</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border border-gray-300" style={{ backgroundColor: 'var(--Pure-Black)' }}></div>
              <p className="text-sm font-mono">--Pure-Black</p>
              <p className="text-xs text-gray-600">#000</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border border-gray-300" style={{ backgroundColor: 'var(--White)' }}></div>
              <p className="text-sm font-mono">--White</p>
              <p className="text-xs text-gray-600">#fff</p>
            </div>
          </div>
        </div>

        {/* Additional Brand Colors */}
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Additional Brand Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--Peppes-Lyserosa)' }}></div>
              <p className="text-sm font-mono">--Peppes-Lyserosa</p>
              <p className="text-xs text-gray-600">rgba(248, 246, 241, 1)</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--Neutral-neutral90)' }}></div>
              <p className="text-sm font-mono">--Neutral-neutral90</p>
              <p className="text-xs text-gray-600">#F8F6F1</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--secondary-secondary-main-95)' }}></div>
              <p className="text-sm font-mono">--secondary-secondary-main-95</p>
              <p className="text-xs text-gray-600">rgba(252, 241, 241, 1)</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border border-gray-300" style={{ backgroundColor: 'var(--Neutral-Black---neutral0)' }}></div>
              <p className="text-sm font-mono">--Neutral-Black---neutral0</p>
              <p className="text-xs text-gray-600">rgba(0, 0, 0, 1)</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--Neutral-neutral20)' }}></div>
              <p className="text-sm font-mono">--Neutral-neutral20</p>
              <p className="text-xs text-gray-600">#33322f</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--Neutral-neutral30)' }}></div>
              <p className="text-sm font-mono">--Neutral-neutral30</p>
              <p className="text-xs text-gray-600">rgba(86, 85, 81, 1)</p>
            </div>
            <div className="space-y-2">
              <div className="w-full h-16 rounded border" style={{ backgroundColor: 'var(--primary-primary-main-40)' }}></div>
              <p className="text-sm font-mono">--primary-primary-main-40</p>
              <p className="text-xs text-gray-600">rgba(205, 23, 25, 1)</p>
            </div>
          </div>
        </div>

        {/* Color Usage Examples */}
        <div className="space-y-4 p-6 rounded-lg" style={{ backgroundColor: 'var(--peppes-10)' }}>
          <h3 className="text-xl font-medium">Color Usage Examples</h3>
          <div className="space-y-4">
            <div className="p-4 rounded" style={{ backgroundColor: 'var(--Peppes-Red)', color: 'var(--White)' }}>
              <p className="font-semibold">Primary Button Style</p>
              <p className="text-sm">Using --Peppes-Red background with --White text</p>
            </div>
            <div className="p-4 rounded" style={{ backgroundColor: 'var(--Light-BG)', color: 'var(--Coal)' }}>
              <p className="font-semibold">Card Background Style</p>
              <p className="text-sm">Using --Light-BG background with --Coal text</p>
            </div>
            <div className="p-4 rounded border-2" style={{ borderColor: 'var(--glowing-red-40)', backgroundColor: 'var(--peppes-10)' }}>
              <p className="font-semibold">Accent Border Style</p>
              <p className="text-sm">Using --glowing-red-40 border with --peppes-10 background</p>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Instructions */}
      <section className="space-y-4 p-6 bg-gray-100 rounded-lg">
        <h2 className="text-2xl font-semibold">How to Use These Fonts</h2>
        <div className="space-y-2 text-sm">
          <p><strong>CSS Classes:</strong> Use classes like <code>font-ringside-compressed</code> or <code>font-ringside-narrow</code></p>
          <p><strong>CSS Variables:</strong> Use <code>var(--font-ringside-compressed)</code> or <code>var(--font-ringside-narrow)</code></p>
          <p><strong>Inline Styles:</strong> Use <code>style=&#123;&#123;fontFamily: &apos;var(--font-ringside-compressed)&apos;&#125;&#125;</code></p>
        </div>
      </section>

      {/* Font Weight Reference */}
      <section className="space-y-4 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-2xl font-semibold">Font Weight Reference</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Ringside Compressed</h3>
            <ul className="space-y-1">
              <li><code>font-weight: 300</code> → <code>RingsideCompressed-500-Medium.otf</code></li>
              <li><code>font-weight: 400</code> → <code>RingsideCompressed-700-Bold.otf</code></li>
              <li><code>font-weight: 500</code> → <code>RingsideCompressed-900-Black.otf</code></li>
              <li><code>font-weight: 700</code> → <code>RingsideCompressed-900-Black.otf</code></li>
              <li><code>font-weight: 900</code> → <code>RingsideCompressed-900-Black.otf</code></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Ringside Narrow</h3>
            <ul className="space-y-1">
              <li><code>font-weight: 300</code> → <code>RingsideNarrow-400-Book.otf</code></li>
              <li><code>font-weight: 400</code> → <code>RingsideNarrow-700-Bold.otf</code></li>
              <li><code>font-weight: 400 + italic</code> → <code>RingsideNarrow-400-Book-Italic.otf</code></li>
              <li><code>font-weight: 500</code> → <code>RingsideNarrow-700-Bold.otf</code></li>
              <li><code>font-weight: 700</code> → <code>RingsideNarrow-700-Bold.otf</code></li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
