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
