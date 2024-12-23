# EasyBuild3D

A web-based 3D construction design tool inspired by Blender but simplified for renovation professionals. Built with React, Three.js, and TypeScript.

## Features

- **Multi-viewport System**

  - Quad-view layout (Top, Front, Side, Perspective)
  - Synchronized camera positions
  - Viewport maximization
  - Orthographic and perspective views

- **Essential Tools**

  - Selection tools (Vertex, Edge, Face, Object)
  - Transform tools (Move, Rotate, Scale)
  - Basic shapes (Cube, Sphere, Cylinder, Plane, Torus)
  - Grid system with measurements
  - Real-time shadows and lighting

- **Construction-Specific Features**
  - Quick-add construction elements
  - Smart tools for room generation
  - Material system
  - Cost calculation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/easybuild3d.git
   cd easybuild3d
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Keyboard Shortcuts

- **Selection Mode**

  - `1` - Vertex Select
  - `2` - Edge Select
  - `3` - Face Select
  - `4` - Object Select

- **Transform Tools**

  - `G` - Move
  - `R` - Rotate
  - `S` - Scale
  - `B` - Box Select

- **Mesh Editing**

  - `E` - Extrude
  - `I` - Inset Faces
  - `K` - Knife Tool

- **View Controls**
  - Middle Mouse - Orbit
  - Shift + Middle Mouse - Pan
  - Mouse Wheel - Zoom
  - Delete - Delete selected object

## Tech Stack

- React
- Three.js
- React Three Fiber
- React Three Drei
- TypeScript
- Tailwind CSS
- Zustand
- Vite

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by Blender's interface and functionality
- Built with React Three Fiber ecosystem
- Styled with Tailwind CSS
