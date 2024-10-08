## Intro to Vue2.0
- Basic use of Vue Instance Options; 'data', 'methods', 'computed'.
- Basic use of Lifecyle Hooks: 'mounted()'.
- Use of built-in methods: $emit && $on to move data between components.
- Use of directives: 'v-on, v-if, v-for, etc...'

## Development
- use Live Server extension and select 'Go Live' from the bottom of VS Code IDE to run dev server.
- hotloads on save.

## Component Tree
Root  
├── Product (img, Title, details, colors, add to cart)  
│-----└── Product-Tabs (contains tabs for 'Reviews' & 'Make a Review')  
│------------├── Reviews (with submitted reviews)  
│------------└── Make a Review (form)  
│------------------└── Product-Review (inside 'Make a Review' tab)