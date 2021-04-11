const
    {formatEther, commify} = require('@ethersproject/units'),
    {keys, values, fromEntries} = Object


const promiseAllObj = async promiseDict => {
    const
        objKeys = keys(promiseDict),
        objVals = await Promise.all(values(promiseDict))

    return fromEntries(objKeys.map((k, idx) => [k, objVals[idx]]))
}


// @param amount BigNumber
const fmtApi3 = amount => commify(formatEther(amount))


module.exports = {
    promiseAllObj,
    fmtApi3,
}
