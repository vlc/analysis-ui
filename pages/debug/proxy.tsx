import {useEffect, useState} from 'react'

const timeout = 200

function useTestURL(url: string) {
  const [time, setTime] = useState<[number, number]>([0, 0])
  useEffect(() => {
    let id = null
    function sample() {
      const start = Date.now()
      fetch(url).then(() => {
        const duration = Date.now() - start
        setTime(([time, count]) => [time + duration, count + 1])

        id = setTimeout(sample, timeout)
      })
    }
    sample()
    return () => clearTimeout(id)
  }, [url, setTime])
  return time
}

const proxyURL = '/api/r5/version'
const corsURL = process.env.NEXT_PUBLIC_API_URL + '/version'

export default function ProxyTest() {
  const proxyTime = useTestURL(proxyURL)
  const corsTime = useTestURL(corsURL)

  return (
    <table>
      <style jsx global>{`
        td: {
          padding: 5px;
        }
      `}</style>
      <thead>
        <tr>
          <th>URL</th>
          <th>Time (ms)</th>
          <th>Samples</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{proxyURL}</td>
          <td>{Math.ceil(proxyTime[0] / proxyTime[1])}</td>
          <td>{proxyTime[1]}</td>
        </tr>
        <tr>
          <td>{corsURL}</td>
          <td>{Math.ceil(corsTime[0] / corsTime[1])}</td>
          <td>{corsTime[1]}</td>
        </tr>
      </tbody>
    </table>
  )
}
