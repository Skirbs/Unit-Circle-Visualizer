import {useCallback, useState} from "react";
import {useRef} from "react";

import MainCanvas from "./MainCanvas";
import MainInfo from "./MainInfo";
import ControlPanel from "./ControlPanel";

export default function Main() {
  // Information of the circle
  const [deg, setDeg] = useState(0);
  const [rad, setRad] = useState(0);
  const [xCoords, setXCoords] = useState(1);
  const [yCoords, setYCoords] = useState(0);

  // New values from ControlPanel Component
  // These are used to manually change canvas values
  const [canvasNewData, setCanvasNewData] = useState({
    radians: undefined,
    x: undefined,
    y: undefined,
    isNegative: false,
  });

  const setInfo = useCallback((newRad, newDeg, newXCoords, newYCoords) => {
    // This function executes when something in the canvas changed
    setRad(newRad);
    setDeg(newDeg);

    setXCoords(newXCoords);
    setYCoords(newYCoords);
  }, []);

  function controlSubmitHandler(type, value) {
    // This changes the values from manually inputted data to canvas

    const canvasData = {
      radians: undefined,
      x: undefined,
      y: undefined,
      isNegative: !canvasNewData.isNegative,
    };

    switch (type) {
      case "Degrees":
        canvasData.radians = (Math.PI / 180) * -value;
        break;
      case "Radians":
        canvasData.radians = parseFloat(value);
        break;
      case "X-Component":
        canvasData.x = parseFloat(value);
        canvasData.y = Math.sqrt(1 - value ** 2) * (canvasData.isNegative && Math.abs(value) < 1 ? -1 : 1);
        break;
      case "Y-Component":
        canvasData.y = -parseFloat(value);
        canvasData.x = Math.sqrt(1 - value ** 2) * (canvasData.isNegative && Math.abs(value) < 1 ? -1 : 1);
        break;
      default:
        console.warn('"Control Type" does not exist');
        break;
    }

    setCanvasNewData(canvasData);
  }

  return (
    <main className="flex flex-col items-center pt-5 ">
      <div className="flex flex-col w-[275px] sm:w-auto gap-2 p-4 rounded-md bg-neutral-700 drop-shadow-lg">
        <MainCanvas setInfo={setInfo} newData={canvasNewData} />
        <MainInfo rad={rad} deg={deg} xCoords={xCoords} yCoords={yCoords} />
        <ControlPanel onControlSubmit={controlSubmitHandler} />
      </div>
    </main>
  );
}
