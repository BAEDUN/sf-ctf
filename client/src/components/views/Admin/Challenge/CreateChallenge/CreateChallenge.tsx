import {
  MDBBtn,
  MDBContainer,
  MDBInput,
  MDBListGroup,
  MDBListGroupItem,
  MDBSpinner,
  MDBTextArea,
} from "mdb-react-ui-kit";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChallengeApi,
  CreateChallengeRequestDtoCategoryEnum,
  FileApi,
} from "../../../../../api";
import { useAuthContext } from "../../../../../context/AuthProvider";
import handleNumberInput from "../../../../../util/handleNumberInput";
import handleStringInput from "../../../../../util/handleStringInput";
import CategorySelect from "../CategorySelect";

export default function CreateChallenge() {
  const { auth } = useAuthContext();
  const [category, setCategory] =
    useState<CreateChallengeRequestDtoCategoryEnum>(
      CreateChallengeRequestDtoCategoryEnum.Forensic
    );
  const [description, setDescription] = useState<string>("");
  const [flag, setFlag] = useState<string>("");
  const [fileList, setFileList] = useState<string[]>([]);
  const [minimumScore, setMinimumScore] = useState<number>(100);
  const [maximumScore, setMaximumScore] = useState<number>(1000);
  const [maximumSolvedUserCount, setMaximumSolvedUserCount] =
    useState<number>(40);
  const [title, setTitle] = useState<string>("");
  const [fileUploading, setFileUploading] = useState<boolean>(false);
  const navigate = useNavigate();

  async function createChallenge() {
    if (!auth) {
      navigate("/login");
      return null;
    }
    await new ChallengeApi(undefined, location.origin)
      .challengeControllerCreate({
        accessToken: auth.token,
        title,
        flag,
        description,
        category,
        fileList,
        grading: {
          minimumScore,
          maximumScore,
          maximumSolvedUserCount,
        },
      })
      .then(() => {
        alert("Created");
      })
      .catch((error) => {
        alert(error);
      });
  }
  async function uploadFile() {
    if (!auth) {
      navigate("/login");
      return null;
    }
    setFileUploading(true);
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.onchange = async () => {
      const file = fileInput.files?.item(0);
      if (!file) {
        alert("File not selected");
        setFileUploading(false);
        return;
      }
      const response = await new FileApi(undefined, location.origin)
        .fileControllerPut({
          accessToken: auth.token,
          filename: file.name,
        })
        .catch((error) => {
          setFileUploading(false);
          throw error;
        });

      const uploadResponse = await fetch(response.data.presignedUrl, {
        method: "PUT",
        body: file,
      }).catch((error) => {
        setFileUploading(false);
        throw error;
      });
      if (uploadResponse.ok) {
        setFileList((fileList) => [...fileList, file.name]);
        setFileUploading(false);
        return;
      }
      setFileUploading(false);
      throw uploadResponse;
    };
    fileInput.click();
  }

  return (
    <div
      className="bg-dark d-flex flex-column justify-content-center"
      style={{
        height: "100%",
        width: "100%",
        position: "absolute",
        top: "0",
        left: "0",
        zIndex: "-7",
        minWidth: "100vw",
        minHeight: "100vh",
        alignItems: "center",
      }}
    >
      <div className="Title">
        <h1>CREATE</h1>
      </div>
      <MDBInput
        wrapperClass="mb-4 bg-light w-50"
        label="Title"
        value={title}
        onChange={handleStringInput(setTitle)}
      />
      <CategorySelect setCategory={setCategory} />
      <MDBTextArea
        wrapperClass="mb-4 bg-light w-50"
        label="Description"
        value={description}
        onChange={handleStringInput(setDescription)}
      />
      <MDBInput
        wrapperClass="mb-4 bg-light w-50"
        label="Flag"
        value={flag}
        onChange={handleStringInput(setFlag)}
      />
      <MDBInput
        wrapperClass="mb-4 bg-light w-50"
        label="Minimum Score"
        value={minimumScore}
        type="number"
        onChange={handleNumberInput(setMinimumScore)}
      />
      <MDBInput
        wrapperClass="mb-4 bg-light w-50"
        label="Maximum Score"
        value={maximumScore}
        type="number"
        onChange={handleNumberInput(setMaximumScore)}
      />
      <MDBInput
        wrapperClass="mb-4 bg-light w-50"
        label="Maximum Solved User Count"
        value={maximumSolvedUserCount}
        type="number"
        onChange={handleNumberInput(setMaximumSolvedUserCount)}
      />

      <MDBListGroup className="mb-4 bg-light w-50">
        <MDBListGroupItem
          tag="a"
          href="#"
          action
          active
          onClick={() => uploadFile()}
        >
          Add New File
        </MDBListGroupItem>
        {fileUploading ? (
          <MDBListGroupItem>
            <MDBSpinner />
          </MDBListGroupItem>
        ) : null}
        {fileList.map((filename) => (
          <MDBListGroupItem>{filename}</MDBListGroupItem>
        ))}
      </MDBListGroup>
      <MDBBtn className="mb-4 w-50" block onClick={() => createChallenge()}>
        Create
      </MDBBtn>
    </div>
  );
}
