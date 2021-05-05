import {utils} from 'ethers'

const
    {formatEther, commify} = utils,
    {keys, values, fromEntries} = Object


export const promiseAllObj = async promiseDict => {
    const
        objKeys = keys(promiseDict),
        objVals = await Promise.all(values(promiseDict))

    return fromEntries(objKeys.map((k, idx) => [k, objVals[idx]]))
}


// @param amount BigNumber
// @param roundDecimals int optional
export const fmtApi3 = (amount, roundDecimals) => {
    const formatted = commify(formatEther(amount))

    if (!roundDecimals)
        return formatted

    return formatted.slice(0, formatted.indexOf('.') + roundDecimals + 1)
}


export const abbr = (
    text,
    numLeftChars = 3,
    numRightChars = 3,
    filler = '...',
) =>
    text.slice(0, numLeftChars) +
    filler +
    (numRightChars <= 0 ? '' : text.slice(numRightChars * -1))


export const duration = intervalInSeconds =>
    Object.entries({
        days: 60 * 60 * 24,
        hrs: 60 * 60,
        mins: 60,
    }).reduce(
        (duration, [unit, interval]) => ({
            ...duration,
            [unit]: Math.floor(duration.secs / interval),
            secs: duration.secs % interval,
        }),

        {secs: intervalInSeconds},
    )
