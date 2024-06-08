import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const PersonalBoard = ({ clickedPlayer }) => {
  const theme = useTheme();
  const initialPlotStatuses = Array(15).fill({ type: "none", level: 0 });
  initialPlotStatuses[5] = { type: "room", level: 1 };
  initialPlotStatuses[10] = { type: "room", level: 1 };

  const [plotStatuses, setPlotStatuses] = useState(initialPlotStatuses);
  const [open, setOpen] = useState(false);
  const [currentPlot, setCurrentPlot] = useState(null);
  const [canBuildFence, setCanBuildFence] = useState(Array(15).fill(false));
  const [canBuildRoom, setCanBuildRoom] = useState(Array(15).fill(false));
  const [fenceCount, setFenceCount] = useState(0);
  const [fences, setFences] = useState(
    Array(3)
      .fill()
      .map(() =>
        Array(5)
          .fill()
          .map(() => [true, true, true, true])
      )
  );
  const [actionType, setActionType] = useState(null);
  const [validPositions, setValidPositions] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [color, setColor] = useState("yellow");
  const [client, setClient] = useState(null);

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () =>
        new SockJS("http://localhost:8091/agricola-service"), // 서버 주소 및 SockJS 경로
      debug: function (str) {
        console.log(str);
      },
      onConnect: () => {
        console.log("Connected");
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const handleClickOpen = (index) => {
    setCurrentPlot(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isAdjacent = (index, type) => {
    const adjacentIndices = [
      index % 5 !== 0 ? index - 1 : -1,
      index % 5 !== 4 ? index + 1 : -1,
      index - 5 >= 0 ? index - 5 : -1,
      index + 5 < plotStatuses.length ? index + 5 : -1,
    ];
    return adjacentIndices.some(
      (adjIndex) => adjIndex >= 0 && plotStatuses[adjIndex].type === type
    );
  };

  const updateCanBuildFence = () => {
    const newCanBuildFence = plotStatuses.map((status, index) => {
      if (
        status.type === "none" &&
        (plotStatuses.filter((plot) => plot.type === "fence").length === 0 ||
          isAdjacent(index, "fence"))
      ) {
        return true;
      }
      return false;
    });
    setCanBuildFence(newCanBuildFence);
  };

  const updateCanBuildRoom = () => {
    const newCanBuildRoom = plotStatuses.map((status, index) => {
      if (status.type === "none" && isAdjacent(index, "room")) {
        return true;
      }
      return false;
    });
    setCanBuildRoom(newCanBuildRoom);
  };

  const calculateFenceCount = (newPlotStatuses) => {
    let count = 0;
    const newFences = Array(newPlotStatuses.length).fill({
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });

    newPlotStatuses.forEach((status, index) => {
      if (status.fence) {
        newFences[index] = { top: 1, right: 1, bottom: 1, left: 1 };

        if (index - 5 >= 0 && newPlotStatuses[index - 5].fence) {
          newFences[index].top = 0;
          newFences[index - 5].bottom = 0;
        }
        if (
          index + 5 < newPlotStatuses.length &&
          newPlotStatuses[index + 5].fence
        ) {
          newFences[index].bottom = 0;
          newFences[index + 5].top = 0;
        }
        if (index % 5 !== 0 && newPlotStatuses[index - 1].fence) {
          newFences[index].left = 0;
          newFences[index - 1].right = 0;
        }
        if (index % 5 !== 4 && newPlotStatuses[index + 1].fence) {
          newFences[index].right = 0;
          newFences[index + 1].left = 0;
        }
      }
    });

    newFences.forEach((fence) => {
      count += fence.top + fence.right + fence.bottom + fence.left;
    });

    setFenceCount(count);
    setFences(newFences);
    console.log(`현재 울타리 개수: ${count}`);
  };

  const modifyPlot = (modification, x, y) => {
    const newPlotStatuses = [...plotStatuses];
    const newFences = [...fences];
    const currentPlot = x * 5 + y;
    const currentStatus = newPlotStatuses[currentPlot];

    if (
      modification === "upgrade" &&
      currentStatus.type === "room" &&
      currentStatus.level < 3
    ) {
      newPlotStatuses[currentPlot].level += 1;
    } else if (modification === "seeding" && currentStatus.type === "plow") {
      newPlotStatuses[currentPlot] = { type: "seeding", level: 0 };
    } else if (modification === "plow") {
      if (
        currentStatus.type === "none" &&
        (plotStatuses.filter(
          (plot) => plot.type === "plow" || plot.type === "seeding"
        ).length === 0 ||
          isAdjacent(currentPlot, "plow") ||
          isAdjacent(currentPlot, "seeding"))
      ) {
        newPlotStatuses[currentPlot] = { type: "plow", level: 0 };
      } else {
        handleClose();
        return;
      }
    } else if (modification === "fence") {
      if (
        (currentStatus.type === "none" &&
          (plotStatuses.filter((plot) => plot.type === "fence").length === 0 ||
            isAdjacent(currentPlot, "fence"))) ||
        currentStatus.type === "barn"
      ) {
        newPlotStatuses[currentPlot] = {
          ...currentStatus,
          fence: true,
          type: currentStatus.type === "none" ? "fence" : currentStatus.type,
        };
      } else if (currentStatus.type === "fence") {
        handleClose();
        return;
      }
    } else if (modification === "barn") {
      newPlotStatuses[currentPlot] = { ...currentStatus, barn: true };
    } else if (modification === "room") {
      if (currentStatus.type === "none" && isAdjacent(currentPlot, "room")) {
        newPlotStatuses[currentPlot] = { type: "room", level: 1 };
      } else {
        handleClose();
        return;
      }
    } else {
      if (
        currentStatus.type !== "none" &&
        currentStatus.type !== "fence" &&
        currentStatus.type !== "barn"
      ) {
        handleClose();
        return;
      }

      if (
        currentStatus.type === "none" ||
        (currentStatus.type === "room" && currentStatus.level < 3)
      ) {
        switch (modification) {
          case "fence":
            if (currentStatus.type !== "fence") {
              newFences[x][y] = [true, true, true, true];
              if (x > 0) newFences[x - 1][y][1] = true;
              if (x < 2) newFences[x + 1][y][0] = true;
              if (y > 0) newFences[x][y - 1][3] = true;
              if (y < 4) newFences[x][y + 1][2] = true;
            }
            newPlotStatuses[currentPlot] = { type: "fence", level: 0 };
            break;
          case "room":
            newPlotStatuses[currentPlot] = { type: "room", level: 1 };
            break;
          case "barn":
            newPlotStatuses[currentPlot] = { type: "barn", level: 0 };
            break;
          default:
            break;
        }
      } else if (currentStatus.type === "room" && currentStatus.level < 3) {
        newPlotStatuses[currentPlot].level += 1;
      } else if (currentStatus.type === "fence" && modification === "barn") {
        newPlotStatuses[currentPlot] = { type: "barn", level: 0 };
      } else if (currentStatus.type === "barn" && modification === "fence") {
        newPlotStatuses[currentPlot] = { type: "fence", level: 0 };
      }
    }

    setPlotStatuses(newPlotStatuses);
    setFences(newFences);
    calculateFenceCount(newPlotStatuses);
    updateCanBuildFence();
    updateCanBuildRoom();
    handleClose();
  };

  const handlePlotClick = (index) => {
    const x = Math.floor(index / 5);
    const y = index % 5;

    const isValidPosition = validPositions.some(
      (pos) => pos.x === x && pos.y === y
    );
    if (!isValidPosition) {
      console.log("Invalid position selected:", x, y);
      return;
    }

    if (actionType === "fence") {
      const newSelectedPositions = [...selectedPositions];
      const positionExists = newSelectedPositions.some(
        (pos) => pos.x === x && pos.y === y
      );
      if (positionExists) {
        setSelectedPositions(
          newSelectedPositions.filter((pos) => pos.x !== x || pos.y !== y)
        );
      } else {
        newSelectedPositions.push({ x, y });
        setSelectedPositions(newSelectedPositions);
      }
    } else {
      if (actionType === "plow") {
        modifyPlot("plow", x, y);
      } else if (actionType === "room") {
        modifyPlot("room", x, y);
      } else if (actionType === "barn") {
        modifyPlot("barn", x, y);
      }

      const payload = {
        playerId: 1,
        x,
        y,
      };
      console.log("Valid position selected:", x, y);
      if (client && client.connected) {
        client.publish({
          destination: "app/room/1/receiveSelectedPosition",
          body: JSON.stringify(payload),
        });
      }
    }
  };

  const handleSendFencePositions = () => {
    const payload = {
      playerId: 1,
      positions: selectedPositions,
    };
    console.log("Sending fence positions:", selectedPositions);
    if (client && client.connected) {
      client.publish({
        destination: "app/room/1/receiveSelectedPosition",
        body: JSON.stringify(payload),
      });
    }
    setSelectedPositions([]);
  };

  const handleValidPositions = (validPositionsMessage) => {
    const { playerId, actionType, validPositions } = validPositionsMessage;

    console.log("handleValidPositions called with:", validPositionsMessage);
    setActionType(actionType);
    setValidPositions(validPositions);
    console.log("Valid positions updated:", validPositions);
  };

  useEffect(() => {
    const initialMessage = {
      validPositions: [
        { x: 2, y: 3 },
        { x: 0, y: 0 },
        { x: 2, y: 1 },
        { x: 2, y: 4 },
        { x: 1, y: 2 },
        { x: 0, y: 2 },
        { x: 0, y: 3 },
        { x: 0, y: 4 },
        { x: 1, y: 3 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
        { x: 2, y: 2 },
        { x: 1, y: 4 },
      ],
      playerId: "1",
      actionType: "fence",
    };

    handleValidPositions(initialMessage);
  }, []);

  useEffect(() => {
    updateCanBuildFence();
    updateCanBuildRoom();
  }, [plotStatuses]);

  useEffect(() => {
    console.log(`현재 울타리 개수: ${fenceCount}`);
  }, [fenceCount]);

  useEffect(() => {
    if (clickedPlayer === 1) {
      setColor("#66CC66");
    } else if (clickedPlayer === 2) {
      setColor("#CC3333");
    } else if (clickedPlayer === 3) {
      setColor("#3366CC");
    } else {
      setColor("#FFFF99");
    }
  }, [clickedPlayer]);

  return (
    <Box
      height={400}
      width={700}
      display="grid"
      gridTemplateColumns="repeat(5, 1fr)"
      gridTemplateRows="repeat(3, 1fr)"
      gap={4} // 간격을 4로 설정
      p={2}
      sx={{ m: 0 }}
    >
      {plotStatuses.map((status, index) => {
        const isActive = canBuildFence[index] || canBuildRoom[index];
        let imagePath = "";

        if (status.type === "room") {
          if (status.level === 1) {
            imagePath = "../../image/Farm/wood_room.png";
          } else if (status.level === 2) {
            imagePath = "../../image/Farm/soil_room.png";
          } else if (status.level === 3) {
            imagePath = "../../image/Farm/rock_room.png";
          }
        } else if (status.type === "plow") {
          imagePath = "../../image/Farm/plow.png";
        } else if (status.type === "seeding") {
          imagePath = "../../image/Farm/plow_grain3.png";
        } else if (status.barn) {
          imagePath = "../../image/Farm/house.png";
        }

        const x = Math.floor(index / 5);
        const y = index % 5;

        return (
          <Card key={index} sx={{ padding: 0, margin: 0, boxShadow: "none" }}>
            <CardActionArea
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: color,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                borderRadius: "4px",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "black",
                m: 0,
                position: "relative",
              }}
              onClick={() => handlePlotClick(index)}
            >
              {imagePath && (
                <img
                  src={imagePath}
                  alt="coverImage"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
              {/* Render fences around the plot */}
              {fences[x][y][0] && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0, // 칸 밖으로 이동
                    left: 0,
                    right: 0,
                    height: "12px",
                    backgroundColor: color,
                    opacity: 1,
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "black",
                  }}
                />
              )}
              {fences[x][y][1] && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0, // 칸 밖으로 이동
                    left: 0,
                    right: 0,
                    height: "12px",
                    backgroundColor: color,
                    opacity: 1,
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "black",
                  }}
                />
              )}
              {fences[x][y][2] && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0, // 칸 밖으로 이동
                    width: "12px",
                    backgroundColor: color,
                    opacity: 1,
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "black",
                  }}
                />
              )}
              {fences[x][y][3] && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    right: 0, // 칸 밖으로 이동
                    width: "12px",
                    backgroundColor: color,
                    opacity: 1,
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "black",
                  }}
                />
              )}
            </CardActionArea>
          </Card>
        );
      })}
      {actionType === "fence" && selectedPositions.length > 0 && (
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            zIndex: 1,
          }}
        >
          <Button variant="contained" onClick={handleSendFencePositions}>
            Fence!!
          </Button>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Choose Modification</DialogTitle>
        <DialogContent>
          <Button onClick={() => modifyPlot("fence")}>Build Fence</Button>
          <Button onClick={() => modifyPlot("room")}>Build Room</Button>
          <Button onClick={() => modifyPlot("plow")}>Plow Field</Button>
          <Button onClick={() => modifyPlot("barn")}>Build Barn</Button>
          <Button onClick={() => modifyPlot("upgrade")}>Upgrade Room</Button>
          <Button onClick={() => modifyPlot("seeding")}>Seeding</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PersonalBoard;
