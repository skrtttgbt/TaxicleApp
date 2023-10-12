import sampleLogo from "../taxicle.png"

export const TaxicleLogo = () => {
  return (
    <img src={sampleLogo} 
    alt ="Taxicle Logo"
    style={{
        position:'fixed',
        top: "-20px",
        left:"20px",
        width: "120px",
    }} />
  )
}
