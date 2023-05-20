import React, {
  useState,
  useCallback,
  useRef,
  useContext,
  useEffect,
} from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  ChallengeApi,
  FileApi,
  GetAllChallengesResponseDtoChallengesInner,
  GetSolversResponseDtoSolversInner,
  LogApi,
  RankingRequestDtoSectionEnum,
  RankingResponseDtoUsersInner,
  UserApi,
} from "../../../api";
import { AuthContext } from "../../../context/AuthProvider";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";

const solvesPageSize = 10;

export default function Challenge(props: {
  challenge: GetAllChallengesResponseDtoChallengesInner;
  solved: boolean;
  onSolved: (title: string) => void;
}) {
  const { challenge, solved, onSolved } = props;
  const hasDownloads = challenge.fileList!.length !== 0;
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(undefined);
  const hasError = error !== undefined;
  const navigate = useNavigate();

  const [section, _setSection] = useState<
    RankingRequestDtoSectionEnum | undefined
  >(undefined);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageSize, _setPageSize] = useState<number>(100);
  const [users, setUsers] = useState<RankingResponseDtoUsersInner[]>([]);
  const numPages = Math.ceil(totalPages / pageSize);
  const [solvers, setSolvers] = useState<GetSolversResponseDtoSolversInner[]>(
    []
  );
  const [pages, setPages] = useState<number>(0);

  const [value, setValue] = useState("");
  const handleInputChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) =>
      setValue(event.currentTarget.value),
    []
  );
  const { auth } = useContext(AuthContext);
  const modalBodyRef = useRef<any>(null);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!auth) {
        return;
      }
      const challengeApi = new ChallengeApi(undefined, location.origin);
      await challengeApi
        .challengeControllerSubmitFlag({
          accessToken: auth.token,
          title: challenge.title!,
          flag: value.trim(),
        })
        .then((response) => {
          const { success } = response.data;
          if (success === true) {
            toast.success("정답입니다!", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            onSolved(challenge.title!);
          } else {
            toast.error("땡!! 다시!", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });

            setError(error);
          }
        })
        .catch((err) => {
          if (err.response.status === 409) {
            toast.error("이미 맞추신 문제입니다!", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            setError(error);
          }
        });
    },
    [auth, onSolved, challenge, value]
  );

  const download = useCallback(
    async (event: React.MouseEvent<HTMLElement>, filename: string) => {
      event.preventDefault();
      if (!auth) {
        console.log("no auth");
        return null;
      }

      const response = await new FileApi(
        undefined,
        location.origin
      ).fileControllerGet({
        accessToken: auth.token,
        filename,
      });
      const a = document.createElement("a");
      a.href = response.data.presignedUrl;
      a.download = filename;
      a.click();
    },
    [auth]
  );

  const clickSolvesModal = useCallback(
    async (event: React.MouseEvent<HTMLElement>) => {
      setIsOpen(true);

      if (!auth || !challenge.title) {
        return;
      }
      const logApi = new LogApi(undefined, location.origin);
      const response = await logApi.logControllerGetSolvers({
        accessToken: auth?.token,
        challengeTitle: challenge.title,
        page: 0,
      });
      if (!response) {
        toast.error("error!!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return;
      }
      const { solvers, pages } = response.data;
      setSolvers(solvers);
      setPages(pages);
    },
    [challenge.title]
  );

  return (
    <div className="ChallFrame">
      <div className="frameBody">
        <div className="Row noPadding">
          <div className="Col-2 noPadding">
            <div className="frameTitle">
              {challenge.category}/{challenge.title}
            </div>
            <div className="frameSubTitle noMargin">
              {challenge.authorUsername}
            </div>
          </div>
          <div className="Col-2 noPadding textRight">
            <a className="solvesAndPoints" onClick={clickSolvesModal}>
              {challenge.solverCount}
              {challenge.solverCount === 1 ? " solve / " : " solves / "}
              {challenge.score}
              {challenge.score === 1 ? " score" : " scores"}
            </a>
          </div>
        </div>

        <div className="Center">
          <div className="divider" />
        </div>

        <div
          className="description frameSubTitle"
          style={{
            whiteSpace: "pre-line",
          }}
        >
          {/* <Markdown content={challenge.description} components={markdownComponents} /> */}
          {challenge.description}
        </div>
        <form className="formSection" onSubmit={handleSubmit}>
          <div className="formGroup">
            <input
              autoComplete="off"
              autoCorrect="off"
              className={`formGroupInput input ${
                hasError ? "inputError" : ""
              } ${solved ? "inputSuccess" : ""}`}
              placeholder={`Flag${solved ? " (solved)" : ""}`}
              value={value}
              onChange={handleInputChange}
            />
            <button className="formGroupBtn submit">Submit</button>
          </div>
        </form>
        {hasDownloads && (
          <div>
            <p className="frameSubTitle noMargin">Downloads</p>
            <div className="tagContainer">
              {challenge.fileList!.map((filename) => {
                return (
                  <div className="tag" key={`file-download-${filename}`}>
                    <a
                      href="#"
                      onClick={(event) => {
                        download(event, filename);
                      }}
                    >
                      {filename}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <Modal
        challengeTitle={challenge.title!}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalBodyRef={modalBodyRef}
      />
    </div>
  );
}
