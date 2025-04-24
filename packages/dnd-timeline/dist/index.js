"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var src_exports = {};
__export(src_exports, {
  TimelineContext: () => TimelineContext,
  TimelineProvider: () => TimelineProvider,
  groupItemsToRows: () => groupItemsToRows,
  groupItemsToSubrows: () => groupItemsToSubrows,
  useDragStrategy: () => useDragStrategy,
  useItem: () => useItem,
  useRow: () => useRow,
  useTimelineContext: () => useTimelineContext,
  useWheelStrategy: () => useWheelStrategy,
  validateItems: () => validateItems
});
module.exports = __toCommonJS(src_exports);

// src/utils/groupItems.ts
var groupItemsToSubrows = (items, span) => {
  const sortedItems = [...items];
  sortedItems.sort((a, b) => a.span.start > b.span.start ? 1 : -1);
  return sortedItems.reduce((acc, item) => {
    if (span && (item.span.start >= span.end || item.span.end <= span.start))
      return acc;
    if (!acc[item.rowId]) {
      acc[item.rowId] = [[item]];
      return acc;
    }
    for (let index = 0; index < acc[item.rowId].length; index++) {
      const currentSubrow = acc[item.rowId][index];
      const lastItemInSubrow = currentSubrow[currentSubrow.length - 1];
      if (item.span.start >= lastItemInSubrow.span.end) {
        acc[item.rowId][index].push(item);
        return acc;
      }
    }
    acc[item.rowId].push([item]);
    return acc;
  }, {});
};
var groupItemsToRows = (items, span) => {
  return items.reduce((acc, item) => {
    if (span && (item.span.start >= span.end || item.span.end <= span.start))
      return acc;
    if (!acc[item.rowId]) {
      acc[item.rowId] = [item];
    } else {
      acc[item.rowId].push(item);
    }
    return acc;
  }, {});
};

// src/utils/validateItems.ts
var validateItems = (item) => item.span.end > item.span.start;

// src/utils/panStrategies.ts
var import_react = require("react");
var useWheelStrategy = (timelineBag, onPanEnd) => {
  (0, import_react.useLayoutEffect)(() => {
    const element = timelineBag.timelineRef.current;
    if (!element) return;
    const pointerWheelHandler = (event) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const isHorizontal = event.shiftKey;
      const panEndEvent = {
        clientX: event.clientX,
        clientY: event.clientY,
        deltaX: isHorizontal ? event.deltaX || event.deltaY : 0,
        deltaY: isHorizontal ? 0 : event.deltaY
      };
      onPanEnd(panEndEvent);
    };
    element.addEventListener("wheel", pointerWheelHandler, { passive: false });
    return () => {
      element.removeEventListener("wheel", pointerWheelHandler);
    };
  }, [onPanEnd, timelineBag.timelineRef]);
};
var useDragStrategy = (timelineContext2, onPanEnd) => {
  const lastDragX = (0, import_react.useRef)(null);
  (0, import_react.useLayoutEffect)(() => {
    const element = timelineContext2.timelineRef.current;
    if (!element) return;
    const pointerWheelHandler = (event) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const isHorizontal = event.shiftKey;
      const panEndEvent = {
        clientX: event.clientX,
        clientY: event.clientY,
        deltaX: 0,
        deltaY: isHorizontal ? 0 : event.deltaY
      };
      onPanEnd(panEndEvent);
    };
    element.addEventListener("wheel", pointerWheelHandler, { passive: false });
    return () => {
      element.removeEventListener("wheel", pointerWheelHandler);
    };
  }, [onPanEnd, timelineContext2.timelineRef]);
  (0, import_react.useLayoutEffect)(() => {
    const element = timelineContext2.timelineRef.current;
    if (!element) return;
    const pointerdownHandler = (event) => {
      if (!event.ctrlKey && !event.metaKey) return;
      lastDragX.current = event.clientX;
    };
    const pointerupHandler = () => {
      lastDragX.current = null;
    };
    const pointermoveHandler = (event) => {
      if (!lastDragX.current) return;
      const deltaX = event.clientX - lastDragX.current;
      lastDragX.current = event.clientX;
      const panEndEvent = {
        deltaX: -deltaX,
        deltaY: 0
      };
      onPanEnd(panEndEvent);
    };
    element.addEventListener("pointerup", pointerupHandler);
    element.addEventListener("pointerdown", pointerdownHandler);
    element.addEventListener("pointermove", pointermoveHandler);
    element.addEventListener("pointerleave", pointerupHandler);
    return () => {
      element.removeEventListener("pointerup", pointerupHandler);
      element.removeEventListener("pointerdown", pointerdownHandler);
      element.removeEventListener("pointermove", pointermoveHandler);
      element.removeEventListener("pointerleave", pointerupHandler);
    };
  }, [onPanEnd, timelineContext2.timelineRef]);
};

