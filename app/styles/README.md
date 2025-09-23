# Styles Organization

This folder contains all CSS files organized by purpose for better maintainability.

## File Structure

### `variables.css`
- CSS custom properties (variables)
- Theme variables for Tailwind CSS
- Color definitions
- Font variable definitions

### `fonts.css`
- All `@font-face` declarations
- Font utility classes
- Typography scale classes
- Font weight utilities

### `base.css`
- Base element styles
- Body styles
- Default element styling

### `utilities.css`
- Custom utility classes
- Helper classes
- Additional utility functions

## Usage

All styles are imported in `globals.css` in the correct order:

1. Tailwind CSS
2. Variables (for CSS custom properties)
3. Fonts (depends on variables)
4. Base styles (depends on variables and fonts)
5. Utilities (additional helper classes)

## Adding New Styles

- **Font-related**: Add to `fonts.css`
- **Variables**: Add to `variables.css`
- **Base element styles**: Add to `base.css`
- **Utility classes**: Add to `utilities.css`
- **Component-specific**: Consider creating a new file like `components.css`
