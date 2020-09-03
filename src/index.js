const dscc = require('@google/dscc');
const viz = require('@google/dscc-scripts/viz/initialViz.js');
const local = require('./localMessage.js');

export const LOCAL = true;

class External {

  constructor() {}

  get width() {
    return dscc.getWidth();
  }

  get height() {
    const externalWidth = this.width;
    const externalHeight = (externalWidth / 2) + 10;

    return externalHeight;
  }

   get radius() {
    const externalHeight = this.height;
    const externalRadius = externalHeight + 10;

    return externalRadius;
  }

}

class Internal {

  constructor(external) {
    this.external = external;
  }

  get width() {
    return (this.external.width - (this.external.width * (10 / 100)));
  }

  get height() {
    const internalWidth = this.width;
    const internalHeight = (internalWidth / 2) + 10;

    return internalHeight;
  }

   get radius() {
    const externalHeight = this.height;
    const externalRadius = externalHeight + 10;

    return externalRadius;
  }

  get top() {
    const marginLeft = this.width * (6/100);
    return marginLeft;
  }

  get left() {
    const marginLeft = this.width * (5.5/100);
    return marginLeft;
  }

}

class Pointer {

  constructor(internal, currentValue, maxValue, minValue) {
    this.internal = internal;
    this.currentValue = currentValue;
    this.maxValue = maxValue;
    this.minValue = minValue;
  }

  get rotation() {
    this.currentValue = ((this.currentValue > this.maxValue) ? this.maxValue : this.currentValue);
    this.currentValue = ((this.currentValue < this.minValue) ? this.minValue : this.currentValue);
    const center = ((Math.abs(this.maxValue) + Math.abs(this.minValue)) / 2);
    const relation = ((this.maxValue - this.minValue) / this.maxValue);
    const maxDegrees = (180 / relation);
    const firstFactor = ((this.currentValue * maxDegrees) / (this.maxValue));
    const SecondFactor = ((this.minValue * maxDegrees) / (center));
    const degree = (firstFactor - SecondFactor);

    return degree;
  }

  get width() {
    const pointerWidth = (this.currentValue < (this.maxValue / 2)) ? ((this.internal.width / 2) - (this.internal.width * (3/100))): ((this.internal.width / 2) - (this.internal.width * (3/100)));
    return pointerWidth;
  }

  get height() {
    const pointerHeight = (this.width * (6.25 / 100));
    return pointerHeight;
  }

  get top() {
    const marginTop = (this.currentValue < (this.maxValue /2)) ? (this.width + (this.width * (1/100))) : (this.width + (this.width * (8/100)));
    return marginTop;
  }

  get left() {
    const marginLeft = (this.currentValue < (this.maxValue /2)) ? (this.width * (5/100)) : (this.width * (6/100));
    return marginLeft;
  }

}

class PointerBase {

  constructor(internal) {
    this.internal = internal;
  }

  get radius() {
    return (this.internal.width * (7/100));
  }

  get top() {
    const marginTop = (this.internal.width - (this.internal.width * (55 / 100)));
    return marginTop;
  }

  get left() {
    const marginLeft = (this.internal.width - (this.internal.width * (55 / 100)));
    return marginLeft;
  }

}

const makeExternal = (external) => {
  const externalDiv = document.createElement('div');

  externalDiv.setAttribute("id", "speedometer-external");
  externalDiv.setAttribute("class","half-circle-external");
  externalDiv.setAttribute("style", `width:${external.width}px; height:${external.height}px; border-top-left-radius:${external.radius}px; border-top-right-radius:${external.radius}px;`);

  return externalDiv;
}

const makeInternal = (internal) => {
  const internalDiv = document.createElement('div');

  internalDiv.setAttribute("id", "speedometer-internal");
  internalDiv.setAttribute("class", "half-circle");
  internalDiv.setAttribute("style", `width:${internal.width}px; height:${internal.height}px; border-top-left-radius:${internal.radius}px; border-top-right-radius:${internal.radius}px; margin-left: ${internal.left}px; margin-top: ${internal.top}px`);

  return internalDiv;
}



const makePointer = (pointer) => {
  const pointerDiv = document.createElement('div');

  pointerDiv.setAttribute("id","pointer-div");
  pointerDiv.setAttribute("class","pointer");
  pointerDiv.setAttribute("style", `transform: rotate(${pointer.rotation}deg); width:${pointer.width}px; height:${pointer.height}px; margin-top:${pointer.top}px; margin-left:${pointer.left}px;`);

  return pointerDiv;
}

const makePointerBase = (pointerBase) => {
  const pointerBaseDiv = document.createElement('div');

  pointerBaseDiv.setAttribute("id","pointer-base-id");
  pointerBaseDiv.setAttribute("class", "pointer-base");
  pointerBaseDiv.setAttribute("style", `width: ${pointerBase.radius}px; height:${pointerBase.radius}px; margin-top:${pointerBase.top}px; margin-left:${pointerBase.left}px;`);

  return pointerBaseDiv;
}

const makeStylesheets = () => {
  let style = document.createElement('link');

  style.setAttribute("rel","stylesheet");
  style.setAttribute("type", "text/css");
  style.setAttribute("href","./index.css");

  return style;
}

// write viz code here
const drawViz = (data) => {

  var rowData = data.tables.DEFAULT;

  const maxValue = rowData[0]['maxValue'];
  const minValue = rowData[0]['minValue'];
  const value = rowData[0]['value'];

  const external = new External();
  const internal = new Internal(external);
  const pointer = new Pointer(internal, value, maxValue, minValue);
  const pointerBase = new PointerBase(internal);

  const style = makeStylesheets();
  const externalDiv = makeExternal(external);
  const internalDiv = makeInternal(internal);
  const pointerDiv = makePointer(pointer);
  const pointerBaseDiv = makePointerBase(pointerBase);

  document.body.innerHTML = "";

  internalDiv.appendChild(pointerDiv);
  internalDiv.appendChild(pointerBaseDiv);
  externalDiv.appendChild(internalDiv);

  document.head.appendChild(style);
  document.body.appendChild(externalDiv);

};

// renders locally
if (LOCAL) {
  drawViz(local.message);
} else {
  dscc.subscribeToData(drawViz, {transform: dscc.objectTransform});
}
