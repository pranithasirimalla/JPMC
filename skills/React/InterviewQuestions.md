# React Interview Questions

## Hooks

### 1. What are React Hooks?
**Answer:**
Hooks are functions that let you use state and other React features in functional components.

**Example:**
```javascript
import { useState } from 'react';
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## State Management

### 1. What is Redux?
**Answer:**
Redux is a state management library for JavaScript apps, often used with React.

**Example:**
```javascript
const initialState = { value: 0 };
function reducer(state = initialState, action) {
  switch(action.type) {
    case 'INCREMENT': return { value: state.value + 1 };
    default: return state;
  }
}
```