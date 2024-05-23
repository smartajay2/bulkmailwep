import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [msg, setmsg] = useState("");
  const [status, setstatus] = useState(false);
  const [emailList, setEmailList] = useState([]);

  function handlemsg(evt) {
    setmsg(evt.target.value);
  }

  function send() {
    setstatus(true);
    axios.post("http://localhost:5000/sendemail", { msg: msg, emailList: emailList })
      .then(function (data) {
        if (data.data === true) {
          alert("Email Sent Successfully");
          setstatus(false);
        } else {
          alert("Sending Email Failed");
        }
      });
  }

  function handlefile(evt) {
    const file = evt.target.files[0];
    console.log(file);
    const reader = new FileReader();

    reader.onload = function (e) {
      const arrayBuffer = e.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      console.log(worksheet);
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });
      const totalemail = emailList.map(function (item) {
        return item.A;
      });
      console.log(totalemail);
      setEmailList(totalemail);
    };

    reader.readAsArrayBuffer(file);
  }

  return (
    <div className="bg-blue-400 min-h-screen flex flex-col justify-center items-center text-black p-5">
      <div className="bg-blue-950 text-white text-center w-full py-3">
        <h1 className="text-2xl font-medium">BulkMail</h1>
      </div>

      <div className="bg-blue-800 text-white text-center w-full py-3">
        <h1 className="text-2xl font-medium">We can help your business with sending multiple emails at once</h1>
      </div>

      <div className="bg-blue-600 text-white text-center w-full py-3">
        <h1 className="text-2xl font-medium">Drag and Drop</h1>
      </div>

      <div className="bg-white text-black w-full max-w-2xl flex flex-col items-center p-5 rounded-md shadow-lg mt-5">
        <textarea onChange={handlemsg} value={msg} className="w-full h-32 py-2 px-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:border-blue-500"  placeholder="Enter the email text....."></textarea>

        <div>
          <input onChange={handlefile} className="w-full border-4 border-dashed py-4 px-4 mt-5 mb-5"  type="file" />
        </div>
        <p className="text-lg mb-5">Total Emails in the file: {emailList.length}</p>

        <button onClick={send} className="bg-blue-950 text-white font-medium rounded-md py-2 px-6 mb-3">{status ? "Sending..." : "Send"}</button>
      </div>

      <div className="bg-blue-300 text-white text-center py-8 px-8 w-full"></div>
      <div className="bg-blue-200 text-white text-center py-8 px-8 w-full"></div>
    </div>
  );
}

export default App;
