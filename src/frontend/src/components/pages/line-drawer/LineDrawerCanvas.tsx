import React, { useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";
import { EditableLine } from "./EditableLine";
import { Button, Card, Flex, useDisclosure } from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { FallbackLoader } from "../../FallbackLoader";
import { PopoverForm } from "./PopoverForm";
import {
  selectLines,
  selectVideoState,
  sendLines,
  setLines,
  useAppDispatch,
} from "../../../redux";
import { useNavigate } from "react-router-dom";

const CANVAS_MARGIN = 10;
const CANVAS_SCREEN_AMOUNT = 0.71;

export const LineDrawerCanvas = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { image, loading, result } = selectVideoState();
  const { width, height } = useWindowSize();
  const [canvasSize, setCanvasSize] = useState({ h: 0, w: 0 });
  const dispatch = useAppDispatch();
  const lines = selectLines();
  const navigate = useNavigate();

  if (!image) {
    return <FallbackLoader />;
  }

  const onSubmit = () => {
    if (lines.length > 0) {
      dispatch(
        sendLines(
          lines.map((x) => {
            const scaleX = image.width / canvasSize.w;
            const scaleY = image.height / canvasSize.h;
            return {
              id: x.id,
              points: [
                x.points[0] * scaleX,
                x.points[1] * scaleY,
                x.points[2] * scaleX,
                x.points[3] * scaleY,
              ],
            };
          })
        )
      ); //TODO: convert to image scales
    }
  };

  useEffect(() => {
    if (!loading && result) {
      navigate("/result");
    }
  }, [loading]);

  useEffect(() => {
    const w = window.innerWidth - 2 * CANVAS_MARGIN;
    let newValues = { h: (image.height / image.width) * w, w: w };
    if (newValues.h > window.innerHeight * CANVAS_SCREEN_AMOUNT) {
      const h = window.innerHeight * CANVAS_SCREEN_AMOUNT;
      newValues = { w: (image.width / image.height) * h, h: h };
    }
    setCanvasSize(newValues);
  }, [width, height]);

  const handlePointDrag = (lineId, pointName, x, y) => {
    dispatch(
      setLines(
        lines.map((line) => {
          if (line.id === lineId) {
            const offset = pointName === "point1" ? 0 : 2;
            const temp = structuredClone(line.points);
            temp[offset] = x;
            temp[offset + 1] = y;
            return { id: line.id, points: temp };
          }
          return line;
        })
      )
    );
  };

  const handleLineDrag = (lineId, x, y) => {
    dispatch(
      setLines(
        lines.map((line) => {
          if (line.id === lineId) {
            const temp = structuredClone(line.points);
            temp[0] = x;
            temp[1] = y;
            temp[2] = x + line.points[2] - line.points[0];
            temp[3] = y + line.points[3] - line.points[1];

            return { id: line.id, points: temp };
          }
          return line;
        })
      )
    );
  };

  return (
    <>
      <Flex direction="column" alignItems="center">
        <Card
          margin={`${CANVAS_MARGIN}px`}
          w={canvasSize.w}
          h={canvasSize.h}
          bgRepeat={"no-repeat"}
          bgSize={"contain"}
          bgImage={`data:image;base64,${image.preview}`}
        >
          <Stage width={canvasSize.w} height={canvasSize.h}>
            <Layer>
              {lines.map((line) => (
                <EditableLine
                  line={line}
                  onDragLine={handleLineDrag}
                  onDragPoint={handlePointDrag}
                />
              ))}
            </Layer>
          </Stage>
          <Button
            onClick={onOpen}
            size="xs"
            position="absolute"
            m="5px"
            leftIcon={<AddIcon />}
            isLoading={loading}
            colorScheme="whatsapp"
          >
            Добавить линию
          </Button>
        </Card>
        <Button
          w={canvasSize.w}
          colorScheme="teal"
          onClick={onSubmit}
          m={`5px ${CANVAS_MARGIN}px`}
          leftIcon={<SearchIcon />}
          isLoading={loading}
        >
          Отправить
        </Button>
      </Flex>
      <PopoverForm isOpen={isOpen} onClose={onClose} />
    </>
  );
};
