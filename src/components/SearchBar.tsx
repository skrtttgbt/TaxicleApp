import React, { useRef ,ChangeEvent, useContext} from 'react';
import { PlacesContext, MapContext } from '../context';
import SearchResult from './SearchResult';
import { create } from 'zustand';

export const SearchBar = () => {
  const { searchPlacesByTerm } = useContext(PlacesContext)
  const { lineremove } = useContext(MapContext)
  const debounceRef = useRef<NodeJS.Timeout>()
  const ref = React.useRef<HTMLInputElement>(null);
  const inpLength = getInput()

    const onQueryChanged = (event: ChangeEvent <HTMLInputElement> ) => {
        if (debounceRef.current) 
        if(ref.current?.value.trim() !== "") {
          inpLength.inputlng = 0
          lineremove()
        }   else {
          inpLength.inputlng = 1
          inpLength.activeID = ""
          lineremove()
        }
            lineremove()
            clearTimeout( debounceRef.current)
            debounceRef.current = setTimeout(() => {
                searchPlacesByTerm(event.target.value)
            }, 350); 
    }

  return (<>
    <div className="search-container">
        <input 
        ref={ref} 
        type="search" 
        className="form-control"
        style={{fontFamily:'Arial, FontAwesome'}}
        placeholder='&#xF002; Search Location...'
        onChange={onQueryChanged}
        />
        <SearchResult />  
    </div>
    </>
  )
}
type InputLength = {
  inputlng: number | undefined;
  activeID: string | undefined;
}

const getInput = create<InputLength>((set) =>
({
  inputlng:1,
  activeID:"",
  })); 

  export default getInput