// src/hooks/useRow.tsx
var import_core2 = require("@dnd-kit/core");

// src/hooks/useTimelineContext.tsx
var import_react5 = require("react");

// src/store/Timeline.tsx
var import_core = require("@dnd-kit/core");
var import_react4 = require("react");

// src/hooks/useTimeline.tsx
var import_react3 = require("react");

// src/hooks/useElementRef.tsx
var import_react2 = require("react");
var import_resize_observer_polyfill = __toESM(require("resize-observer-polyfill"));
function useElementRef() {
  const [ref, setRef] = (0, import_react2.useState)({
    current: null
  });
  const [width, setWidth] = (0, import_react2.useState)(0);
  const [direction, setDirection] = (0, import_react2.useState)("ltr");
  const resizeObserver = (0, import_react2.useRef)();
  const onSetRef = (0, import_react2.useCallback)((element) => {
    var _a;
    (_a = resizeObserver.current) == null ? void 0 : _a.disconnect();
    if (element) {
      resizeObserver.current = new import_resize_observer_polyfill.default((entries) => {
        setWidth(entries[0].contentRect.width);
      });
      resizeObserver.current.observe(element);
      setDirection(getComputedStyle(element).direction);
    }
    setRef({ current: element });
  }, []);
  return {
    ref,
    setRef: onSetRef,
    width,
    direction
  };
}

