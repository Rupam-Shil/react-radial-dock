# Custom slice content

```tsx
import RadialDock from 'react-radial-dock';
import 'react-radial-dock/styles.css';

const items = [
  {
    id: 'star',
    onSelect: () => {},
    render: ({ hovered }) => (
      <div style={{ transform: hovered ? 'scale(1.2)' : 'scale(1)', transition: 'transform .15s' }}>
        ⭐
      </div>
    ),
  },
  // …
];

export default () => <RadialDock items={items} />;
```
