const {keys, values, fromEntries} = Object


const promiseAllObj = async promiseDict => {
    const
        objKeys = keys(promiseDict),
        objVals = await Promise.all(values(promiseDict))

    return fromEntries(objKeys.map((k, idx) => [k, objVals[idx]]))
}


module.exports = {
    promiseAllObj,
}
