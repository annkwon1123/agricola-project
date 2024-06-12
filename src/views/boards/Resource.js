import React from "react";

const Resource = ({ name, count, playerNumber }) => {
  let imgPath;

  // imgPath = `../image/Resource/${name}.png`;
  // if (name === "Adult" || name === "Newborn") {
  //   imgPath = `../image/Resource/${name}/${playerNumber}.png`;
  // }

  // adult와 newborn을 각각 색깔별로 구분하여 디렉토리 경로 설정
  if (name === "Adult" || name === "Newborn") {
    imgPath = `../image/Resource/${name}/${playerNumber}.png`;
  } else {
    imgPath = `../image/Resource/${name}.png`;
  }

  return (
    <div className="resource">
      <img 
        src={imgPath} 
        alt={name} 
        style={{
          width: '60%',
        }}
      />
      <span className="count">{count}</span>
    </div>
  );
};
export default Resource;
