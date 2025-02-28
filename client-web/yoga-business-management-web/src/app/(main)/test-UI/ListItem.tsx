import React from "react";

interface Prop {
  listItem: string[];
}

const ListItem: React.FC<Prop> = ({ listItem }) => {
  return (
    <div>
      {listItem.map((item) => {
        return <div>{item}</div>;
      })}
    </div>
  );
};

export default ListItem;
