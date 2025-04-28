import "./index.css";
import { endOfDay, startOfDay } from "date-fns";
import type { DragEndEvent, DragMoveEvent, Range, ResizeEndEvent, Span, ItemDefinition } from "dnd-timeline";
import { TimelineContext } from "dnd-timeline";
import { nanoid } from "nanoid";
import { useCallback, useState, useRef } from "react";
import Timeline from "./Timeline";
import { generateItems, generateRows } from "./utils";
import type { ExtendedItemDefinition } from "./types";

const DEFAULT_RANGE: Range = {
	start: startOfDay(new Date()).getTime(),
	end: endOfDay(new Date()).getTime(),
};

// Helper function to check if two spans overlap
const doSpansOverlap = (span1: Span, span2: Span) => {
	return span1.start < span2.end && span2.start < span1.end;
};

// Helper function to find overlapping items in a specific row
const findOverlappingItems = (items: any[], targetItem: any, rowId?: string) => {
	return items.filter(
		(item) =>
			item.id !== targetItem.id &&
			item.rowId === (rowId || targetItem.rowId) &&
			doSpansOverlap(item.span, targetItem.span)
	);
};

// Helper function to calculate overlap size and direction
const calculateOverlap = (span1: Span, span2: Span) => {
	const overlapStart = Math.max(span1.start, span2.start);
	const overlapEnd = Math.min(span1.end, span2.end);
	const overlapSize = overlapEnd - overlapStart;
	
	// Determine which item is on the left/right
	const isSpan1Left = span1.start < span2.start;
	
	return {
		size: overlapSize,
		isLeft: isSpan1Left
	};
};

// Helper function to check if an item would be moved out of bounds
const wouldMoveOutOfBounds = (item: any, range: Range) => {
	return item.span.start < range.start || item.span.end > range.end;
};

// Helper function to calculate preview positions with recursive overlap handling
const calculatePreviewPositions = (items: any[], draggedItem: any, range: Range, targetRowId?: string, dragOffset?: number) => {
	const previewPositions = new Map();
	const processedItems = new Set<string>();

	const processItem = (item: any, isDraggedItem: boolean = false) => {
		if (processedItems.has(item.id)) return;

		processedItems.add(item.id);
		const overlappingItems = findOverlappingItems(items, item, targetRowId);

		overlappingItems.forEach(overlappingItem => {
			if (processedItems.has(overlappingItem.id)) return;

			const overlap = calculateOverlap(item.span, overlappingItem.span);
			const newStart = overlappingItem.span.start + (overlap.isLeft ? overlap.size : -overlap.size);
			const newEnd = overlappingItem.span.end + (overlap.isLeft ? overlap.size : -overlap.size);

			// If the move would take the item out of bounds, keep original position
			if (newStart < range.start || newEnd > range.end) {
				previewPositions.set(overlappingItem.id, overlappingItem.span);
			} else {
				const newSpan = { start: newStart, end: newEnd };
				previewPositions.set(overlappingItem.id, newSpan);
				
				// Recursively process the moved item
				processItem({ ...overlappingItem, span: newSpan });
			}
		});

		// For the dragged item, use its new position with offset
		if (isDraggedItem) {
			const adjustedSpan = {
				start: item.span.start + (dragOffset || 0),
				end: item.span.end + (dragOffset || 0)
			};
			previewPositions.set(item.id, adjustedSpan);
		}
	};

	// Start processing with the dragged item
	processItem(draggedItem, true);

	return previewPositions;
};

// Remove TimelineItem interface
// interface TimelineItem {
//     id: string;
//     rowId: string;
//     subrowLevel: number;
//     span: Span;
// }

