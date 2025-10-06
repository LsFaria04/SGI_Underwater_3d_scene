# SGI 2025/2026 - PW1

## Group T03G01
| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Lucas Faria      | 202207540 | up202207540@up.pt  |
| Alexandre Lopes  | 202207015 | up202207015@up.pt  |
| Pedro Borges     | 202207552 | up202207552@up.pt  |

----
## Project information

The objective of this project was to design and implement a 3D scene using THREE.js, utilizing the key concepts learned in class. The scene integrates various types of geometries, materials, textures, and lighting techniques, along with appropriate transformations to create a visually engaging and technically complete 3D environment.

- Main Highlights
  - Implementation of multiple geometry types (Box, Sphere, Cone, Cylinder, Torus, Plane).
  - Use of diverse materials and textures.
  - Use of diverse types of lighting sources (Point Light, Ambient Light, Directional Light and Spot Light).
  - Transformations such as translation, rotation and scaling applied to the objects.
  - Organized and modular scene structure for readability and extensibility.
- Scene
  - The scene depicts a small 3D study room featuring a textured wooden floor and walls. It includes several geometric objects with distinct materials, such as a room door, pencil holder, bookshelf, diamond, globe, lamp, and pencils. Different lighting types were used to enhance realism: a directional light simulates sunlight entering through the window, spotlights illuminate the paintings, a point light represents the lamp’s glow and exit sign light, and ambient lighting provides the general illumination of the room.
  - [Scene link](/pw1/MyContents.js)
----
## Issues/Problems

- One of the main issues we encountered was with the directional light. It did not behave as expected due to the lack of shadow rendering, which caused the entire room to appear uniformly bright instead of having realistic light and shadow contrast.