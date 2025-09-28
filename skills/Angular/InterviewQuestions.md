# Angular Interview Questions

## Components

### 1. What is a component in Angular?
**Answer:**
A component controls a patch of screen called a view. It consists of a TypeScript class, HTML template, and CSS styles.

**Example:**
```typescript
@Component({
  selector: 'app-hello',
  template: '<h1>Hello, Angular!</h1>'
})
export class HelloComponent {}
```

## Services

### 1. What is a service in Angular?
**Answer:**
A service is used to share data, logic, or functions across components.

**Example:**
```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  getData() { return [1,2,3]; }
}
```