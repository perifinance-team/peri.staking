import React, { useState, useEffect } from 'react';
import { InitOnboard } from 'lib/onboard/onboard'


export const useOnboard = (networkId, subscriptions, darkMode) => {
    const [isOnboard, setIsOnboard] = useState(false);
    const [isConnect, setIsConnect] = useState(false);
    const [ onboard, setOnboard ] = useState({});

    useEffect(() => {
        setIsOnboard(true);
        
        // setOnboard(
            // InitOnboard(networkId, subscriptions, darkMode)
        // )
    }, [])
      
    return onboard;
}