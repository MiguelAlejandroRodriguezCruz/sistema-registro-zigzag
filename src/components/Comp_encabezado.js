import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import logo from "../images/zig_zag_logo.png";

export function Comp_encabezado() {
  return (
    <>
      <div className=" container d-flex align-items-center m-1">
        <img
          src={logo}
          alt="Logo Zig Zag"
          style={{ height: '60px', cursor: 'pointer' }}
        />
      </div>
      

        
    </>
  );
}


