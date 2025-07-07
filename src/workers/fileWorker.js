import SparkMD5 from 'spark-md5'

// 监听主线程发来的消息
self.onmessage = async function (e) {
  const { file, chunkSize } = e.data
  const chunkCount = Math.ceil(file.size / chunkSize)
  const spark = new SparkMD5.ArrayBuffer()
  const fileReader = new FileReader()

  // 读取整个文件用于 hash 计算
  fileReader.onload = async function (event) {
    spark.append(event.target.result)
    const resultHash = spark.end()

    // 切片并为每个分片计算 hash
    const chunks = []
    for (let i = 0; i < chunkCount; i++) {
      const start = i * chunkSize
      const end = Math.min(file.size, start + chunkSize)
      const blob = file.slice(start, end)

      // 计算每个分片的 hash
      const chunkHash = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = function (e) {
          const chunkSpark = new SparkMD5.ArrayBuffer()
          chunkSpark.append(e.target.result)
          resolve(chunkSpark.end())
        }
        reader.readAsArrayBuffer(blob)
      })

      chunks.push({
        start,
        end,
        index: i,
        blob,
        hash: chunkHash, // 每个分片的 hash
      })
    }

    // 返回切片和整个文件的 hash
    self.postMessage({ chunks, resultHash })
  }

  fileReader.readAsArrayBuffer(file)
}
