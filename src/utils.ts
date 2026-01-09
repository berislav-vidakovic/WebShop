import type { Dispatch, SetStateAction } from "react";


const hasuraQueryURL = "https://hasura-dev.barryonweb.com/v1/graphql";
const hasuraSubscriptionURL = "wss://hasura-dev.barryonweb.com/v1/graphql"


export const getHasuraQueryUrl  = (): string => {
  return hasuraQueryURL;
}

export const getHasuraSubscriptionUrl  = (): string => {
  return hasuraSubscriptionURL;
}



export function loadConfig(
    setConfigLoaded:  Dispatch<SetStateAction<boolean>>
){

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


