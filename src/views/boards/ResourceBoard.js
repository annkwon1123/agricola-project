import React, { useState, useEffect, useRef } from 'react';
import Box from "@mui/material/Box";
import Resource from "./Resource";

const initialResources = [
  { name: "Wood", count: 0 },
  { name: "Soil", count: 0 },
  { name: "Rock", count: 0 },
  { name: "Food", count: 0 },
  { name: "Sheep", count: 0 },
  { name: "Grain", count: 0 },
  { name: "Adult", count: 0 },
  { name: "Newborn", count: 0 },
  { name: "Fence", count: 0 },
  { name: "Barn", count: 0 },
];

const ResourceBoard = ({ playerNumber }) => {


  const [resources1, setResources1] = useState(initialResources);
  const [resources2, setResources2] = useState(initialResources);
  const [resources3, setResources3] = useState(initialResources);
  const [resources4, setResources4] = useState(initialResources);

  const [resources, setResources] = useState(initialResources);
  const [color, setColor] = useState('');

  useEffect(() => {
    if (playerNumber == 1) {
      setColor("#66CC66");
      setResources(resources1);
    } else if (playerNumber == 2) {
      setColor("#CC3333");
      setResources(resources2);
    } else if (playerNumber == 3) {
      setColor("#3366CC");
      setResources(resources3);
    } else if (playerNumber == 4) {
      setColor("#FFFF99");
      setResources(resources4);
    }
  }, [playerNumber, resources1, resources2, resources3, resources4]);

  return (
    <Box
    height={220}
    width={220}
    display="flex"
    alignItems="center"
    justifyContent="center"
    backgroundColor={color}
    gap={1}
    p={2}
    sx={{
      my: 1,
      mx: 2,
      border: "3.3px solid #7B5B3C",
      borderRadius: 2,
      overflowX: 'auto',
      overflowY: 'hidden',
    }}
    >
      <div className="resource-board">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            {(Array.isArray(resources) ? resources : []).slice(index * 4, (index + 1) * 4).map((resource) => (
              <Resource
                key={resource.name}
                name={resource.name}
                count={resource.count}
                playerNumber={playerNumber}
              />
            ))}
          </div>
        ))}
      </div>
    </Box>
  );
};

export default ResourceBoard;
