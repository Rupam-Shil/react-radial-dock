# Basic — right-click anywhere

```tsx
'use client';
import RadialDock from 'react-radial-dock';
import 'react-radial-dock/styles.css';
import { Star, Bookmark, Pin } from 'lucide-react';

export default function Demo() {
  const items = [
    { id: 'star', icon: <Star size={20} />, label: 'Star', onSelect: () => console.log('star') },
    { id: 'mark', icon: <Bookmark size={20} />, label: 'Mark', onSelect: () => console.log('mark') },
    { id: 'pin', icon: <Pin size={20} />, label: 'Pin', onSelect: () => console.log('pin') },
  ];
  return <RadialDock items={items} />;
}
```

Right-click anywhere on the page (outside `<input>` / `<textarea>`) to open.
