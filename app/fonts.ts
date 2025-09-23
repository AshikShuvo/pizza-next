import localFont from 'next/font/local';

// Ringside Compressed font family - corrected weight mappings
export const ringsideCompressed = localFont({
  src: [
    {
      path: '../public/fonts/ringside-compressed/RingsideCompressed-500-Medium.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/ringside-compressed/RingsideCompressed-700-Bold.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/ringside-compressed/RingsideCompressed-900-Black.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/ringside-compressed/RingsideCompressed-900-Black.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/ringside-compressed/RingsideCompressed-900-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-ringside-compressed',
  display: 'swap',
});

// Ringside Narrow font family - corrected weight mappings
export const ringsideNarrow = localFont({
  src: [
    {
      path: '../public/fonts/ringside-narrow/RingsideNarrow-400-Book.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/ringside-narrow/RingsideNarrow-700-Bold.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/ringside-narrow/RingsideNarrow-400-Book-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/ringside-narrow/RingsideNarrow-700-Bold.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/ringside-narrow/RingsideNarrow-700-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-ringside-narrow',
  display: 'swap',
});
