# Topo EH-AI Consulting Technical Assessment (FE)  
---
## Overview
<img width="1683" height="801" alt="image" src="https://github.com/user-attachments/assets/fb8b8291-6253-413d-b8e7-512b29fd29d1" />

This project is a **Chart Builder application** designed to dynamically visualize data using various chart types. It allows users to:
- Select chart type (`bar`, `line`, `pie`, `multiline`, `boxplot`).  
- Choose aggregation type (`count`, `sum`, `average`).  
- Select columns for X, Y, Z axes.  
- Preview charts.
- Save their favourite chart presets.

**Architecture:**
- **React + TypeScript:** front-end. 
- **Ant Design (AntD):** UI components for forms, buttons, cards, alerts, and layout.  
- **Recharts:** For rendering  charts.  
- **Axios:** Handles API requests to fetch chart data from the back-end.

**Approach**
- **State Management:** Local state via React hooks (`useState`, `useEffect`) and `Form.useWatch` for dynamic form changes.  
- **ChartPreview Component:** Dynamically renders different charts based on selected options and data structure.  
- **Error Handling & Validation:** Prevents invalid configurations and displays messages for empty or failed data fetches.
---

## Setup Instructions

1. **Clone the repository**  

```bash
git clone https://github.com/Shujin05/topo-take-home-assignment.git
cd topo-take-home-assignment
```

2. **Install dependencies** 
```bash
cd frontend
npm install
```

3. **Start the development server** 
```bash
npm run dev
```
---

## Testing Instructions

---
## Challenges
- I faced difficulties plotting the boxplot. Since Recharts doesn't have a built-in boxplot component, I tried to create a custom boxplot using stacked bars and custom SVG elements such as HorizonBar and DotBar. However, I ran into sizing issues, and the whole plot couldn't fit into the designated space. Thus, I decided to use ApexChart's boxplot instead.
- The data fetched from the backend was often not in a usable format to create the plots, especially when the aggregation type was sum or average, or when the plot was a boxplot. To resolve this, I had to preprocess the data.
- I encountered difficulties loading the chart presets, as it required transferring chart data from one page to another. To overcome this, I used react's URLSearchParams to pass the chart params and generate the same chart.

---
## Design Choices
- TypeScript is used alongside React to add static typing to the JavaScript code, ensuring that props, states, and other variables are used in a type-safe manner.
- Ant Design: comprehensive UI library with pre-designed components to ensure a consistent UI interface.
- Recharts: supports features like hover effects, tooltips, easy to integrate into a React-based website due to declarative syntax.
- UI Choices: I decided to go with a green (Topo AI's logo colour), minimalist UI, to prevent overwhelming users and direct users to the core functionalities of the website.

