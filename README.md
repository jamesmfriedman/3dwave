3D Wave
-------
Wave Component
Makes a 3d wave with a transparent background that conforms to the size of its container
Props
- color: a hex value for a number 0xffffff
- separation: how far apart the orbs are. Cannot be reset during components life.
- amountX: how many orbs on the X axis
- amountY: how many orbs on the Y axis
- speed: how fast the wave is pulsing
- height: how tall the waves are
- scale: a scaling factor for the orbs as they pulse

Dependencies
- ThreeJS `npm install three`

Usage
```javascript
const MyComponent = props => {
  return (
    <Wave />
  )
}
```