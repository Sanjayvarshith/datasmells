import Excel from "../ExcelSheet/Excel";
// import { Spinner } from "react-bootstrap";
import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import "./Mainpage.css";
import jsPDF from "jspdf";
import { Button } from "react-bootstrap";
import html2canvas from "html2canvas";
import Codebox from "../Codebox";
import Table from "./Table";
import { RegExForm } from "../RegularExpression/form";
import { Row,Col } from "react-bootstrap";

const language = "python";
export default function MainPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bargraph_sp_miss, setBargraph_sp_miss] = useState(null);
  const [bargraph_nan, setBargraph_nan] = useState(null);
  const [bargraph_binning_cat, setBargraph_binning_cat] = useState(null);
  const [bargraph_class_imbal, setBargraph_class_imbal] = useState(null);
  // const [bargraph_sp_char, setBargraph_sp_char] = useState(null);
  // const [bargraph_hum_friendly, setBargraph_hum_friendly] = useState(null);
  // const [bargraph_tr_spaces, setBargraph_tr_spaces] = useState(null);
  const bargraph_sp_char = null;
  const bargraph_hum_friendly = null;
  const bargraph_tr_spaces = null;
  const [boxplot, setBoxplot] = useState(null);
  const [click, setClick] = useState(false);
  const [fileChosen, setFileChosen] = useState(false);

  const handleFileUpload = (event) => {
    setFileChosen(true);
    setSelectedFile(event.target.files[0]);
    // Added for excel Purpose, which itself is Okay
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: function (result) {
        setJsonData(result.data);
      },
    });
  };

  const handleUpload = () => {
    setClick(true);
    setIsLoading(true); // we will set this to false when the response is received
    const formData = new FormData();
    formData.append("file", selectedFile);

    axios
      .post("http://127.0.0.1:5000/upload", formData)
      .then((response) => {
        console.log(response.data);
        setAnalysisData(response.data);
        setHeatmapData(response.data.heatmap);
        setBargraph_sp_miss(response.data.bargraph_sp_miss);
        setBargraph_nan(response.data.bargraph_nan);
        setBoxplot(response.data.outliers.plot);
        setBargraph_binning_cat(response.data.binning_cat.plot);
        setBargraph_class_imbal(response.data.imbalance.plot);
        // setBargraph_sp_char(response.data.sp_char.plot);
        // setBargraph_hum_friendly(response.data.hum_friendly.plot);
        // setBargraph_tr_spaces(response.data.tr_spaces.plot);
        console.log(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };
  const handleDownload = () => {
    html2canvas(document.body).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save("page-content.pdf");
    });
  };

  const downloadDataset = () => {
    axios
      .get('http://127.0.0.1:5000/download-dataset')
      .then((response) => {
        // Create a Blob from the response
        const blob = new Blob([response.data], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'refactored_dataset.csv'; // Specify the file name
        link.click(); // Trigger the download
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleRefactorAll = () => {
    axios.post("http://127.0.0.1:5000/refactor/all")
      .then(response => {
        console.log("Refactor all data smells", response.data);
        // Handle response data
      })
      .catch(error => {
        console.log(error);
      });
  };
  
  const handleRefactorSpecialMissingValues = () => {
    axios.post("http://127.0.0.1:5000/refactor/special-missing-values")
    .then(response => {
      console.log("Refactor special missing values", response.data);
      // Handle response data
    })
    .catch(error => {
      console.log(error);
    });
  };
  
  const handleRefactorMissingValues = () => {
    axios.post("http://127.0.0.1:5000/refactor/missing-values")
    .then(response => {
      console.log("Refactor missing values", response.data);
      // Handle response data
    })
    .catch(error => {
      console.log(error);
    });
  };

  const handleIntToStr = () => {
    axios.post("http://127.0.0.1:5000/refactor/int-to-str")
    .then(response => {
      console.log("Refactor int-to-str", response.data);
      // Handle response data
    })
    .catch(error => {
      console.log(error);
    });
  };

  const handleUniqueValues = () => {
    axios.post("http://127.0.0.1:5000/refactor/unique-values")
    .then(response => {
      console.log("Refactor unique-values", response.data);
      // Handle response data
    })
    .catch(error => {
      console.log(error);
    });
  };
  
  const handlebinaryMissingvalues = () => {
    axios.post("http://127.0.0.1:5000/refactor/binary-missing-values")
    .then(response => {
      console.log("Refactor binary-missing-values", response.data);
      // Handle response data
    })
    .catch(error => {
      console.log(error);
    });
  };
  const handleRefactorBinningCategorical = () => {
    axios.post("http://127.0.0.1:5000/refactor/binning-categorical")
    .then(response => {
      console.log("Refactor binning categorical", response.data);
      // Handle response data
    })
    .catch(error => {
      console.log(error);
    });
  };
  
  const handleRefactorClassImbalance = () => {
    axios.post("http://127.0.0.1:5000/refactor/class-imbalance")
    .then(response => {
      console.log("Refactor class imbalance", response.data);
      // Handle response data
    })
    .catch(error => {
      console.log(error);
    });
  };
  
  const handleRefactorSpecialCharacters = () => {
    axios.post("http://127.0.0.1:5000/refactor/special-characters")
    .then(response => {
      console.log("Refactor special characters", response.data);
      // Handle response data
    })
    .catch(error => {
      console.log(error);
    });
  };
  
  const handleRefactorHumanFriendly = () => {
    axios.post("http://127.0.0.1:5000/refactor/human-friendly")
      .then(response => {
        console.log("Refactor human friendly", response.data);
        // Handle response data
      })
      .catch(error => {
        console.log(error);
      });
  };
  
  const handleRefactorTrailingSpaces = () => {
    axios.post("http://127.0.0.1:5000/refactor/trailing-spaces")
    .then(response => {
      console.log("Refactor trailing spaces", response.data);
      // Handle response data
    })
    .catch(error => {
      console.log(error);
    });
  };
  const handleRefactorDuplicateValues = () => {
    axios.post("http://127.0.0.1:5000/refactor/duplicate-values")
      .then(response => {
        console.log("Refactor duplicate values", response.data);
        // Handle response data
      })
      .catch(error => {
        console.log(error);
      });
  };
  
  const handleRefactorOutliers = () => {
    axios.post("http://127.0.0.1:5000/refactor/outliers")
      .then(response => {
        console.log("Refactor outliers", response.data);
        // Handle response data
      })
      .catch(error => {
        console.log(error);
      });
  };
  
  // const handleDownload = () => {
  //   setIsLoading(true); // off it when the pdf is downloaded, i.e after the pdf is saved
  //   const pdf = new jsPDF();
  //   const resultsContainer = document.getElementById("results-container");
  //   pdf.fromHTML(resultsContainer, 15, 15);
  //   // pdf.save('results.pdf');
  //   // setIsLoading(false);
  //   // it should be asynchoronous
  //   pdf
  //     .save("results.pdf")
  //     .then(() => {
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setIsLoading(false);
  //     });
  // };

  return (
    <div className="App">
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="heading-text">
        <h1>SniffCSV DataSmell Detector</h1>
      </div>
      <div className="Intput-and-Btn">
        <br />
        <input
          type="file"
          name="file"
          accept=".csv"
          // Removed the onChange event handler of csv file
          onChange={handleFileUpload}
          className="input-file"
        />
        <Button
          className="analyze-btn d-flex align-self-center"
          variant="success"
          size="lg"
          onClick={handleUpload}
        >
          Analysis
        </Button>
      </div>

      {analysisData && (
        <div className="analysis-container">
          <Excel myjson={jsonData} />
          <div className="results-container">
            <h1 className="analysis-title">Analysis Results</h1>
            <div className="analysis-summary">
              <p className="head-text">
                Number of Rows: {analysisData.num_rows}
              </p>
              <p className="head-text">
                Number of Columns: {analysisData.num_cols}
              </p>
              {
                <p className="head-text">
                  Column Names:{" "}
                  <p id="Column-Names">
                    {analysisData.column_names.join(", ")}
                  </p>
                </p>
              }
            </div>
            <div className="analysis-details">
              <h3 className="data-smells-title">1) Special Missing Values</h3>
              <Table
                col1Arr={analysisData.sp_missing_values.splmissCols}
                col2Arr={analysisData.sp_missing_values.missingPer}
                col1={"Column Name"}
                col2={"Missing Percentage"}
                smellName={"Special Missing Values"}
              />
              {/* <ul className="data-smells-list">
                {splitIntoSentences(analysisData.sp_missing_values.Info).map(
                  (sentence, index) => (
                    <li key={index}>{sentence}</li>
                  )
                )}
              </ul> */}
              <Codebox
                language={language}
                code={analysisData.sp_missing_values.Code}
              />
              {bargraph_sp_miss && (
                <div className="image-box">
                  <img
                    src={`data:image/png;base64,${bargraph_sp_miss}`}
                    alt="special missing values"
                  />
                  <div className="fig-text"> Special Missing Values</div>
                </div>
              )}
              {/* <h5> NaN Values</h5>
              <ul className="data-smells-list">
                {splitIntoSentences(analysisData.sp_missing_values.InfoNan).map(
                  (sentence, index) => (
                    <li key={index}>{sentence}</li>
                  )
                )}
              </ul>
              <Codebox
                language={language}
                code={analysisData.sp_missing_values.Code_Nan}
              />
              {bargraph_nan && (
                <div className="image-box">
                  <img
                    src={`data:image/png;base64,${bargraph_nan}`}
                    alt="NaN values"
                  />
                  <div className="fig-text">NaN Values</div>
                </div>
              )} */}
            </div>
            <div className="analysis-details">
              <h3 className="data-smells-title"> 2) Missing Values</h3>

              <Table
                col1Arr={analysisData.missing_values.missCols}
                col2Arr={analysisData.missing_values.missPer}
                col1={"Column Name"}
                col2={"Missing Percentage"}
                smellName={"Missing Values"}
              />
              {/* <ul className="data-smells-list">
                {splitIntoSentences(analysisData.missing_values.Info).map(
                  (sentence, index) => (
                    <li key={index}>{sentence}</li>
                  )
                )}
              </ul> */}
              {bargraph_nan && (
                <div className="image-box">
                  <img
                    src={`data:image/png;base64,${bargraph_nan}`}
                    alt="missing values"
                  />
                  <div className="fig-text">Missing Values</div>
                </div>
              )}
            </div>
            <div className="analysis-details">
              <h3 className="data-smells-title">3) Binning Categorical</h3>
              <Table
                col1Arr={analysisData.binning_cat.binCols}
                col2Arr={analysisData.binning_cat.unqVals}
                col1={"Column Name"}
                col2={"Unique values"}
                smellName={"Binning Categorical Columns"}
              />
              <Codebox
                language={language}
                code={analysisData.binning_cat.Code}
              />
              {bargraph_binning_cat && (
                <div className="image-box">
                  <img
                    src={`data:image/png;base64,${bargraph_binning_cat}`}
                    alt="binning_categorical"
                  />
                  <div className="fig-text">Binning Categorical</div>
                </div>
              )}
            </div>
            {/* Class Imbalance */}
            <div className="analysis-details">
              <h3 className="data-smells-title">4) Class Imbalance</h3>
              <Table
                col1Arr={analysisData.imbalance.imbCols}
                col2Arr={analysisData.imbalance.imbRatio}
                col1={"Column Name"}
                col2={"Imbalance ratio"}
                smellName={"Categorical Columns with Class Imbalance"}
              />
              {/* <ul className="data-smells-list">
                {splitIntoSentences(analysisData.imbalance.Info).map(
                  (sentence, index) => (
                    <li key={index}>{sentence}</li>
                  )
                )}
              </ul> */}
              <Codebox language={language} code={analysisData.imbalance.Code} />
              {bargraph_class_imbal && (
                <div className="image-box">
                  <img
                    src={`data:image/png;base64,${bargraph_class_imbal}`}
                    alt="class_imbalance"
                  />
                  <div className="fig-text"> Class Imbalance</div>
                </div>
              )}
            </div>
            <div className="analysis-details">
              <h3 className="data-smells-title">5) Special Characters</h3>

              <ul className="data-smells-list">
                {splitIntoSentences(analysisData.sp_char.Info).map(
                  (sentence, index) => (
                    <li key={index}>{sentence}</li>
                  )
                )}
              </ul>
              <Codebox language={language} code={analysisData.sp_char.Code} />
              {bargraph_sp_char && (
                <div className="image-box">
                  <img
                    src={`data:image/png;base64,${bargraph_sp_char}`}
                    alt="special_characters"
                  />
                  <div className="fig-text">{"Special Characters"}</div>
                </div>
              )}
            </div>
            <div className="analysis-details">
              <h3 className="data-smells-title">{"6) Human Friendly"}</h3>
              <ul className="data-smells-list">
                {splitIntoSentences(analysisData.hum_friendly.Info).map(
                  (sentence, index) => (
                    <li key={index}>{sentence}</li>
                  )
                )}
              </ul>
              <Codebox
                language={language}
                code={analysisData.hum_friendly.Code}
              />
              {bargraph_hum_friendly && (
                <div className="image-box">
                  <img
                    src={`data:image/png;base64,${bargraph_hum_friendly}`}
                    alt="hum_friendly"
                  />
                  <div className="fig-text"> Human Friendly</div>
                </div>
              )}
            </div>
            <div className="analysis-details">
              <h3 className="data-smells-title">{"7) Trailing Spaces"}</h3>
              <ul className="data-smells-list">
                {splitIntoSentences(analysisData.tr_spaces.Info).map(
                  (sentence, index) => (
                    <li key={index}>{sentence}</li>
                  )
                )}
              </ul>
              <Codebox language={language} code={analysisData.tr_spaces.Code} />
              {bargraph_tr_spaces && (
                <div className="image-box">
                  <img
                    src={`data:image/png;base64,${bargraph_tr_spaces}`}
                    alt="tr_spaces"
                  />
                  <div className="fig-text">{"8) Trailing Spaces"}</div>
                </div>
              )}
            </div>
            <div className="analysis-details">
              <h3 className="data-smells-title">{"9) Correlated Values"}</h3>
              <div className="heatmap-container">
                {heatmapData && (
                  <div className="image-box">
                    <img
                      src={`data:image/png;base64,${heatmapData}`}
                      alt="correlation heatmap"
                    />
                    <div className="fig-text">Correlation Heatmap</div>
                  </div>
                )}
                <ul className="data-smells-list">
                  {analysisData.correlated.map((sentence, index) => (
                    <li key={index}>{sentence}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="analysis-details">
              <h3 className="data-smells-title">{"10)Outliers"}</h3>
              <ul className="data-smells-list">
                {splitIntoSentences(analysisData.outliers.Info).map(
                  (sentence, index) => (
                    <li key={index}>{sentence}</li>
                  )
                )}
              </ul>
              <Codebox language={language} code={analysisData.outliers.Code} />
              {boxplot && (
                <div className="img-box">
                  <img src={`data:image/png;base64,${boxplot}`} alt="boxplot" />
                  <div className="fig-text">Fig. Boxplot</div>
                </div>
              )}
            </div>
            <div className="analysis-details">
              <h3 className="data-smells-title">{"11) Duplicate Values"}</h3>
              <ul className="data-smells-list">
                {splitIntoSentences(analysisData.duplicates).map(
                  (sentence, index) => (
                    <li key={index}>{sentence}</li>
                  )
                )}
              </ul>
            </div>
            <div className="analysis-details">
              <h3 className="data-smells-title">{"12)IntegerToString"}</h3>
              <ul className="data-smells-list">
                {splitIntoSentences(analysisData.int_to_str.Info).map(
                  (sentence, index) => (
                    <li key={index}>{sentence}</li>
                  )
                )}
              </ul>
              <Codebox language={language} code={analysisData.int_to_str.Code} />
            </div>
            <button className="download-btn" onClick={handleDownload} >
              Download Results as PDF
            </button>
            <div className="row mt-3">
              <div className="col-md-4 mb-3">
                <button className="btn btn-secondary w-100" onClick={handleRefactorAll}>
                  Refactor All Smells
                </button>
              </div>
              <div className="col-md-4 mb-3">
                <button className="btn btn-secondary w-100" onClick={handleRefactorSpecialMissingValues}>
                  Refactor Special Missing Values
                </button>
              </div>
              <div className="col-md-4 mb-3">
                <button className="btn btn-secondary w-100" onClick={handleRefactorMissingValues}>
                  Refactor Missing Values
                </button>
              </div>
              <div className="col-md-4 mb-3">
                <button className="btn btn-secondary w-100" onClick={handleRefactorBinningCategorical}>
                Refactor Binning Categorical
                </button>
              </div>
              <div className="col-md-4 mb-3">
                <button className="btn btn-secondary w-100" onClick={handleRefactorClassImbalance}>
                  Refactor Class Imbalance
                </button>
              </div>
              <div className="col-md-4 mb-3">
                <button className="btn btn-secondary w-100" onClick={handleRefactorSpecialCharacters}>
                  Refactor Special Characters
                </button>
              </div>
              <div className="col-md-4 mb-3">
                <button className="btn btn-secondary w-100" onClick={handleRefactorHumanFriendly}>
                  Refactor Human Friendly
                </button>
              </div>
              <div className="col-md-4 mb-3">
                <button className="btn btn-secondary w-100" onClick={handleRefactorTrailingSpaces}>
                  Refactor Trailing Spaces
                </button>
              </div>
              <div className="col-md-4 mb-3">
                <button className="btn btn-secondary w-100" onClick={handleRefactorDuplicateValues}>
                  Refactor Duplicate Values
                </button>
              </div>
              <div className="col-md-4 mb-3">
                <button className="btn btn-secondary w-100" onClick={handleRefactorOutliers}>
                  Refactor Outliers
                </button>
              </div>
              <div className="col-md-4 mb-3">
                <button className="btn btn-secondary w-100" onClick={handleIntToStr}>
                  Refactor Integers as String
                </button>
              </div>
              <div className="col-md-4 mb-3">
                <button className="btn btn-secondary w-100" onClick={handleUniqueValues}>
                  Refactor unique values
                </button>
              </div>
              <div className="col-md-4 mb-3">
                <button className="btn btn-secondary w-100" onClick={handlebinaryMissingvalues}>
                  Refactor binary missing values
                </button>
              </div>
              <div className="col-md-4 mb-3">
                <button className="btn btn-secondary w-100" onClick={downloadDataset}>
                  Dataset Download
                </button>
              </div>
              

            </div>
          </div>
        </div>
      )}
      {click && fileChosen && <RegExForm />}
    </div>
  );
}

function splitIntoSentences(text) {
  const sentences = text.split("\n");
  return sentences.filter((sentence) => sentence.length > 0);
}
