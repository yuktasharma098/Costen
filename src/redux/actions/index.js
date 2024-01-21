export const travelHeader=(obj)=>{
    return{
        type: "TRAVELHEADER",
        payload:obj
    }
}

export const requesteid=(id)=>{
    return{
        type: "REQUESTEDID",
        payload:id
    }
}

export const general=(costCenter)=>{
    return{
        type: "GENERAL",
        payload:costCenter
    }
}
export const hoteldata=(data)=>{
    return{
        type: "HOTELDATA",
        payload:data
    }
}
export const cashAdvance=(data)=>{
    return{
        type: "CASHADVANCE",
        payload:data
    }
}
export const flight=(data)=>{
    return{
        type: "FLIGHT",
        payload:data
    }
}
export const train=(data)=>{
    return{
        type: "TRAIN",
        payload:data
    }
}
export const bus=(data)=>{
    return{
        type: "BUS",
        payload:data
    }
}
export const taxi=(data)=>{
    return{
        type: "TAXI",
        payload:data
    }
}
export const perdiem=(data)=>{
    return{
        type: "PERDIEM",
        payload:data
    }
}
export const perdiemextra=(data)=>{
    return{
        type: "PERDIEMEXTRA",
        payload:data
    }
}

export const carRental=(data)=>{
    return{
        type: "CARRENTAL",
        payload:data
    }
}

export const amount=(data)=>{
    return{
        type: "AMOUNT",
        payload:data
    }
}
export const claimno=(id)=>{
    return{
        type: "CLAIMNO",
        payload:id
    }
}
export const submitexpenseadd=(obj)=>{
    return{
        type: "SUBMITEXPENSEADD",
        payload:obj
    }
}
export const submitexpenseremove=(objId)=>{
    return{
        type: "SUBMITEXPENSEREMOVE",
        payload:objId
    }
}
export const submitexpenseupdate=(obj)=>{
    return{
        type: "SUBMITEXPENSEUPDATE",
        payload:obj
    }
}