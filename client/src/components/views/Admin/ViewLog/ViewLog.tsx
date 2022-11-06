import {
  MDBCardFooter,
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
import { useAuthContext } from "../../../../context/AuthProvider";
import handleNumberInput from "../../../../util/handleNumberInput";
import handleStringInput from "../../../../util/handleStringInput";

export default function ViewLog() {
  const { auth } = useAuthContext();
  const [targetIp, setTargetIp] = useState<string>("");
  const [targetUsername, setTargetUsername] = useState<string>("");
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
  }, [auth, targetIp, targetUsername, page]);
  const tableContent = useMemo(() => {
    return <MDBTableBody>{logs.map((log) => createRow(log))}</MDBTableBody>;
  }, [logs]);

  return (
    <>
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
            <th scope="col">Type</th>
            <th scope="col">Detail</th>
          </tr>
        </MDBTableHead>
        {tableContent}
      </MDBTable>

      <MDBCardFooter className="text-muted">
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
            />
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink>/ {totalPages}</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink
              href="#"
              onClick={() => checkedMovePage(page + 1)}
            >
              <span aria-hidden="true">»</span>
            </MDBPaginationLink>
          </MDBPaginationItem>
        </MDBPagination>
      </MDBCardFooter>
    </>
  );
}

function createRow(log: GetLogResponseDtoLogsInner) {
  const timeString = new Date(log.createdAt!).toLocaleTimeString();
  const ipString = log.ip!;
  const username = log.username!;
  const type = log.type!;
  // TODO: Use log._id as key
  const key = Math.random();
  switch (log.type!) {
    case GetLogResponseDtoLogsInnerTypeEnum.Login: {
      return (
        <tr key={key}>
          <td>{timeString}</td>
          <td>{ipString}</td>
          <td>{username}</td>
          <td>{type}</td>
          <td></td>
        </tr>
      );
    }

    case GetLogResponseDtoLogsInnerTypeEnum.Download: {
      return (
        <tr key={key}>
          <td>{timeString}</td>
          <td>{ipString}</td>
          <td>{username}</td>
          <td>{type}</td>
          <td>{log.filename!}</td>
        </tr>
      );
    }

    case GetLogResponseDtoLogsInnerTypeEnum.Submit: {
      return (
        <tr key={key}>
          <td>{timeString}</td>
          <td>{ipString}</td>
          <td>{username}</td>
          <td>{type}</td>
          <td>{`${log.solved ? "Correct" : "Incorrect"}: ${log.flag!}`}</td>
        </tr>
      );
    }
  }
}
