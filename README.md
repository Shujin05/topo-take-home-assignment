# Topo EH-AI Consulting Technical Assessment (FE)  
---
## Overview
<img width="1683" height="801" alt="image" src="https://github.com/user-attachments/assets/fb8b8291-6253-413d-b8e7-512b29fd29d1" />

This project is a **Chart Builder application** designed to dynamically visualize data using various chart types. It allows users to:
- Select chart type (`bar`, `line`, `pie`, `multiline`, `boxplot`).  
- Choose aggregation type (`count`, `sum`, `average`).  
- Select columns for X, Y, Z axes.  
- Preview charts.

**Architecture:**
- **React + TypeScript:** front-end. 
- **Ant Design (AntD):** UI components for forms, buttons, cards, alerts, and layout.  
- **Recharts:** For rendering interactive charts.  
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
- Pie and boxplot charts have limited dynamic rendering compared to bar/line charts due to Recharts API constraints.
- Multiline chart grouping is only supported for a single Z-axis column.
- Chart rendering heavily depends on correct data formatting from the API.
- No persistent storage for user selections and graph presets on refresh.

---
## Design Choices
- TypeScript is used alongside React to add static typing to the JavaScript code, ensuring that props, states, and other variables are used in a type-safe manner.
- Ant Design: comprehensive UI library with pre-designed components to ensure a consistent UI interface.
- Recharts: supports features like hover effects, tooltips, easy to integrate into a React-based website due to declarative syntax.




