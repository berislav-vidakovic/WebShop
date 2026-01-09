import type { Dispatch, SetStateAction } from "react";


let hasuraQueryURL = "";
let hasuraSubscriptionURL = "";


export const getHasuraQueryUrl  = (): string => {
  return hasuraQueryURL;
}

export const getHasuraSubscriptionUrl  = (): string => {
  return hasuraSubscriptionURL;
}



export async function loadConfig(
    setConfigLoaded:  Dispatch<SetStateAction<boolean>>
){
  const response = await fetch('/clientsettings.json', {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to load clientsettings.json');
  }
  
  const config = await response.json();
  console.log( "HOSTNAME:", window.location.hostname );
  console.log( "HOST:", window.location.host );
  const env = window.location.hostname.includes("-test") ? "test" : "dev";
  hasuraQueryURL = config[env].hasuraHttpUrl;
  hasuraSubscriptionURL = config[env].hasuraWsUrl;
  setConfigLoaded(true);
}

export function numToString(n: number){
  return n.toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            });
}

export function strToNum(s: string) {
     return Number(s.replace(/,/g, ''));
}