// src/hooks/useTimeline.tsx
var style = {
  display: "flex",
  overflow: "hidden",
  position: "relative",
  flexDirection: "column"
};
var DEFAULT_RESIZE_HANDLE_WIDTH = 20;
function useTimeline({
  range,
  onResizeEnd,
  onResizeMove,
  onResizeStart,
  onRangeChanged,
  overlayed = false,
  rangeGridSizeDefinition,
  usePanStrategy = useWheelStrategy,
  resizeHandleWidth = DEFAULT_RESIZE_HANDLE_WIDTH
}) {
  const rangeStart = range.start;
  const rangeEnd = range.end;
  const {
    ref: timelineRef,
    setRef: setTimelineRef,
    width: timelineWidth,
    direction
  } = useElementRef();
  const {
    ref: sidebarRef,
    setRef: setSidebarRef,
    width: sidebarWidth
  } = useElementRef();
  const timelineViewportWidth = timelineWidth - sidebarWidth;
  const rangeGridSize = (0, import_react3.useMemo)(() => {
    var _a;
    if (Array.isArray(rangeGridSizeDefinition)) {
      const gridSizes = rangeGridSizeDefinition;
      const rangeSize = rangeEnd - rangeStart;
      const sortedRangeGridSizes = [...gridSizes];
      sortedRangeGridSizes.sort((a, b) => a.value - b.value);
      return (_a = sortedRangeGridSizes.find(
        (curr) => !curr.maxRangeSize || rangeSize < curr.maxRangeSize
      )) == null ? void 0 : _a.value;
    }
    return rangeGridSizeDefinition;
  }, [rangeStart, rangeEnd, rangeGridSizeDefinition]);
  const valueToPixelsInternal = (0, import_react3.useCallback)(
    (value2, range2) => {
      const start = range2.start;
      const end = range2.end;
      const valueToPixel = timelineViewportWidth / (end - start);
      return value2 * valueToPixel;
    },
    [timelineViewportWidth]
  );
  const valueToPixels = (0, import_react3.useCallback)(
    (value2, customRange) => valueToPixelsInternal(value2, customRange != null ? customRange : range),
    [valueToPixelsInternal, range]
  );
  const pixelsToValueInternal = (0, import_react3.useCallback)(
    (pixels, range2) => {
      const start = range2.start;
      const end = range2.end;
      const pixelToMs = (end - start) / timelineViewportWidth;
      return pixels * pixelToMs;
    },
    [timelineViewportWidth]
  );
  const pixelsToValue = (0, import_react3.useCallback)(
    (pixels, customRange) => pixelsToValueInternal(pixels, customRange != null ? customRange : range),
    [range, pixelsToValueInternal]
  );
  const getDeltaXFromScreenX = (0, import_react3.useCallback)(
    (screenX) => {
      var _a;
      const side = direction === "rtl" ? "right" : "left";
      const timelineSideX = (((_a = timelineRef.current) == null ? void 0 : _a.getBoundingClientRect()[side]) || 0) + sidebarWidth * (direction === "rtl" ? -1 : 1);
      const deltaX = screenX - timelineSideX;
      return deltaX;
    },
    [timelineRef, sidebarWidth, direction]
  );
  const snapValueToRangeGrid = (0, import_react3.useCallback)(
    (value2) => {
      if (!rangeGridSize) return value2;
      return Math.round(value2 / rangeGridSize) * rangeGridSize;
    },
    [rangeGridSize]
  );
  const getValueFromScreenXInternal = (0, import_react3.useCallback)(
    (screenX, range2) => {
      const deltaX = getDeltaXFromScreenX(screenX);
      const delta = pixelsToValueInternal(deltaX, range2) * (direction === "rtl" ? -1 : 1);
      return snapValueToRangeGrid(range2.start + delta);
    },
    [
      direction,
      pixelsToValueInternal,
      getDeltaXFromScreenX,
      snapValueToRangeGrid
    ]
  );
  const getValueFromScreenX = (0, import_react3.useCallback)(
    (screenX) => getValueFromScreenXInternal(screenX, range),
    [range, getValueFromScreenXInternal]
  );
  const getSpanFromDragEvent = (0, import_react3.useCallback)(
    (event) => {
      var _a, _b, _c;
      const side = direction === "rtl" ? "right" : "left";
      const itemX = ((_a = event.active.rect.current.translated) == null ? void 0 : _a[side]) || 0;
      const start = getValueFromScreenX(itemX);
      if ((_b = event.active.data.current) == null ? void 0 : _b.span) {
        const { start: prevItemStart, end: prevItemEnd } = event.active.data.current.span;
        const itemDuration = prevItemEnd - prevItemStart;
        const end = snapValueToRangeGrid(start + itemDuration);
        return { start, end };
      } else if ((_c = event.active.data.current) == null ? void 0 : _c.duration) {
        const itemDuration = event.active.data.current.duration;
        const end = snapValueToRangeGrid(start + itemDuration);
        return { start, end };
      }
      return null;
    },
    [getValueFromScreenX, snapValueToRangeGrid, direction]
  );
  const getSpanFromResizeEvent = (0, import_react3.useCallback)(
    (event) => {
      var _a;
      if ((_a = event.active.data.current) == null ? void 0 : _a.span) {
        const prevSpan = event.active.data.current.span;
        const delta = pixelsToValue(event.delta.x);
        const updatedRange = __spreadValues({}, prevSpan);
        updatedRange[event.direction] = snapValueToRangeGrid(
          prevSpan[event.direction] + delta
        );
        return updatedRange;
      }
      return null;
    },
    [pixelsToValue, snapValueToRangeGrid]
  );
  const onPanEnd = (0, import_react3.useCallback)(
    (event) => {
      onRangeChanged((prevRange) => {
        const deltaX = pixelsToValueInternal(event.deltaX, prevRange) * (direction === "rtl" ? -1 : 1);
        const deltaY = pixelsToValueInternal(event.deltaY, prevRange) * (direction === "rtl" ? -1 : 1);
        const rangeDuration = prevRange.end - prevRange.start;
        const startBias = event.clientX ? (prevRange.start - getValueFromScreenXInternal(event.clientX, prevRange)) / rangeDuration : 1;
        const endBias = event.clientX ? (getValueFromScreenXInternal(event.clientX, prevRange) - prevRange.end) / rangeDuration : 1;
        const startDelta = deltaY * startBias + deltaX;
        const endDelta = -deltaY * endBias + deltaX;
        return {
          start: prevRange.start + startDelta,
          end: prevRange.end + endDelta
        };
      });
    },
    [
      direction,
      pixelsToValueInternal,
      getValueFromScreenXInternal,
      onRangeChanged
    ]
  );
  const value = (0, import_react3.useMemo)(
    () => ({
      style,
      range,
      overlayed,
      onPanEnd,
      onResizeEnd,
      onResizeMove,
      onResizeStart,
      sidebarRef,
      setSidebarRef,
      sidebarWidth,
      resizeHandleWidth,
      pixelsToValue,
      valueToPixels,
      timelineRef,
      setTimelineRef,
      direction,
      rangeGridSize,
      getValueFromScreenX,
      getDeltaXFromScreenX,
      getSpanFromDragEvent,
      getSpanFromResizeEvent
    }),
    [
      range,
      overlayed,
      onPanEnd,
      onResizeEnd,
      onResizeMove,
      onResizeStart,
      sidebarRef,
      setSidebarRef,
      sidebarWidth,
      resizeHandleWidth,
      pixelsToValue,
      valueToPixels,
      timelineRef,
      setTimelineRef,
      direction,
      rangeGridSize,
      getValueFromScreenX,
      getDeltaXFromScreenX,
      getSpanFromDragEvent,
      getSpanFromResizeEvent
    ]
  );
  usePanStrategy(value, onPanEnd);
  return value;
}

