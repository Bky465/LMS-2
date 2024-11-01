const cleanUp=(formdata,setFormData,setError)=>{
    const resData={...formdata}
    for (let key in resData) {
        resData[key] = "";  // Reset each key's value
    }
    setFormData(resData)
    setError && setError({})
}

export default cleanUp