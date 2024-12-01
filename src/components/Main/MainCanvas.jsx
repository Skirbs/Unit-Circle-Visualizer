import {memo, useRef, useEffect} from "react";
import utils from "../../utils/utils";
const MainCanvas = memo(({setInfo, newData}) => {
  const canvasRef = useRef();

  function removeNewData() {
    // Reset newData to undefined
    // Note: This wont rerender this component
    newData = {
      radians: undefined,
      x: undefined,
      y: undefined,
    };
  }

  // These variables get set after component renders
  // let angle;
  // let point;
  // let coordinateText;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let canvasWidth = window.innerWidth / 2;
    let canvasHeight = window.innerHeight / 2;

    // in Radians
    let angle = newData.radians % (Math.PI * 2) || 0;
    let radius = canvasHeight / 3;

    let canvasWidthMidpoint = canvasWidth / 2;
    let canvasHeightMidpoint = canvasHeight / 2;

    let isDragging = false;
    let mousePos = {
      x: undefined,
      y: undefined,
    };

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    class Point {
      // The point where it intersects the circle
      // based on the angle given
      constructor() {
        // Note: "x" and "y" values might change such as
        //      dragging in canvas or manually setting it
        //      in the control values
        this.x = canvasWidthMidpoint + radius;
        this.y = canvasHeightMidpoint;

        this.radius = 4;
      }

      draw() {
        // Draws a small circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // Draws the line from center to the point
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(canvasWidthMidpoint, canvasHeightMidpoint);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        ctx.closePath();
      }

      update() {
        this.draw();
      }
    }

    class CoordinateText {
      constructor(x, y) {
        if (canvasWidth < 300) {
          this.x = canvasWidthMidpoint;
          this.y = canvasHeightMidpoint;
        } else {
          this.x = x;
          this.y = y;
        }

        this.xText = 1;
        this.yText = 0;

        // If it was rounded by "this.setText()"
        this.isRounded = true;
      }

      draw() {
        ctx.font = "20px Roboto";
        ctx.textAlign = "center";
        ctx.fillText(`(${this.xText},${this.yText})`, this.x, this.y);
      }

      update() {
        this.draw();
      }

      setPosition(x, y) {
        // this method "adjust" to the right position
        let offsetX = 22;
        let offsetY = 22;
        if (mousePos.x < canvasWidthMidpoint) {
          offsetX *= -1;
        }
        if (mousePos.y < canvasHeightMidpoint) {
          offsetY *= -1;
        }

        this.x = x + offsetX;
        this.y = y + offsetY;
      }

      setText(x, y) {
        // Set text to "({x},{y})" with the correct formatting
        this.xText = Math.round(x * 1000) / 1000;
        this.yText = Math.round(y * 1000) / 1000;

        // These ensure that extremely low values results to 0
        if (Math.abs(this.xText) < 0.025) {
          this.isRounded = true;
          this.xText = 0;
        } else if (Math.abs(this.yText) < 0.025) {
          this.isRounded = true;
          this.yText = 0;
        } else {
          this.isRounded = false;
        }
      }
    }

    class AngleIndicator {
      constructor() {
        this.angle = 0; // * IN RADIANS
        this.radius = 10;
      }

      draw() {
        // Draws a small circle
        ctx.beginPath();
        ctx.arc(canvasWidthMidpoint, canvasHeightMidpoint, this.radius, 0, this.angle, true);

        ctx.stroke();
        ctx.closePath();
      }

      update() {
        this.draw();
      }
    }

    const point = new Point();
    const coordinateText = new CoordinateText(point.x + 22, point.y + 22);

    const angleIndicator = new AngleIndicator();

    function changeValue() {
      // Set Point Coords + Radius
      if (newData.x != undefined) {
        // If "X" / "Y" was manually set in ControlPanel
        // Note: If "X" was set, "Y" will be automatically calculated and vice versa

        point.x = canvasWidthMidpoint + newData.x * radius;
        point.y = canvasHeightMidpoint + newData.y * radius;

        coordinateText.setText(newData.x, -newData.y);

        if (newData.x >= 0) {
          angle = Math.atan(newData.y / newData.x);
        } else {
          angle = Math.atan(newData.y / newData.x) + Math.PI;
        }

        removeNewData();
      } else {
        point.x = canvasWidthMidpoint + Math.cos(angle) * radius;
        point.y = canvasHeightMidpoint + Math.sin(angle) * radius;

        coordinateText.setText(Math.cos(angle), -Math.sin(angle));
      }

      point.radius = 6;
      // Change Coords Text In Canvas
      if (canvasWidth < 300) {
        coordinateText.setPosition(canvasWidthMidpoint, canvasHeightMidpoint);
      } else {
        coordinateText.setPosition(point.x, point.y);
      }
      // Formats Radians to the CORRECT + rounded amount
      // Correct as in not by "browser standards" but on real math standards instead
      let formattedRadians = angle < 0 ? -Math.round(angle * 100) / 100 : Math.round((Math.PI * 2 - angle) * 100) / 100;
      // Change the angle given
      angleIndicator.angle = angle;

      let formattedDegrees = Math.round((180 / Math.PI) * (angle < 0 ? -angle : Math.PI * 2 - angle) * 100) / 100;

      if (coordinateText.isRounded) {
        if ((formattedDegrees > 0 && formattedDegrees < 90) || (formattedDegrees > 270 && formattedDegrees <= 360)) {
          // This is placed because of a bug where the angle is glitched when on the east side.
          formattedDegrees = 0;
          formattedRadians = 0;
        } else {
          formattedRadians = Math.round(utils.getClosestN(formattedRadians, [0, Math.PI / 2, Math.PI, (Math.PI / 2) * 3, 2 * Math.PI]) * 100) / 100;
          formattedDegrees = Math.round(utils.getClosestN(formattedDegrees, [0, 90, 180, 270, 360]) * 100) / 100;
        }
      }

      setInfo(formattedRadians, formattedDegrees, coordinateText.xText, coordinateText.yText);
    }

    canvas.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();

      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      // Get Mouse Position Relative To Canvas
      (mousePos.x = (event.clientX - rect.left) * scaleX), (mousePos.y = (event.clientY - rect.top) * scaleY);

      if (utils.getDistance(mousePos.x, mousePos.y, point.x, point.y) > 20 && !isDragging) {
        // If mouse too far
        canvas.style.cursor = "auto"; // set cursor to default
        point.radius = 4; // resets point to normal size
        return;
      }
      canvas.style.cursor = "pointer";
      point.radius = 5;

      if (!isDragging) return;
      // IN RADIANS
      angle = Math.atan((canvasHeightMidpoint - mousePos.y) / (canvasWidthMidpoint - mousePos.x));
      if (mousePos.x <= canvasWidthMidpoint) {
        // If mouseX is on the left side of the circle
        angle += Math.PI;
      }

      changeValue();
    });

    // "isDragging" event listeners
    canvas.addEventListener("mousedown", () => {
      if (utils.getDistance(mousePos.x, mousePos.y, point.x, point.y) > 20) return;

      isDragging = true;
    });
    canvas.addEventListener("mouseup", () => {
      isDragging = false;
      point.radius = 4;
    });
    canvas.addEventListener("mouseout", () => {
      isDragging = false;
      point.radius = 4;
    });

    window.addEventListener("resize", () => {
      // Update canvas when resizing window
      canvasWidth = window.innerWidth / 2;
      canvasHeight = window.innerHeight / 2;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      radius = canvasHeight / 3;

      canvasWidthMidpoint = canvasWidth / 2;
      canvasHeightMidpoint = canvasHeight / 2;

      point.x = canvasWidthMidpoint + Math.cos(angle) * radius;
      point.y = canvasHeightMidpoint + Math.sin(angle) * radius;

      if (canvasWidth < 300) {
        coordinateText.setPosition(canvasWidthMidpoint, canvasHeightMidpoint);
      } else {
        coordinateText.setPosition(point.x, point.y);
      }
    });

    function drawDefault() {
      // Draws circle
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#000000";
      ctx.arc(canvasWidthMidpoint, canvasHeightMidpoint, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draws x and y axis
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#00000099";

      // x axis
      ctx.beginPath();
      ctx.moveTo(canvasWidthMidpoint - radius - 20, canvasHeightMidpoint);
      ctx.lineTo(canvasWidthMidpoint + radius + 20, canvasHeightMidpoint);
      ctx.stroke();

      // y axis
      ctx.beginPath();
      ctx.moveTo(canvasWidthMidpoint, canvasHeightMidpoint - radius - 20);
      ctx.lineTo(canvasWidthMidpoint, canvasHeightMidpoint + radius + 20);
      ctx.stroke();

      // "sin" indicator
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(point.x, canvasHeightMidpoint);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      ctx.closePath();

      // "cos" indicator
      ctx.beginPath();
      ctx.moveTo(canvasWidthMidpoint, point.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      ctx.closePath();

      ctx.setLineDash([]);
    }

    function animate() {
      // Runs this function every frame.
      requestAnimationFrame(animate);

      // Refresh Canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Draws Unit Circle + Axes
      drawDefault();

      // Draws all of the necessary components
      point.update();
      coordinateText.update();
      angleIndicator.update();
    }

    animate();
    changeValue();
  }, [newData]);
  return <canvas className="border-2 rounded-md bg-neutral-300 border-neutral-800 " ref={canvasRef} />;
});
export default MainCanvas;
