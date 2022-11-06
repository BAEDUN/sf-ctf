import {
  MDBCard,
  MDBCardBody,
  MDBContainer,
  MDBTabs,
  MDBTabsContent,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsPane,
} from "mdb-react-ui-kit";
import React, { useState } from "react";
import CreateChallenge from "./CreateChallenge/CreateChallenge";

enum Tab {
  CreateChallenge = "CreateChallenge",
}

export default function Admin() {
  const [tab, setTab] = useState<Tab>(Tab.CreateChallenge);

  return (
    <MDBContainer>
      <MDBCard
        style={{
          marginTop: "2rem",
        }}
      >
        <MDBCardBody>
          <MDBTabs className="mb-3">
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => setTab(Tab.CreateChallenge)}
                active={tab === Tab.CreateChallenge}
              >
                Create Challenge
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>
          <MDBTabsContent>
            <MDBTabsPane show={tab === Tab.CreateChallenge}>
              <CreateChallenge />
            </MDBTabsPane>
          </MDBTabsContent>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}
