import Head from 'next/head'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Header from './Header';
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Home() {

  const { data, error } = useSWR('/api/collections', fetcher);
  const [svalue, setSvalue] = useState("")
  const [result, setResult] = useState([])
  const [scount, setScount] = useState("")

  useEffect(() => {
    if (data) {
      setResult(data);
    }
  }, [data]);

  //state of words name  
  const handleValueChange = (event) => {
    setSvalue(event.target.value)
  }

  //state of search word count 
  const handleCountChange = (event) => {
    setScount(event.target.value)
  }

  //click search button
  const handleSubmit = (event) => {
    let count = scount ? scount : 10;
    if (count > 100) {
      setScount(100)
      count = 100
    }

    const filteredData = data.filter(obj => obj.value.startsWith(svalue)).slice(0, count);
    setResult(filteredData);
    let filteredArray = filteredData.map(obj => obj.value);
    let results =
    {
      name: svalue,
      words: filteredArray.join(",")
    }


    const fetchSearchData = async () => {
      try {
        const response = await fetch('/api/collections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(results),
        });
        const data = await response.text();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchSearchData();
  }

  if (!data) return <div>Loading...</div>

  console.log(result);

  return (
    <>
      <Head>
        <title>Words-App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <Header />
      <div className='container'>
        <div className="form-inline">
          <label htmlFor="search_value">search value:</label>
          <input type="text" placeholder="Enter search value..." value={svalue} onChange={handleValueChange} />
          <label htmlFor="search_count">search count:</label>
          <input type="number" placeholder="Enter search count..." value={scount} onChange={handleCountChange} />
          <button onClick={handleSubmit}>Search</button>
        </div>


        <div>
          <table id="customers">
            <thead>
              <tr>
                <td>no</td>
                <td>words name</td>
              </tr>
            </thead>
            <tbody>
              {result && result.map((val, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td key={index}>{val.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </>
  )
}
