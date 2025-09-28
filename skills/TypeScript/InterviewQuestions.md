# TypeScript Interview Questions

## Types

### 1. What are the basic types in TypeScript?
**Answer:**
TypeScript provides types like string, number, boolean, array, tuple, enum, any, void, null, and undefined.

**Example:**
```typescript
let age: number = 25;
let name: string = 'Alice';
```

## Advanced

### 1. What are generics in TypeScript?
**Answer:**
Generics allow you to write functions and classes that work with any data type.

**Example:**
```typescript
function identity<T>(arg: T): T {
  return arg;
}
```
