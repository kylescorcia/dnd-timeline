import * as _dnd_kit_core from '@dnd-kit/core';
import { Active, Data, DragCancelEvent, DndContextProps, DragStartEvent as DragStartEvent$1, DragMoveEvent as DragMoveEvent$1, DragEndEvent as DragEndEvent$1 } from '@dnd-kit/core';
import * as react from 'react';
import { MutableRefObject, CSSProperties, PropsWithChildren, PointerEventHandler } from 'react';
import * as _dnd_kit_utilities from '@dnd-kit/utilities';
import * as react_jsx_runtime from 'react/jsx-runtime';

type DragDirection = "start" | "end";
interface ItemDefinition {
    id: string;
    rowId: string;
    disabled?: boolean;
    span: Span;
}
interface UseItemProps extends Pick<ItemDefinition, "id" | "span" | "disabled"> {
    data?: object;
    onResizeEnd?: (event: ResizeEndEvent) => void;
    onResizeMove?: (event: ResizeMoveEvent) => void;
    onResizeStart?: (event: ResizeStartEvent) => void;
}
interface ItemDataBase extends Data {
    span: Span;
}
interface DragItemData extends ItemDataBase {
    getSpanFromDragEvent?: GetSpanFromDragEvent;
}
interface ResizeItemData extends ItemDataBase {
    getSpanFromResizeEvent?: GetSpanFromResizeEvent;
}
interface ItemData extends DragItemData, ResizeItemData {
}
interface DragActiveItem extends Active {
    data: MutableRefObject<DragItemData>;
}
interface ResizeActiveItem extends Omit<Active, "rect"> {
    data: MutableRefObject<ResizeItemData>;
}

interface RowDefinition {
    id: string;
    disabled?: boolean;
}
interface UseRowProps extends RowDefinition {
    data?: object;
}

interface ResizeMoveEvent {
    activatorEvent: Event;
    active: ResizeActiveItem;
    delta: {
        x: number;
    };
    direction: DragDirection;
}
type ResizeEndEvent = ResizeMoveEvent;
interface ResizeStartEvent {
    activatorEvent: Event;
    active: ResizeActiveItem;
    direction: DragDirection;
}

interface PanEndEvent {
    clientX?: number;
    clientY?: number;
    deltaX: number;
    deltaY: number;
}
type GetSpanFromDragEvent = (event: DragStartEvent | DragEndEvent | DragCancelEvent | DragMoveEvent) => Range | null;
type GetSpanFromResizeEvent = (event: ResizeEndEvent) => Range | null;
type GetValueFromScreenX = (screenX: number) => number;
type GetDeltaXFromScreenX = (screenX: number) => number;
type OnResizeStart = (event: ResizeStartEvent) => void;
type OnResizeEnd = (event: ResizeEndEvent) => void;
type OnResizeMove = (event: ResizeMoveEvent) => void;
type OnPanEnd = (event: PanEndEvent) => void;
type PixelsToValue = (pixels: number, range?: Range) => number;
type ValueToPixels = (value: number, range?: Range) => number;
interface TimelineBag {
    style: CSSProperties;
    range: Range;
    overlayed: boolean;
    onResizeEnd: OnResizeEnd;
    onResizeMove?: OnResizeMove;
    onResizeStart?: OnResizeStart;
    resizeHandleWidth: number;
    rangeGridSize?: number;
    direction: CanvasDirection;
    timelineRef: React.MutableRefObject<HTMLElement | null>;
    setTimelineRef: (element: HTMLElement | null) => void;
    sidebarWidth: number;
    sidebarRef: React.MutableRefObject<HTMLElement | null>;
    setSidebarRef: (element: HTMLElement | null) => void;
    valueToPixels: ValueToPixels;
    pixelsToValue: PixelsToValue;
    getValueFromScreenX: GetValueFromScreenX;
    getDeltaXFromScreenX: GetDeltaXFromScreenX;
    getSpanFromDragEvent: GetSpanFromDragEvent;
    getSpanFromResizeEvent: GetSpanFromResizeEvent;
}
type OnRangeChanged = (updateFunction: (prev: Range) => Range) => void;
interface GridSizeDefinition {
    value: number;
    maxRangeSize?: number;
}
interface UseTimelineProps {
    range: Range;
    overlayed?: boolean;
    onResizeEnd: OnResizeEnd;
    resizeHandleWidth?: number;
    onResizeMove?: OnResizeMove;
    onResizeStart?: OnResizeStart;
    usePanStrategy?: UsePanStrategy;
    onRangeChanged: OnRangeChanged;
    rangeGridSizeDefinition?: number | GridSizeDefinition[];
}
interface TimelineContextProps extends PropsWithChildren, UseTimelineProps, DndContextProps {
}

