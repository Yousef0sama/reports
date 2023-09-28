"use client"

import { useState, useEffect } from "react";
import * as XSLX from "xlsx"
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../public/css/style.scss'

function Home() {

  const [report, setReport] = useState([]);
  const [Vheaders, setVHeaders] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [sheets, setSheets] = useState();
  const [sheet, setSheet] = useState();
  const [Wsheet, setWSheet] = useState();
  const [file, setFile] = useState();
  const [fileErr, setFileErr] = useState("");
  const [search, setSearch] = useState("");
  const [nextNum, setNextNum] = useState(100);
  const [prevNum, setPrevNum] = useState(0);

  const check = () => {
    if (!file) {
      setFileErr("Please select file");
    } else {
      setFileErr("");
      let allowed = ["xls", "xlsx"];
      if (!allowed.includes(file.name.slice(file.name.indexOf(".")+1, file.name.length).toLowerCase())) {
        setFileErr("please input xlsx and xls files only");
      } else {
        setFileErr("ok");
        const reader = new FileReader();
        reader.readAsArrayBuffer(file)
        reader.onload = (e) => {
          const data = e.target.result
          const workBook = XSLX.read(data ,{type : "buffer"});
          const sheetNames = workBook.SheetNames;
          setSheets(sheetNames);
        }
      }
    }
  }
  
  useEffect(()=>{
    if (sheet) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file)
      reader.onload = (e) => {  
        const data = e.target.result
        const workBook = XSLX.read(data ,{type : "buffer"});
        const workSheet = workBook.Sheets[sheet];
        const Data = XSLX.utils.sheet_to_json(workSheet)
        setReport(Data)
        setWSheet(workSheet)
      }
    }
  }, [sheet])

  useEffect(() => {
    if (Wsheet) {
      setVHeaders(Object.keys(Wsheet).filter((e) => {return e.includes("1")}).filter((e)=>{return e.length == 2}));
    }
    
  }, [Wsheet])
  
  useEffect(() => {
    if (Vheaders && Vheaders.length !== 0) {
      const arr = []
      for (let i = 0; i < Vheaders.length; i++) {
        arr.push(Vheaders[i]);
      }
      if (headers.length !== 0) {
        setHeaders([])
        setHeaders(arr);
      } else {
        setHeaders(arr);
      }
    }
  }, [Vheaders])

  const next = () => {
    if (nextNum < report.length) {
      setNextNum(nextNum + 100);
      setPrevNum(prevNum + 100);
    }
  }

  const prev = () => {
    if (prevNum > 0) {
      setNextNum(nextNum - 100)
      if (prevNum < 100) {
        setPrevNum(0);
      } else {
        setPrevNum(prevNum - 100);
      }
    }
  }

  return (
    <div className="container-fulid light">
      <div className="row">
        {/* upload start */}
        <div className="col col-sm-12 upload">
          <div className="form">
            <form>
              <label for="file">
                <span className="float-start text">Add File</span>
                <span className="float-end rigth">
                  <i class="bi bi-file-earmark-plus-fill"></i>
                </span>
              </label>
              <input type="file" id="file" accept=".xls, .xlsx" onChange={(e) => { setFile(e.target.files[0]) }} />
              <button type="button" className="view" onClick={() => { check(); }}>veiw</button>
              <br />
              <>{ fileErr && fileErr == "ok" && null}</>
              <p className="err">{ fileErr && fileErr != "ok" && <><span><i class="bi bi-bug-fill"></i></span> { fileErr }</>}</p>
            </form>
          </div>
        </div>
        {/* upload end */}
        <span className="line"></span>
        {/* sheets start */}
        <div className="col col-sm-12 sheets">
          {!sheets && <div className="no-data">no data here</div>}
          {
          sheets &&
          <div className="row filter">
            <div className="col text"> sheets : </div>
            {sheets.map((sheet) => {
              return <div className="col sheet" key={""} onClick={() => {setSheet(sheet); check();}}> {sheet} </div>
            })}
          </div>
          }
        </div>
        {/* sheets end */}
        {/* data show start */}
        <div className="col col-sm-12 data">
          {!headers || headers.length == 0 && sheets && <div className="no-data">no data here</div>}
          {
          headers && headers.length > 0 && 
          <>
            <div>
              <input type="text" className="search" placeholder="Search" onChange={(e) => {setSearch(e.target.value)}}/>
              <br />
              <span onClick={() => {prev()}}> {"<<"} </span>
              <span onClick={() => {next()}}> {">>"} </span>
            </div>
            <div className="over">
              {headers.map((e) => {
                return <div className="header">{ e }</div>
              })}
              <div>
              {report.filter(
                (x) => {return search.toLowerCase() === "" ? x : Object.values(x).toString().includes(search);}
              ).slice(prevNum, nextNum).map((e) => (
                <div key={""}>
                  {Object.values(e).map((v) => (<div className="val" key={""}> {v} </div>))}
                </div>
              ))}
              </div>
            </div>
          </>
          }
        </div>
        {/* data show end */}
      </div>
    </div>
  )
}

export default Home