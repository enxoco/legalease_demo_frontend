const fetchQueries = async () => {
    const result = await fetch('http://localhost:3000/queries', {
        method: 'POST'
    })
    console.log('result', result)
}