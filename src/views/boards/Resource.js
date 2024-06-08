import React from "react";

const Resource = ({ name, count }) => {
  const imgPath = `../image/Resource/${name}.png`;

  return (
    <div className="resource">
      <img src={imgPath} alt={name} />
      <span className="count">{count}</span>
    </div>
  );
};
export default Resource;
