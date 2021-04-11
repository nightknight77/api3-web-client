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


const abbr = (text, numLeftChars = 3, numRightChars = 3, filler = '...') =>
    text.slice(0, numLeftChars) +
    filler +
    (numRightChars <= 0 ? '' : text.slice(numRightChars * -1))


module.exports = {
    promiseAllObj,
    fmtApi3,
    abbr,
}
