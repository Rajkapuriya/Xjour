import React from 'react';
import { useParams } from 'react-router-dom';
import StreetMap from '../Street Map/StreetMap';
import './Test.css'

function Test() {
    const {ID} = useParams()
    return (
        <div className='test'>
            <h1>ID = {ID}</h1>
        </div>
    )
}

export default Test
