# EasyBuild3D

A professional web-based 3D construction design tool inspired by Blender but simplified for renovation professionals. Built with React, Three.js, and modern web technologies.

## Features

- Professional-grade 3D viewport with multiple view modes
- Intuitive tools for construction design
- Real-time rendering with shadows and lighting
- Material system for realistic visualization
- Responsive and modern UI
- Built-in measurement tools
- Quick-access construction elements

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/easybuild3d.git
cd easybuild3d
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Controls

- Left Click: Select objects
- Right Click: Context menu
- Middle Mouse: Orbit camera
- Shift + Middle Mouse: Pan camera
- Mouse Wheel: Zoom
- G: Move selected object
- R: Rotate selected object
- S: Scale selected object
- X/Y/Z: Constrain to axis

## Technologies Used

- React 18
- Three.js
- React Three Fiber
- React Three Drei
- TypeScript
- Tailwind CSS
- React Icons

## Project Structure

```
src/
  ├── components/
  │   ├── viewport/     # 3D viewport components
  │   ├── ui/           # UI components
  │   ├── controls/     # Control components
  │   ├── objects/      # 3D object components
  │   └── panels/       # Side panel components
  ├── hooks/            # Custom React hooks
  ├── utils/            # Utility functions
  └── types/            # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Blender's user interface
- Built with modern web technologies
- Designed for construction professionals