interface DragStartEvent extends DragStartEvent$1 {
    active: DragActiveItem;
}
interface DragMoveEvent extends DragMoveEvent$1 {
    active: DragActiveItem;
}
interface DragEndEvent extends DragEndEvent$1 {
    active: DragActiveItem;
}

interface Range {
    start: number;
    end: number;
}
interface Span extends Range {
}

declare const groupItemsToSubrows: <T extends ItemDefinition = ItemDefinition>(items: T[], span?: Span) => Record<string, T[][]>;
declare const groupItemsToRows: <T extends ItemDefinition = ItemDefinition>(items: T[], span?: Span) => Record<string, T[]>;

declare const validateItems: (item: ItemDefinition) => boolean;

type UsePanStrategy = (timelineBag: TimelineBag, onPanEnd: OnPanEnd) => void;
declare const useWheelStrategy: UsePanStrategy;
declare const useDragStrategy: UsePanStrategy;

declare function useRow(props: UseRowProps): {
    active: _dnd_kit_core.Active | null;
    rect: react.MutableRefObject<_dnd_kit_core.ClientRect | null>;
    isOver: boolean;
    node: react.MutableRefObject<HTMLElement | null>;
    over: _dnd_kit_core.Over | null;
    setNodeRef: (element: HTMLElement | null) => void;
    rowStyle: CSSProperties;
    rowWrapperStyle: CSSProperties;
    rowSidebarStyle: CSSProperties;
    setSidebarRef: (element: HTMLElement | null) => void;
};

declare function useItem(props: UseItemProps): {
    listeners: {
        onPointerDown: PointerEventHandler;
        onPointerMove: PointerEventHandler;
    };
    active: _dnd_kit_core.Active | null;
    activatorEvent: Event | null;
    activeNodeRect: _dnd_kit_core.ClientRect | null;
    attributes: _dnd_kit_core.DraggableAttributes;
    isDragging: boolean;
    node: react.MutableRefObject<HTMLElement | null>;
    over: _dnd_kit_core.Over | null;
    setNodeRef: (element: HTMLElement | null) => void;
    setActivatorNodeRef: (element: HTMLElement | null) => void;
    transform: _dnd_kit_utilities.Transform | null;
    itemStyle: CSSProperties;
    itemContentStyle: CSSProperties;
};

declare const TimelineProvider: react.Provider<TimelineBag | undefined>;
declare function TimelineContext(props: TimelineContextProps): react_jsx_runtime.JSX.Element;

declare function useTimelineContext(): TimelineBag;

export { type DragActiveItem, type DragDirection, type DragEndEvent, type DragItemData, type DragMoveEvent, type DragStartEvent, type GetDeltaXFromScreenX, type GetSpanFromDragEvent, type GetSpanFromResizeEvent, type GetValueFromScreenX, type GridSizeDefinition, type ItemData, type ItemDefinition, type OnPanEnd, type OnRangeChanged, type OnResizeEnd, type OnResizeMove, type OnResizeStart, type PanEndEvent, type PixelsToValue, type Range, type ResizeActiveItem, type ResizeEndEvent, type ResizeItemData, type ResizeMoveEvent, type ResizeStartEvent, type RowDefinition, type Span, type TimelineBag, TimelineContext, type TimelineContextProps, TimelineProvider, type UseItemProps, type UsePanStrategy, type UseRowProps, type UseTimelineProps, type ValueToPixels, groupItemsToRows, groupItemsToSubrows, useDragStrategy, useItem, useRow, useTimelineContext, useWheelStrategy, validateItems };
