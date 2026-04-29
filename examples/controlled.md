# Controlled mode

```tsx
'use client';
import { useState } from 'react';
import RadialDock from 'react-radial-dock';
import 'react-radial-dock/styles.css';

export default function Demo() {
  const [open, setOpen] = useState(false);
  const items = [/* … */];
  return (
    <>
      <button onClick={() => setOpen((o) => !o)}>Toggle dock</button>
      <RadialDock
        items={items}
        open={open}
        onOpenChange={setOpen}
        position={{ x: 400, y: 300 }}
      />
    </>
  );
}
```
