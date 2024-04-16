
const saveToLocalStorage = (title, level, score, params=null) => {
    const storage = "quizac"
    const localdata = JSON.parse(localStorage.getItem(storage)) || null
    //const json = localdata && title in localdata ? localdata[title] : {}
    const value = { score, timestamp: Date.now(), params }
    const newTitleData = { [level]: [value] }
    const newData = { [title]: newTitleData }
    if (localdata) {
        if (title in localdata) {
            const json = localdata[title]
            if (level in json) {
                Array.isArray(json[level]) ? json[level].push(value) : json[level] = [value]
            } else {
                json[level] = [value]
            }
        } else {
            localdata[title] = newTitleData
        }
        localStorage.setItem(storage, JSON.stringify(localdata))
    } else {
        localStorage.setItem(storage, JSON.stringify(newData))
    }
}

export {
    saveToLocalStorage
}