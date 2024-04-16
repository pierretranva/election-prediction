import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { DropzoneArea } from "mui-file-dropzone";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"

const ImportPage = (loggedIn, user) => {
	const [files, setFiles] = useState(null);
    const [fileType, setFileType] = useState("County Data");


	const handleSubmit = async () => {
		if (!files) {
			alert("Please select a file.");
			return;
		}
		const formData = new FormData();
		formData.append("file", files);

		try {
			const response = await axios.post("http://localhost:3000/upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
            setFiles(null)
			console.log("File uploaded successfully", response.data);
		} catch (error) {
			console.error("Error uploading file:", error);
		}
	};

	return (
		<Box sx={{display: 'flex', flexDirection: 'column'}}>
			{!loggedIn ? (
				<h1>Please Log in to access file uploading</h1>
			) : (
				<Box sx={{display: 'flex', flexDirection:'column ', pl: 20, pr:20, mt: 5}}>
					<DropzoneArea
						acceptedFiles={[".xlsx"]}
						maxFileSize={5000000}
						dropzoneText={"Drag and drop an .xlsx file here"}
						showAlerts={["error", "info"]}
						onChange={(files) => setFiles(files)}
                        
					/>
					<FormControl fullWidth sx={{marginTop: 2}}>
						<InputLabel>File Type</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={fileType}
							label="County Data"
							onChange={(e) => {setFileType(e.target.value)}}
						>
							<MenuItem value={"County Data"}>County Data</MenuItem>
							<MenuItem value={"Prediction Data"}>Prediction Data</MenuItem>
						</Select>
					</FormControl>
                    <TextField label="Filename" variant="outlined" required sx={{marginTop: 2}}></TextField>
                        <Button variant="contained" onClick={handleSubmit} sx={{mt: 2}}>Upload File</Button>

					{/* <input type="file" onChange={handleFileChange}></input> */}
                    </Box>

			)}

		</Box>
	);
};

export default ImportPage;
