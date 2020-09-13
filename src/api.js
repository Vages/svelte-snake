export function fetchScores() {
  return fetch("/api/scores").then((res) => {
    if (!res.ok) {
      throw Error(res.statusText)
    }
    return res.json()
  })
}

export function postScore(body) {
  return fetch("/api/scores", { method: "POST", body }).then((res) => {
    if (!res.ok) {
      throw Error(res.statusText)
    }
    return res.json()
  })
}
