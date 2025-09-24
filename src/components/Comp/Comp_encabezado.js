import logo from "../../images/zig_zag_logo.png";
import logo_labsol from "../../images/Logos_Labsol_2023_02.png";
import logo_GPL from "../../images/GPLv3_Logo.svg.png";

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
        <a href="https://labsol.cozcyt.gob.mx/" target="_blank" rel="noopener noreferrer">
          <img 
            src={logo_labsol}
            alt="Logo Labsol Network"
            className='encabezado__logo logo-center '
          />
        </a>
        
        <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" rel="noopener noreferrer">
          <img 
            src={logo_GPL}
            alt="Logo GPL3 Free Software"
            className='encabezado__logo logo-right'
          />
        </a>
       
      </header>
      

        
    </>
  );
}


