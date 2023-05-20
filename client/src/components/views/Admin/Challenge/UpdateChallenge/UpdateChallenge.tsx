import {
  MDBBtn,
  MDBCardHeader,
  MDBInput,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChallengeApi,
  GetAllChallengesResponseDtoChallengesInner,
  UserApi,
} from "../../../../../api";
import { useAuthContext } from "../../../../../context/AuthProvider";
import handleNumberInput from "../../../../../util/handleNumberInput";
import handleStringInput from "../../../../../util/handleStringInput";

export function UpdateChallenge() {
  const { auth } = useAuthContext();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<
    GetAllChallengesResponseDtoChallengesInner[]
  >([]);
  const [targetTitle, setTargetTitle] = useState<string>("");
  const [targetCategory, setTargetCategory] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const location = useLocation();
  const title = location.state?.title || "";

  const loadChallenges = useCallback(() => {
    if (!auth) {
      return;
    }
    const challengeApi = new ChallengeApi(undefined, window.location.origin);
    challengeApi
      .challengeControllerGetAll({
        accessToken: auth.token,
      })
      .then((response) => {
        const { challenges } = response.data;
        setChallenges(challenges);
      });
  }, [auth]);

  useEffect(() => {
    loadChallenges();
  }, [auth]);

  function checkedMovePage(newPage: number) {
    const outRange = newPage < 1 || newPage > totalPages;
    if (outRange) {
      return;
    }
    setPage(newPage);
  }

  function deleteChallenge(title: string) {
    const challengeApi = new ChallengeApi(undefined, window.location.origin);
    challengeApi
      .challengeControllerDeleteChallenge(title)
      .then(() => {
        setChallenges((challenges) =>
          challenges.filter((challenge) => challenge.title !== title)
        );
        alert("Deleted");
      })
      .catch((error) => {
        alert(error);
      });
  }

  const tableContent = useMemo(
    () => (
      <MDBTableBody>
        {challenges.map((challenge) => {
          const title = challenge.title!;
          const category = challenge.category!;
          const key = `challenge-row-${title}`;

          return (
            <tr key={key} className="table-dark">
              <td title={title}>{title}</td>
              <td title={category}>{category}</td>
              <td>
                <MDBBtn
                  onClick={() => {
                    navigate(`./${title}`, {
                      state: {
                        title,
                      },
                    });
                  }}
                >
                  Update
                </MDBBtn>
              </td>
              <td>
                <MDBBtn
                  onClick={() => {
                    deleteChallenge(title);
                  }}
                >
                  Delete
                </MDBBtn>
              </td>
            </tr>
          );
        })}
      </MDBTableBody>
    ),
    [challenges]
  );

  return (
    <>
      <MDBCardHeader className="text-white bg-dark">
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBPaginationLink
              href="#"
              onClick={() => checkedMovePage(page - 1)}
            >
              <span aria-hidden="true">«</span>
            </MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBInput
              label="Page"
              value={page}
              onChange={handleNumberInput(setPage)}
              style={{ color: "#fff" }}
            />
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink style={{ color: "#fff" }}>
              / {totalPages}
            </MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink
              href="#"
              onClick={() => checkedMovePage(page + 1)}
            >
              <span aria-hidden="true" style={{ color: "#fff" }}>
                »
              </span>
            </MDBPaginationLink>
          </MDBPaginationItem>
        </MDBPagination>
      </MDBCardHeader>
      <MDBTable small>
        <MDBTableHead>
          <tr className="table-dark">
            <th scope="col">
              <MDBInput
                contrast
                label="Title"
                value={targetTitle}
                onChange={handleStringInput(setTargetTitle)}
              />
            </th>
            <th scope="col">
              <MDBInput
                contrast
                label="Category"
                value={targetCategory}
                onChange={handleStringInput(setTargetCategory)}
              />
            </th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
          </tr>
        </MDBTableHead>
        {tableContent}
      </MDBTable>
    </>
  );
}