// src/store/Timeline.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var timelineContext = (0, import_react4.createContext)(
  void 0
);
var TimelineProvider = timelineContext.Provider;
function TimelineProviderInner(props) {
  const timeline = useTimeline(props);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimelineProvider, { value: timeline, children: props.children });
}
function TimelineContext(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_core.DndContext, __spreadProps(__spreadValues({}, props), { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimelineProviderInner, __spreadProps(__spreadValues({}, props), { children: props.children })) }));
}

// src/hooks/useTimelineContext.tsx
function useTimelineContext() {
  const contextValue = (0, import_react5.useContext)(timelineContext);
  if (contextValue === void 0) {
    throw new Error(
      "dnd-timeline: useTimelineContext() must be used within a TimelineContext"
    );
  }
  return contextValue;
}

// src/hooks/useRow.tsx
var rowWrapperStyle = {
  display: "inline-flex"
};
var rowStyle = {
  flex: 1,
  display: "flex",
  position: "relative",
  alignItems: "stretch",
  flexDirection: "column"
};
var rowSidebarStyle = {
  left: 0,
  zIndex: 3,
  display: "flex"
};
function useRow(props) {
  const { setSidebarRef } = useTimelineContext();
  const droppableProps = (0, import_core2.useDroppable)({
    id: props.id,
    data: props.data,
    disabled: props.disabled
  });
  return __spreadValues({
    rowStyle,
    rowWrapperStyle,
    rowSidebarStyle,
    setSidebarRef
  }, droppableProps);
}

