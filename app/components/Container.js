import React from "react";

function Container(props) {
  return (
    <div
      className={"container py-md-5 " + (props.wide ? "" : "container--narrow")}
    >
      {/*nested jsx available as props.children*/}
      {props.children}
    </div>
  );
}

export default Container;
