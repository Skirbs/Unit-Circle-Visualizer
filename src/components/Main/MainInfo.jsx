export default function MainInfo({rad, deg, xCoords, yCoords}) {
  return (
    <div className="flex flex-col items-center p-2 rounded-lg bg-neutral-600 drop-shadow-lg">
      <h2 className="mb-1 text-2xl font-bold text-center border-b-2 border-neutral-700">Information</h2>
      <ul className="grid w-full grid-cols-1 gap-2 mx-2 sm:grid-cols-2">
        <li className="p-2 text-center rounded-md bg-neutral-700">Degrees: {deg}°</li>
        <li className="p-2 text-center rounded-md bg-neutral-700">Radians: {rad}</li>
        <li className="p-2 text-center rounded-md bg-neutral-700">X: {xCoords}</li>
        <li className="p-2 text-center rounded-md bg-neutral-700">Y: {yCoords}</li>
      </ul>
    </div>
  );
}
