# HTML, CSS, JavaScript Interview Questions

## HTML

### 1. What is semantic HTML?
**Answer:**
Semantic HTML uses elements that clearly describe their meaning (e.g., <header>, <footer>, <article>).

## CSS

### 1. What is the difference between class and ID selectors in CSS?
**Answer:**
Class selectors (.) can be used multiple times, ID selectors (#) must be unique.

**Example:**
```css
.my-class { color: red; }
#my-id { color: blue; }
```

## JavaScript

### 1. What is closure in JavaScript?
**Answer:**
A closure is a function that has access to its own scope, the outer function's scope, and the global scope.

**Example:**
```javascript
function outer() {
  let count = 0;
  return function inner() {
    count++;
    return count;
  }
}
```