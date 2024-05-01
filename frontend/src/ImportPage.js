import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { DropzoneArea } from "mui-file-dropzone";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Collapse from "@mui/material/Collapse";
import LinearProgress from "@mui/material/LinearProgress";


const ImportPage = (props) => {
    console.log(props.loggedIn)
	const [files, setFiles] = useState([]);
	const [fileType, setFileType] = useState("County Data");
	const [algName, setAlgName] = useState("");
	const [increment, setIncrement] = useState(0);
	const [alert, setAlert] = useState("");
	const [alertOpen, setAlertOpen] = useState(false);
	const [alertSeverity, setAlertSeverity] = useState("");
    const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		if (files.length === 0) {
			setAlert("Please select a file.");
			setAlertSeverity("error");
			setAlertOpen(true);
			return;
		}
		if (fileType === "Prediction Data" && algName === "") {
			setAlert("Please enter a prediction Algorithm Name");
			setAlertSeverity("error");
			setAlertOpen(true);
			return;
		}
		let fileTypeForm = "prediction";
		if (fileType === "County Data") {
			fileTypeForm = "county";
		}
		const formData = new FormData();
		formData.append("file", files[0]);
		formData.append("algName", algName);
		formData.append("fileType", fileTypeForm);

		try {
            setLoading(true);
			const response = await axios.post(`${process.env.REACT_APP_API_URL}/db/upload`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
            setLoading(false);
			setFiles([]);
			setAlgName("");
			setIncrement(increment + 1);
			console.log("File uploaded successfully", response.data);
			setAlert("File uploaded successfully.");
			setAlertSeverity("success");
			setAlertOpen(true);
		} catch (error) {
            setLoading(false);
			console.error("Error uploading file:", error);
			setAlert("File uploaded successfully:" + error);
			setAlertSeverity("error");
			setAlertOpen(true);
		}
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column" }}>
			<Collapse in={alertOpen}>
				<Alert
					variant="filled"
					severity={alertSeverity}
					action={
						<IconButton
							aria-label="close"
							color="inherit"
							size="small"
							onClick={() => {
								setAlertOpen(false);
							}}
						>
							<CloseIcon fontSize="inherit" />
						</IconButton>
					}
					sx={{ mb: 2 }}
				>
					{alert}
				</Alert>
			</Collapse>
			{!props.loggedIn ? (
				<h1>Please Log in to access file uploading</h1>
			) : (
				<Box sx={{ display: "flex", flexDirection: "column ", pl: 20, pr: 20, mt: 5 }}>
					<DropzoneArea
						key={increment}
						acceptedFiles={[".xlsx"]}
						filesLimit={1}
						maxFileSize={5000000}
						dropzoneText={"Drag and drop an .xlsx file here"}
						showAlerts={["error", "info"]}
						onChange={(files) => setFiles(files)}
					/>
					<FormControl fullWidth sx={{ marginTop: 2 }}>
						<InputLabel>File Type</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={fileType}
							label="County Data"
							onChange={(e) => {
								setFileType(e.target.value);
							}}
						>
							<MenuItem value={"County Data"}>County Data</MenuItem>
							<MenuItem value={"Prediction Data"}>Prediction Data</MenuItem>
						</Select>
					</FormControl>
					{fileType === "Prediction Data" && (
						<TextField
							value={algName}
							label="Prediction Algorithm Name"
							variant="outlined"
							required
							sx={{ marginTop: 2 }}
							onChange={(e) => {
								setAlgName(e.target.value);
							}}
						></TextField>
					)}
					<Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
						Upload File
					</Button>
                    {loading && <><LinearProgress sx={{mt:2}} />
                    <p>Loading...</p></>}

					{/* <input type="file" onChange={handleFileChange}></input> */}
				</Box>
			)}
		</Box>
	);
};

export default ImportPage;