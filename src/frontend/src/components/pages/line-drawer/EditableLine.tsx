import React from "react";
import { Line, Circle, Group, Text, Rect } from "react-konva";
import { DataTypes } from "../../../types";

export const EditableLine: React.FC<{
  line: DataTypes.Line;
  onDragPoint;
  onDragLine;
}> = ({
  line: {
    id,
    points: [x1, y1, x2, y2],
  },
  onDragPoint,
  onDragLine,
}) => {
  return (
    <Group key={id}>
      <Line
        points={[0, 0, x2 - x1, y2 - y1]}
        stroke="red"
        strokeWidth={3}
        x={x1}
        y={y1}
        draggable
        onDragMove={(e) => onDragLine(id, e.target.x(), e.target.y())}
      />
      <Circle
        x={x1}
        y={y1}
        radius={6}
        fill="darkred"
        draggable
        onDragMove={(e) =>
          onDragPoint(id, "point1", e.target.x(), e.target.y())
        }
      />
      <Circle
        x={x2}
        y={y2}
        radius={6}
        fill="darkred"
        draggable
        onDragMove={(e) =>
          onDragPoint(id, "point2", e.target.x(), e.target.y())
        }
      />
      <Text
        x={x2}
        y={y2}
        fontSize={24}
        fill="white"
        stroke="black"
        fillAfterStrokeEnabled
        strokeWidth={1}
        text={id}
        st
      />
    </Group>
  );
};
