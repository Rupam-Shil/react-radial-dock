# Theming

```tsx
<RadialDock
  items={items}
  theme={{
    sliceFillHover: '#FF4D4F',
    shadow: '0 12px 40px rgba(255,77,79,0.4)',
    bg: 'rgba(0, 0, 0, 0.7)',
  }}
  classNames={{
    container: 'my-custom-glow',
  }}
/>
```

You can also set the CSS variables on a parent element to theme multiple instances at once:

```css
.my-app {
  --rrd-slice-fill-hover: var(--brand-blue);
  --rrd-shadow: 0 8px 24px rgba(0, 50, 200, 0.4);
}
```
