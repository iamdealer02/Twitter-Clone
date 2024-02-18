import React from 'react'
import SearchBar from './SearchBar';


export default function NewChatBox() {
  return (

    <div >
        <div className='newChatBox'>
            <div className='newChatBoxHeader'>
            <SearchBar messaging={true}/>
           </div>

        </div>
        
    </div>
  )
}
