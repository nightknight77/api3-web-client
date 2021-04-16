import {formatEther, commify} from '@ethersproject/units'

const {keys, values, fromEntries} = Object


export const promiseAllObj = async promiseDict => {
    const
        objKeys = keys(promiseDict),
        objVals = await Promise.all(values(promiseDict))

    return fromEntries(objKeys.map((k, idx) => [k, objVals[idx]]))
}


// @param amount BigNumber
export const fmtApi3 = amount => commify(formatEther(amount))


export const abbr = (
    text,
    numLeftChars = 3,
    numRightChars = 3,
    filler = '...',
) =>
    text.slice(0, numLeftChars) +
    filler +
    (numRightChars <= 0 ? '' : text.slice(numRightChars * -1))
