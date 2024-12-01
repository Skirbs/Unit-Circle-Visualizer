import {useRef, useState} from "react";

export default function ControlPanel({onControlSubmit}) {
  const [errorMsg, setErrorMsg] = useState(null);
  const controlTypeRef = useRef(); // Whether the control value sent is degrees, radians, etc.
  const controlValueRef = useRef();

  function controlSubmitHandler() {
    const controlType = controlTypeRef.current.value;
    const controlValue = controlValueRef.current.value;

    if (isNaN(parseFloat(controlValue))) {
      setErrorMsg("Must be number");
      return;
    }

    if (controlType === "X-Component" || controlType === "Y-Component") {
      if (Math.abs(controlValue) > 1) {
        setErrorMsg("Value Must range from -1 to 1");
        return;
      }
    }
    setErrorMsg(null);

    onControlSubmit(controlType, controlValue);
  }
  return (
    <div className="flex flex-col items-center gap-2 p-2 rounded-lg bg-neutral-600 drop-shadow-lg">
      <h2 className="mb-1 text-2xl font-bold text-center border-b-2 border-neutral-700">Control Values</h2>
      <div className="flex flex-col w-full gap-2 p-2 rounded sm:flex-row bg-neutral-700">
        <select
          ref={controlTypeRef}
          onChange={() => {
            controlValueRef.current.value = null;
          }}
          className="bg-neutral-600">
          <option value="Degrees">Degrees</option>
          <option value="Radians">Radians</option>
          <option value="X-Component">X-Component</option>
          <option value="Y-Component">Y-Component</option>
        </select>
        <input ref={controlValueRef} className="flex-1 border-b-2 outline-none bg-neutral-700 border-neutral-600" type="number" />
      </div>
      <p>{errorMsg}</p>
      <button
        onClick={controlSubmitHandler}
        className="w-full py-1 text-xl font-bold transition-all rounded-md bg-neutral-700 hover:opacity-90 hover:scale-95 active:opactiy-80 active:scale-90">
        Set
      </button>
    </div>
  );
}
