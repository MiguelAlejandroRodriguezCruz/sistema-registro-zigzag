import logo from "../../images/zig_zag_logo.png";

export function Comp_encabezado() {
  return (
    <>
      <header className=" comp_encabezado">
        <a href="https://zigzag.gob.mx/" target="_blank" rel="noopener noreferrer"> 
          <img
            src={logo}
            alt="Logo Zig Zag"
            className='encabezado__logo logo-left' 
          />
        </a>
      </header>
      
    </>
  );
}


