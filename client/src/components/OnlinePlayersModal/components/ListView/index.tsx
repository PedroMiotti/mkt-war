import React from "react";
import "./style.css";


interface IListViewProps {
  children?: any;
}

const ListView: React.FC<IListViewProps> = ({ children }) => {
  return (
    <div className="listview-container">
      <div className="listview-header"></div>

      <div className="listview-children">

        {children}
      </div>
    </div>
  );
};

export default ListView;
