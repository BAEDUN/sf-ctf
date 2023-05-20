import {
  MDBCardHeader,
  MDBInput,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import React, { useEffect, useMemo, useState } from "react";
import {
  GetLogResponseDtoLogsInner,
  GetLogResponseDtoLogsInnerTypeEnum,
  LogApi,
} from "../../../../api";
import handleNumberInput from "../../../../util/handleNumberInput";
import handleStringInput from "../../../../util/handleStringInput";
import { AuthState } from "../../../../state/AuthState";
import { useRecoilValue } from "recoil";

export default function ViewLog() {
  const auth = useRecoilValue(AuthState.auth);
  const [targetIp, setTargetIp] = useState<string>("");
  const [targetUsername, setTargetUsername] = useState<string>("");
  const [targetNickname, setTargetNickname] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [logs, setLogs] = useState<GetLogResponseDtoLogsInner[]>([]);

  async function getLog() {
    if (!auth) {
      return;
    }
    const response = await new LogApi(
      undefined,
      location.origin
    ).logControllerGet({
      accessToken: auth.token,
      ip: targetIp,
      username: targetUsername,
      nickname: targetNickname,
      page: page - 1,
    });

    const { logs, pages } = response.data;
    setLogs(logs);
    setTotalPages(pages);
  }

  function checkedMovePage(newPage: number) {
    const outRange = newPage < 1 || newPage > totalPages;
    if (outRange) {
      return;
    }
    setPage(newPage);
  }

  useEffect(() => {
    getLog();
  }, [auth, targetIp, targetUsername, targetNickname, page]);
  const tableContent = useMemo(() => {
    return <MDBTableBody>{logs.map((log) => createRow(log))}</MDBTableBody>;
  }, [logs]);

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
      <MDBTable color="dark" small>
        <MDBTableHead>
          <tr>
            <th scope="col">Time</th>
            <th scope="col">
              <MDBInput
                contrast
                label="IP"
                value={targetIp}
                onChange={handleStringInput(setTargetIp)}
              />
            </th>
            <th scope="col">
              <MDBInput
                contrast
                label="Username"
                value={targetUsername}
                onChange={handleStringInput(setTargetUsername)}
              />
            </th>
            <th scope="col">
              <MDBInput
                contrast
                label="Nickname"
                value={targetNickname}
                onChange={handleStringInput(setTargetNickname)}
              />
            </th>
            <th scope="col">Type</th>
            <th scope="col">Detail</th>
          </tr>
        </MDBTableHead>
        {tableContent}
      </MDBTable>
    </>
  );
}

function createRow(log: GetLogResponseDtoLogsInner) {
  const timeString = new Date(log.createdAt!).toLocaleString();
  const ipString = log.ip!;
  const username = log.username!;
  const nickname = log.nickname!;
  const type = log.type!;
  const key = log.id!;
  switch (log.type!) {
    case GetLogResponseDtoLogsInnerTypeEnum.Login: {
      return (
        <tr key={key}>
          <td title={timeString}>{timeString}</td>
          <td title={ipString}>{ipString}</td>
          <td title={username}>{username}</td>
          <td title={nickname}>{nickname}</td>
          <td title={type}>{type}</td>
          <td></td>
        </tr>
      );
    }

    case GetLogResponseDtoLogsInnerTypeEnum.Download: {
      return (
        <tr key={key}>
          <td title={timeString}>{timeString}</td>
          <td title={ipString}>{ipString}</td>
          <td title={username}>{username}</td>
          <td title={nickname}>{nickname}</td>
          <td title={type}>{type}</td>
          <td title={log.filename!}>{log.filename!}</td>
        </tr>
      );
    }

    case GetLogResponseDtoLogsInnerTypeEnum.Submit: {
      return (
        <tr key={key}>
          <td title={timeString}>{timeString}</td>
          <td title={ipString}>{ipString}</td>
          <td title={username}>{username}</td>
          <td title={nickname}>{nickname}</td>
          <td title={type}>{type}</td>
          <td
            title={`${log.solved ? "Correct" : "Incorrect"}: ${log.flag!}`}
          >{`${log.solved ? "Correct" : "Incorrect"}: ${log.flag!}`}</td>
        </tr>
      );
    }
  }
}
