const keyExists = (key, obj) => {
    if (obj) {
      return (key in obj);
    } else {
      return false;
    }
}

const checkScore = (a, b, c, d) => {
    if ((a || a===0) && b==c) {
      return true;
    } else if (keyExists(b, d)) {
      if (d[b]?.length) {
        return true
      }
    }
    return false;
}

const avgScore = (arr, float=false) => {
    if (arr.length === 0) {
      return 0;
    }
    if (float) {
      const avg = (arr.reduce((acc, curr) => acc + parseFloat(curr.score), 0))/arr.length;
      return avg.toFixed(2)
    } else {
      return (arr.reduce((acc, curr) => acc + curr.score, 0))/arr.length;
    }
}

export {
    keyExists,
    checkScore,
    avgScore,
}