// src/hooks/useItem.tsx
var import_core3 = require("@dnd-kit/core");
var import_utilities = require("@dnd-kit/utilities");
var import_react6 = require("react");
var getDragDirection = (mouseX, clientRect, direction, resizeHandleWidth) => {
  const startSide = direction === "rtl" ? "right" : "left";
  const endSide = direction === "rtl" ? "left" : "right";
  if (Math.abs(mouseX - clientRect[startSide]) <= resizeHandleWidth / 2) {
    return "start";
  }
  if (Math.abs(mouseX - clientRect[endSide]) <= resizeHandleWidth / 2) {
    return "end";
  }
  return null;
};
function useItem(props) {
  const dataRef = (0, import_react6.useRef)({});
  const dragStartX = (0, import_react6.useRef)();
  const [dragDirection, setDragDirection] = (0, import_react6.useState)();
  const {
    range,
    overlayed,
    onResizeEnd,
    onResizeMove,
    onResizeStart,
    direction,
    resizeHandleWidth,
    valueToPixels,
    getSpanFromDragEvent,
    getSpanFromResizeEvent
  } = useTimelineContext();
  const propsOnResizeEnd = props.onResizeEnd;
  const propsOnResizeStart = props.onResizeStart;
  const propsOnResizeMove = props.onResizeMove;
  const onResizeEndCallback = (0, import_react6.useCallback)(
    (event) => {
      onResizeEnd(event);
      propsOnResizeEnd == null ? void 0 : propsOnResizeEnd(event);
    },
    [onResizeEnd, propsOnResizeEnd]
  );
  const onResizeStartCallback = (0, import_react6.useCallback)(
    (event) => {
      onResizeStart == null ? void 0 : onResizeStart(event);
      propsOnResizeStart == null ? void 0 : propsOnResizeStart(event);
    },
    [onResizeStart, propsOnResizeStart]
  );
  const onResizeMoveCallback = (0, import_react6.useCallback)(
    (event) => {
      onResizeMove == null ? void 0 : onResizeMove(event);
      propsOnResizeMove == null ? void 0 : propsOnResizeMove(event);
    },
    [onResizeMove, propsOnResizeMove]
  );
  dataRef.current = __spreadValues({
    getSpanFromDragEvent,
    getSpanFromResizeEvent,
    span: props.span
  }, props.data || {});
  const draggableProps = (0, import_core3.useDraggable)({
    id: props.id,
    data: dataRef.current,
    disabled: props.disabled
  });
  const deltaXStart = valueToPixels(props.span.start - range.start);
  const deltaXEnd = valueToPixels(range.end - props.span.end);
  const width = valueToPixels(props.span.end - props.span.start);
  const sideStart = direction === "rtl" ? "right" : "left";
  const sideEnd = direction === "rtl" ? "left" : "right";
  const cursor = props.disabled ? "inherit" : draggableProps.isDragging ? "grabbing" : "grab";
  (0, import_react6.useLayoutEffect)(() => {
    if (!dragDirection) return;
    const pointermoveHandler = (event) => {
      if (!dragStartX.current || !draggableProps.node.current) return;
      const dragDeltaX = (event.clientX - dragStartX.current) * (direction === "rtl" ? -1 : 1);
      if (dragDirection === "start") {
        const newSideDelta = deltaXStart + dragDeltaX;
        draggableProps.node.current.style[sideStart] = `${newSideDelta}px`;
        const newWidth = width + deltaXStart - newSideDelta;
        draggableProps.node.current.style.width = `${newWidth}px`;
      } else {
        const otherSideDelta = deltaXStart + width + dragDeltaX;
        const newWidth = otherSideDelta - deltaXStart;
        draggableProps.node.current.style.width = `${newWidth}px`;
      }
      onResizeMoveCallback({
        activatorEvent: event,
        delta: {
          x: dragDeltaX
        },
        direction: dragDirection,
        active: {
          id: props.id,
          data: dataRef
        }
      });
    };
    window.addEventListener("pointermove", pointermoveHandler);
    return () => {
      window.removeEventListener("pointermove", pointermoveHandler);
    };
  }, [
    sideStart,
    width,
    deltaXStart,
    props.id,
    dragDirection,
    direction,
    draggableProps.node,
    onResizeMoveCallback
  ]);
  (0, import_react6.useLayoutEffect)(() => {
    if (!dragDirection) return;
    const pointerupHandler = (event) => {
      if (!dragStartX.current || !draggableProps.node.current) return;
      let dragDeltaX = 0;
      if (dragDirection === "start") {
        const currentSideDelta = Number.parseInt(
          draggableProps.node.current.style[sideStart].slice(0, -2)
        );
        dragDeltaX = currentSideDelta - deltaXStart;
      } else {
        const currentWidth = Number.parseInt(
          draggableProps.node.current.style.width.slice(0, -2)
        );
        dragDeltaX = currentWidth - width;
      }
      onResizeEndCallback({
        activatorEvent: event,
        delta: {
          x: dragDeltaX
        },
        direction: dragDirection,
        active: {
          id: props.id,
          data: dataRef
        }
      });
      setDragDirection(null);
      draggableProps.node.current.style.width = `${width}px`;
      draggableProps.node.current.style[sideStart] = `${deltaXStart}px`;
    };
    window.addEventListener("pointerup", pointerupHandler);
    return () => {
      window.removeEventListener("pointerup", pointerupHandler);
    };
  }, [
    sideStart,
    width,
    deltaXStart,
    props.id,
    dragDirection,
    draggableProps.node,
    onResizeEndCallback
  ]);
  const onPointerMove = (0, import_react6.useCallback)(
    (event) => {
      if (!draggableProps.node.current || props.disabled) return;
      const newDragDirection = getDragDirection(
        event.clientX,
        draggableProps.node.current.getBoundingClientRect(),
        direction,
        resizeHandleWidth
      );
      if (newDragDirection) {
        draggableProps.node.current.style.cursor = "col-resize";
      } else {
        draggableProps.node.current.style.cursor = cursor;
      }
    },
    [draggableProps.node, props.disabled, direction, cursor, resizeHandleWidth]
  );
  const onPointerDown = (0, import_react6.useCallback)(
    (event) => {
      var _a;
      if (!draggableProps.node.current || props.disabled) return;
      const newDragDirection = getDragDirection(
        event.clientX,
        draggableProps.node.current.getBoundingClientRect(),
        direction,
        resizeHandleWidth
      );
      if (newDragDirection) {
        setDragDirection(newDragDirection);
        dragStartX.current = event.clientX;
        onResizeStartCallback({
          activatorEvent: event,
          active: {
            id: props.id,
            data: dataRef
          },
          direction: newDragDirection
        });
      } else {
        (_a = draggableProps.listeners) == null ? void 0 : _a.onPointerDown(event);
      }
    },
    [
      props.id,
      props.disabled,
      direction,
      resizeHandleWidth,
      draggableProps.node,
      onResizeStartCallback,
      draggableProps.listeners
    ]
  );
  const paddingStart = direction === "rtl" ? "paddingRight" : "paddingLeft";
  const paddingEnd = direction === "rtl" ? "paddingLeft" : "paddingRight";
  const transform = import_utilities.CSS.Translate.toString(draggableProps.transform);
  const itemStyle = (0, import_react6.useMemo)(
    () => __spreadValues({
      position: "absolute",
      top: 0,
      width,
      [sideStart]: deltaXStart,
      [sideEnd]: deltaXEnd,
      cursor,
      height: "100%",
      touchAction: "none"
    }, !(draggableProps.isDragging && overlayed) && {
      transform
    }),
    [
      width,
      sideStart,
      deltaXStart,
      sideEnd,
      deltaXEnd,
      cursor,
      draggableProps.isDragging,
      overlayed,
      transform
    ]
  );
  const itemContentStyle = (0, import_react6.useMemo)(
    () => ({
      height: "100%",
      display: "flex",
      overflow: "hidden",
      alignItems: "stretch",
      [paddingStart]: Math.max(0, -deltaXStart),
      [paddingEnd]: Math.max(0, -deltaXEnd)
    }),
    [paddingStart, paddingEnd, deltaXStart, deltaXEnd]
  );
  return __spreadProps(__spreadValues({
    itemStyle,
    itemContentStyle
  }, draggableProps), {
    listeners: __spreadProps(__spreadValues({}, draggableProps.listeners), {
      onPointerDown,
      onPointerMove
    })
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TimelineContext,
  TimelineProvider,
  groupItemsToRows,
  groupItemsToSubrows,
  useDragStrategy,
  useItem,
  useRow,
  useTimelineContext,
  useWheelStrategy,
  validateItems
});
//# sourceMappingURL=index.js.map