function App() {
	const [range, setRange] = useState(DEFAULT_RANGE);
	const [rows] = useState(generateRows(5));
	const [items, setItems] = useState<ExtendedItemDefinition[]>(generateItems(10, range, rows));
	const [previewPositions, setPreviewPositions] = useState<Map<string, Span>>(new Map());
	const dragStartPosition = useRef<{ cursor: number; span: Span } | null>(null);

	const onDragMove = useCallback((event: DragMoveEvent) => {
		const activeItemId = event.active.id;
		const activeItem = items.find((item) => item.id === activeItemId);
		if (!activeItem) return;

		const updatedSpan = event.active.data.current.getSpanFromDragEvent?.(event);
		if (!updatedSpan || !dragStartPosition.current) return;

		const targetRowId = event.over?.id as string;

		// Initialize preview positions map
		const previewPositions = new Map();

		// If dragging to the beginning of a row, find the first item in that row
		if (targetRowId && updatedSpan.start <= range.start) {
			const firstItemInRow = items
				.filter(item => item.rowId === targetRowId)
				.reduce((first, current) => {
					if (!first) return current;
					return current.span.start < first.span.start ? current : first;
				}, null as any);

			if (firstItemInRow && firstItemInRow.id !== activeItemId) {
				// Move the first item to make space for the dragged item
				const newFirstItemSpan = {
					start: updatedSpan.end,
					end: firstItemInRow.span.end + (updatedSpan.end - firstItemInRow.span.start)
				};
				previewPositions.set(firstItemInRow.id, newFirstItemSpan);
			}
		}

		// Calculate preview positions for other items
		const remainingPreviewPositions = calculatePreviewPositions(
			items.filter(item => item.id !== activeItemId),
			{ ...activeItem, span: updatedSpan },
			range,
			targetRowId,
			0
		);

		// Merge the preview positions
		remainingPreviewPositions.forEach((span, id) => {
			previewPositions.set(id, span);
		});

		// Keep the dragged item's original position
		previewPositions.set(activeItemId, activeItem.span);

		setPreviewPositions(previewPositions);
	}, [items, range]);

	const onDragStart = useCallback((event: any) => {
		const activeItemId = event.active.id;
		const activeItem = items.find((item) => item.id === activeItemId);
		if (!activeItem) return;

		// Store the initial cursor position and item span
		const initialSpan = event.active.data.current.getSpanFromDragEvent?.(event);
		const cursorX = (event.activatorEvent as PointerEvent).clientX;
		
		if (initialSpan) {
			dragStartPosition.current = {
				cursor: cursorX,
				span: initialSpan
			};
		}
	}, [items]);

	const onResizeEnd = useCallback((event: ResizeEndEvent) => {
		const updatedSpan = event.active.data.current.getSpanFromResizeEvent?.(event);
		if (!updatedSpan) return;

		const activeItemId = event.active.id;
		const activeItem = items.find((item) => item.id === activeItemId);
		if (!activeItem) return;

		// Find overlapping items
		const overlappingItems = findOverlappingItems(items, {
			...activeItem,
			span: updatedSpan,
		});

		if (overlappingItems.length > 0) {
			const newItems = [...items];
			const processedItems = new Set<string>();

			const processItem = (item: any) => {
				if (processedItems.has(item.id)) return;
				processedItems.add(item.id);

				const overlappingItems = findOverlappingItems(newItems, item);
				overlappingItems.forEach(overlappingItem => {
					if (processedItems.has(overlappingItem.id)) return;

					const overlap = calculateOverlap(item.span, overlappingItem.span);
					const newStart = overlappingItem.span.start + (overlap.isLeft ? overlap.size : -overlap.size);
					const newEnd = overlappingItem.span.end + (overlap.isLeft ? overlap.size : -overlap.size);

					// If the move would take the item out of bounds, keep original position
					if (newStart < range.start || newEnd > range.end) {
						return;
					}

					// Update the item's position
					const itemIndex = newItems.findIndex(i => i.id === overlappingItem.id);
					if (itemIndex !== -1) {
						newItems[itemIndex] = {
							...overlappingItem,
							span: { start: newStart, end: newEnd }
						};
					}

					// Recursively process the moved item
					processItem(newItems[itemIndex]);
				});
			};

			// Start processing with the resized item
			const resizedItemIndex = newItems.findIndex(item => item.id === activeItemId);
			if (resizedItemIndex !== -1) {
				newItems[resizedItemIndex] = {
					...activeItem,
					span: updatedSpan
				};
				processItem(newItems[resizedItemIndex]);
			}

			setItems(newItems);
		} else {
			setItems((prev) =>
				prev.map((item) => {
					if (item.id !== activeItemId) return item;
					return {
						...item,
						span: updatedSpan,
					};
				})
			);
		}
	}, [items, range]);

	const onDragEnd = useCallback((event: DragEndEvent) => {
		const activeRowId = event.over?.id as string;
		const updatedSpan = event.active.data.current.getSpanFromDragEvent?.(event);

		if (!updatedSpan || !activeRowId) return;

		const activeItemId = event.active.id;
		const activeItem = items.find((item) => item.id === activeItemId);
		if (!activeItem) return;

		// Get all items in the target row
		const targetRowItems = items.filter(item => item.rowId === activeRowId);

		// Find overlapping items in the target row
		const overlappingItems = findOverlappingItems(targetRowItems, {
			...activeItem,
			rowId: activeRowId,
			span: updatedSpan,
		}, activeRowId);

		if (overlappingItems.length > 0) {
			const newItems = [...items];
			const processedItems = new Set<string>();
			let canMove = true;

			// Calculate subrow levels for all items in the target row
			const calculateSubrowLevels = (items: ItemDefinition[]) => {
				const sortedItems = [...items].sort((a, b) => a.span.start - b.span.start);
				const subrowLevels = new Map<string, number>();
				
				sortedItems.forEach(item => {
					let level = 0;
					while (true) {
						const itemsInLevel = sortedItems.filter(i => 
							subrowLevels.get(i.id) === level && 
							i.id !== item.id &&
							doSpansOverlap(i.span, item.span)
						);
						if (itemsInLevel.length === 0) break;
						level++;
					}
					subrowLevels.set(item.id, level);
				});
				
				return subrowLevels;
			};

			const processItem = (item: any) => {
				if (processedItems.has(item.id)) return;
				processedItems.add(item.id);

				const overlappingItems = findOverlappingItems(newItems, item, activeRowId);
				overlappingItems.forEach(overlappingItem => {
					if (processedItems.has(overlappingItem.id)) return;

					const overlap = calculateOverlap(item.span, overlappingItem.span);
					const newStart = overlappingItem.span.start + (overlap.isLeft ? overlap.size : -overlap.size);
					const newEnd = overlappingItem.span.end + (overlap.isLeft ? overlap.size : -overlap.size);

					if (newStart < range.start || newEnd > range.end) {
						canMove = false;
						return;
					}

					const itemIndex = newItems.findIndex(i => i.id === overlappingItem.id);
					if (itemIndex !== -1) {
						newItems[itemIndex] = {
							...overlappingItem,
							span: { start: newStart, end: newEnd }
						};
						processItem(newItems[itemIndex]);
					}
				});
			};

			// Start processing with the dragged item
			const draggedItemIndex = newItems.findIndex(item => item.id === activeItemId);
			if (draggedItemIndex !== -1) {
				newItems[draggedItemIndex] = {
					...activeItem,
					rowId: activeRowId,
					span: updatedSpan
				};
				processItem(newItems[draggedItemIndex]);
			}

			if (canMove) {
				// Calculate new subrow levels for all items in the target row
				const subrowLevels = calculateSubrowLevels(newItems.filter(item => item.rowId === activeRowId));
				
				// Update items with their new subrow levels
				setItems(newItems.map(item => {
					if (item.rowId === activeRowId) {
						return {
							...item,
							subrowLevel: subrowLevels.get(item.id) || 0
						};
					}
					return item;
				}));
			} else {
				setItems((prev) =>
					prev.map((item) => {
						if (item.id !== activeItemId) return item;
						return {
							...item,
							span: activeItem.span,
						};
					})
				);
			}
		} else {
			// If there are no overlaps, simply update the item's position
			setItems((prev) =>
				prev.map((item) => {
					if (item.id !== activeItemId) return item;
					return {
						...item,
						rowId: activeRowId,
						span: updatedSpan,
						subrowLevel: 0  // Default to subrow 0 if no overlaps
					};
				})
			);
		}

		setPreviewPositions(new Map());
		dragStartPosition.current = null;
	}, [items, range]);

	const onCreateItem = useCallback((span: Span, rowId: string) => {
		setItems((prev) => [...prev, { id: `item-${nanoid(4)}`, rowId, span }]);
	}, []);

	return (
		<TimelineContext
			range={range}
			onDragEnd={onDragEnd}
			onDragMove={onDragMove}
			onDragStart={onDragStart}
			onResizeEnd={onResizeEnd}
			onRangeChanged={setRange}
		>
			<Timeline 
				items={items} 
				rows={rows} 
				onCreateItem={onCreateItem}
				previewPositions={previewPositions}
			/>
		</TimelineContext>
	);
}

export default App;
